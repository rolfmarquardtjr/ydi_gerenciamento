import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useTelemetryStore } from './telemetryStore';
import { useUserStore } from './userStore';

interface DashboardMetrics {
  fleetScore: number;
  activeDrivers: number;
  driversAtRisk: number;
  aiAnalysis: number;
  eventsByType: Record<string, number>;
  driverScores: {
    excellent: number;
    good: number;
    regular: number;
    bad: number;
    critical: number;
  };
}

interface DashboardState {
  metrics: DashboardMetrics;
  calculateMetrics: () => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      metrics: {
        fleetScore: 0,
        activeDrivers: 0,
        driversAtRisk: 0,
        aiAnalysis: 0,
        eventsByType: {},
        driverScores: {
          excellent: 0,
          good: 0,
          regular: 0,
          bad: 0,
          critical: 0,
        },
      },
      calculateMetrics: () => {
        const telemetryEvents = useTelemetryStore.getState().events;
        const users = useUserStore.getState().users;

        // Calculate event statistics
        const eventsByType = telemetryEvents.reduce((acc: Record<string, number>, event) => {
          acc[event.evento] = (acc[event.evento] || 0) + 1;
          return acc;
        }, {});

        // Calculate driver metrics
        const driverEvents = telemetryEvents.reduce((acc: Record<string, number>, event) => {
          acc[event.id_operador] = (acc[event.id_operador] || 0) + 1;
          return acc;
        }, {});

        // Calculate scores
        const driverScores = Object.entries(driverEvents).reduce(
          (acc: Record<string, number>, [driverId, events]) => {
            // Simple score calculation: 100 - (events * 2)
            acc[driverId] = Math.max(0, Math.min(100, 100 - events * 2));
            return acc;
          },
          {}
        );

        // Calculate score distribution
        const scoreDistribution = Object.values(driverScores).reduce(
          (acc, score) => {
            if (score >= 80) acc.excellent++;
            else if (score >= 60) acc.good++;
            else if (score >= 40) acc.regular++;
            else if (score >= 20) acc.bad++;
            else acc.critical++;
            return acc;
          },
          { excellent: 0, good: 0, regular: 0, bad: 0, critical: 0 }
        );

        // Calculate average fleet score
        const fleetScore = Object.values(driverScores).reduce((sum, score) => sum + score, 0) / 
                          Object.values(driverScores).length || 0;

        const activeDrivers = users.filter(user => user.perfil === 'Condutor').length;
        const driversAtRisk = Object.values(driverScores).filter(score => score < 40).length;

        set({
          metrics: {
            fleetScore: Math.round(fleetScore),
            activeDrivers,
            driversAtRisk,
            aiAnalysis: telemetryEvents.length, // Number of events analyzed
            eventsByType,
            driverScores: scoreDistribution,
          },
        });
      },
    }),
    {
      name: 'dashboard-storage',
    }
  )
);