import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as XLSX from 'xlsx';
import { useUserStore } from './userStore';
import { useAuthStore } from './authStore';

export interface TelemetryEvent {
  id_operador: string;
  data: string;
  evento: string;
  latitude: number;
  longitude: number;
  nome_operador: string;
}

interface TelemetryState {
  events: TelemetryEvent[];
  importTelemetry: (file: File) => Promise<void>;
  getEventsByOperator: (operatorId: string) => TelemetryEvent[];
  getEventsByCompany: (companyId: string) => TelemetryEvent[];
}

export const useTelemetryStore = create<TelemetryState>()(
  persist(
    (set, get) => ({
      events: [],
      importTelemetry: async (file: File) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const data = new Uint8Array(e.target?.result as ArrayBuffer);
              const workbook = XLSX.read(data, { type: 'array' });
              const firstSheetName = workbook.SheetNames[0];
              const worksheet = workbook.Sheets[firstSheetName];
              const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false }) as any[];

              // Get current user's company ID
              const currentUser = useAuthStore.getState().user;
              if (!currentUser?.companyId) {
                reject(new Error('Usuário não está associado a uma empresa'));
                return;
              }

              // Get company users for validation
              const companyUsers = useUserStore.getState().getUsersByCompany(currentUser.companyId);

              // Field mapping for case-insensitive matching
              const fieldMapping: { [key: string]: string } = {
                'id do operador': 'id_operador',
                'idoperador': 'id_operador',
                'id_operador': 'id_operador',
                'data': 'data',
                'evento': 'evento',
                'latitude': 'latitude',
                'longitude': 'longitude',
                'nome do operador': 'nome_operador',
              };

              // Map fields and normalize data
              const processedData = jsonData.map((row, index) => {
                const normalizedRow: any = {};
                
                // Convert all keys to lowercase for comparison
                const rowWithLowerKeys = Object.fromEntries(
                  Object.entries(row).map(([key, value]) => [key.toLowerCase(), value])
                );

                // Map each required field
                Object.entries(fieldMapping).forEach(([sourceKey, targetKey]) => {
                  const value = rowWithLowerKeys[sourceKey.toLowerCase()];
                  if (value !== undefined) {
                    normalizedRow[targetKey] = value;
                  }
                });

                // Validate and convert coordinates to numbers
                if (normalizedRow.latitude) {
                  normalizedRow.latitude = Number(normalizedRow.latitude);
                }
                if (normalizedRow.longitude) {
                  normalizedRow.longitude = Number(normalizedRow.longitude);
                }

                return normalizedRow;
              });

              // Validate required fields
              const requiredFields = ['id_operador', 'data', 'evento', 'latitude', 'longitude', 'nome_operador'];
              const missingFields = processedData.reduce((acc: string[], event, index) => {
                const missing = requiredFields.filter(field => !event[field]);
                if (missing.length > 0) {
                  acc.push(`Linha ${index + 2}: campos obrigatórios faltando: ${missing.join(', ')}`);
                }
                return acc;
              }, []);

              if (missingFields.length > 0) {
                reject(new Error(missingFields.join('\n')));
                return;
              }

              // Validate operator IDs exist in company
              const invalidOperators = processedData.reduce((acc: string[], event, index) => {
                const operatorExists = companyUsers.some(user => user.id_operador === event.id_operador);
                if (!operatorExists) {
                  acc.push(`Linha ${index + 2}: ID do Operador não encontrado na empresa: ${event.id_operador}`);
                }
                return acc;
              }, []);

              if (invalidOperators.length > 0) {
                reject(new Error(invalidOperators.join('\n')));
                return;
              }

              // Add events
              set((state) => ({
                events: [...state.events, ...processedData]
              }));
              
              resolve();
            } catch (error) {
              reject(new Error('Erro ao processar o arquivo. Verifique se o formato está correto.'));
            }
          };
          reader.onerror = (error) => reject(error);
          reader.readAsArrayBuffer(file);
        });
      },
      getEventsByOperator: (operatorId: string) => {
        return get().events.filter(event => event.id_operador === operatorId);
      },
      getEventsByCompany: (companyId: string) => {
        const companyUsers = useUserStore.getState().getUsersByCompany(companyId);
        const companyUserIds = companyUsers.map(user => user.id_operador);
        return get().events.filter(event => companyUserIds.includes(event.id_operador));
      }
    }),
    {
      name: 'telemetry-storage',
    }
  )
);