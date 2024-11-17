import React, { useState } from 'react';
import { Settings, Bell, Shield, Palette, Mail } from 'lucide-react';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      telemetryAlerts: true,
      driverScoreAlerts: true,
      systemUpdates: false,
    },
    security: {
      twoFactorAuth: false,
      passwordExpiration: 90,
      sessionTimeout: 30,
    },
    appearance: {
      theme: 'light',
      language: 'pt-BR',
      timezone: 'America/Sao_Paulo',
    },
    email: {
      dailyReport: true,
      weeklyReport: true,
      monthlyReport: true,
    },
  });

  const handleSettingChange = (category: string, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value,
      },
    }));
  };

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Settings className="w-6 h-6 text-primary-600 mr-2" />
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
      </div>

      <div className="space-y-6">
        {/* Notifications */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <Bell className="w-5 h-5 text-primary-600 mr-2" />
            <h2 className="text-lg font-semibold">Notificações</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notificações por E-mail</p>
                <p className="text-sm text-gray-500">Receba atualizações importantes por e-mail</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.email}
                  onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Alertas de Telemetria</p>
                <p className="text-sm text-gray-500">Notificações sobre eventos críticos</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.telemetryAlerts}
                  onChange={(e) => handleSettingChange('notifications', 'telemetryAlerts', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <Shield className="w-5 h-5 text-primary-600 mr-2" />
            <h2 className="text-lg font-semibold">Segurança</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Autenticação em Duas Etapas</p>
                <p className="text-sm text-gray-500">Adicione uma camada extra de segurança</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.security.twoFactorAuth}
                  onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiração de Senha (dias)
              </label>
              <input
                type="number"
                value={settings.security.passwordExpiration}
                onChange={(e) => handleSettingChange('security', 'passwordExpiration', parseInt(e.target.value))}
                className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <Palette className="w-5 h-5 text-primary-600 mr-2" />
            <h2 className="text-lg font-semibold">Aparência</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tema
              </label>
              <select
                value={settings.appearance.theme}
                onChange={(e) => handleSettingChange('appearance', 'theme', e.target.value)}
                className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="light">Claro</option>
                <option value="dark">Escuro</option>
                <option value="system">Sistema</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Idioma
              </label>
              <select
                value={settings.appearance.language}
                onChange={(e) => handleSettingChange('appearance', 'language', e.target.value)}
                className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="pt-BR">Português (Brasil)</option>
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </div>
          </div>
        </div>

        {/* Email Reports */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <Mail className="w-5 h-5 text-primary-600 mr-2" />
            <h2 className="text-lg font-semibold">Relatórios por E-mail</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Relatório Diário</p>
                <p className="text-sm text-gray-500">Resumo diário das atividades</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.email.dailyReport}
                  onChange={(e) => handleSettingChange('email', 'dailyReport', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Relatório Semanal</p>
                <p className="text-sm text-gray-500">Análise semanal de performance</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.email.weeklyReport}
                  onChange={(e) => handleSettingChange('email', 'weeklyReport', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            Salvar Configurações
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;