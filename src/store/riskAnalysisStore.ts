import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TelemetryEvent } from './telemetryStore';

interface RiskScore {
  score: number;
  factors: {
    eventFrequency: number;
    eventSeverity: number;
    timePatterns: number;
    locationRisk: number;
    behaviorPattern: number;
  };
  recommendations: string[];
  riskLevel: 'Baixo' | 'Médio' | 'Alto' | 'Crítico';
  analysis: string;
}

interface RiskAnalysisState {
  analyses: Record<string, RiskScore>;
  analyzeRisk: (events: TelemetryEvent[], driverId: string) => RiskScore;
}

// Event severity weights
const EVENT_WEIGHTS = {
  'Excesso de Velocidade': 0.8,
  'Frenagem Brusca': 0.7,
  'Curva Acentuada': 0.6,
  'Aceleração Rápida': 0.5,
};

// Time risk factors (higher risk during certain hours)
const TIME_RISK_HOURS = {
  high: [0, 1, 2, 3, 4, 5, 22, 23], // Late night/early morning
  medium: [6, 7, 8, 18, 19, 20, 21], // Rush hours
  low: [9, 10, 11, 12, 13, 14, 15, 16, 17], // Regular hours
};

export const useRiskAnalysisStore = create<RiskAnalysisState>()(
  persist(
    (set, get) => ({
      analyses: {},
      analyzeRisk: (events: TelemetryEvent[], driverId: string) => {
        // Skip if no events
        if (events.length === 0) {
          return {
            score: 0,
            factors: {
              eventFrequency: 0,
              eventSeverity: 0,
              timePatterns: 0,
              locationRisk: 0,
              behaviorPattern: 0,
            },
            recommendations: ['Não há dados suficientes para análise'],
            riskLevel: 'Baixo',
            analysis: 'Não há eventos registrados para análise.'
          };
        }

        // 1. Event Frequency Analysis
        const eventsPerDay = events.length / 30; // Assuming 30-day period
        const frequencyScore = Math.min(100, eventsPerDay * 20);

        // 2. Event Severity Analysis
        const severityScores = events.map(event => EVENT_WEIGHTS[event.evento as keyof typeof EVENT_WEIGHTS] || 0.3);
        const averageSeverity = (severityScores.reduce((a, b) => a + b, 0) / events.length) * 100;

        // 3. Time Pattern Analysis
        const timeScores = events.map(event => {
          const hour = new Date(event.data).getHours();
          if (TIME_RISK_HOURS.high.includes(hour)) return 1;
          if (TIME_RISK_HOURS.medium.includes(hour)) return 0.6;
          return 0.3;
        });
        const timeRiskScore = (timeScores.reduce((a, b) => a + b, 0) / events.length) * 100;

        // 4. Location Risk Analysis
        const uniqueLocations = new Set(events.map(e => `${e.latitude},${e.longitude}`));
        const locationDiversity = (uniqueLocations.size / events.length) * 100;
        const locationRiskScore = Math.min(100, locationDiversity * 1.5);

        // 5. Behavior Pattern Analysis
        const eventTypes = events.reduce((acc: Record<string, number>, event) => {
          acc[event.evento] = (acc[event.evento] || 0) + 1;
          return acc;
        }, {});
        const mostFrequentEvent = Object.entries(eventTypes)
          .sort(([, a], [, b]) => b - a)[0];
        const behaviorScore = (mostFrequentEvent[1] / events.length) * 100;

        // Calculate final risk score (weighted average)
        const weights = {
          frequency: 0.25,
          severity: 0.3,
          time: 0.15,
          location: 0.15,
          behavior: 0.15,
        };

        const finalScore = (
          frequencyScore * weights.frequency +
          averageSeverity * weights.severity +
          timeRiskScore * weights.time +
          locationRiskScore * weights.location +
          behaviorScore * weights.behavior
        );

        // Generate recommendations
        const recommendations: string[] = [];
        if (frequencyScore > 70) {
          recommendations.push('Reduzir a frequência geral de eventos de risco');
        }
        if (averageSeverity > 70) {
          recommendations.push('Focar na redução de eventos de alta severidade');
        }
        if (timeRiskScore > 70) {
          recommendations.push('Evitar condução em horários de alto risco');
        }
        if (locationRiskScore > 70) {
          recommendations.push('Atenção especial em áreas de risco frequente');
        }
        if (behaviorScore > 70) {
          recommendations.push(`Trabalhar na redução de ${mostFrequentEvent[0]}`);
        }

        // Determine risk level
        let riskLevel: 'Baixo' | 'Médio' | 'Alto' | 'Crítico';
        if (finalScore < 40) riskLevel = 'Baixo';
        else if (finalScore < 60) riskLevel = 'Médio';
        else if (finalScore < 80) riskLevel = 'Alto';
        else riskLevel = 'Crítico';

        // Generate analysis text
        const analysis = `Análise baseada em ${events.length} eventos nos últimos 30 dias. 
          O condutor apresenta uma frequência de ${eventsPerDay.toFixed(1)} eventos por dia, 
          com severidade média de ${averageSeverity.toFixed(1)}%. 
          ${mostFrequentEvent[0]} é o tipo de evento mais frequente, 
          representando ${((mostFrequentEvent[1] / events.length) * 100).toFixed(1)}% dos casos. 
          ${timeRiskScore > 50 ? 'Há uma concentração significativa de eventos em horários de risco.' : 'A distribuição temporal dos eventos é adequada.'} 
          ${locationRiskScore > 50 ? 'Os eventos estão concentrados em áreas específicas.' : 'Boa distribuição geográfica dos eventos.'}`;

        const riskScore = {
          score: Math.round(finalScore),
          factors: {
            eventFrequency: Math.round(frequencyScore),
            eventSeverity: Math.round(averageSeverity),
            timePatterns: Math.round(timeRiskScore),
            locationRisk: Math.round(locationRiskScore),
            behaviorPattern: Math.round(behaviorScore),
          },
          recommendations,
          riskLevel,
          analysis,
        };

        // Update store
        set(state => ({
          analyses: {
            ...state.analyses,
            [driverId]: riskScore
          }
        }));

        return riskScore;
      },
    }),
    {
      name: 'risk-analysis-storage',
    }
  )
);