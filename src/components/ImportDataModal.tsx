import React, { useRef, useState } from 'react';
import { X, Upload, AlertCircle, CheckCircle2, FileSpreadsheet } from 'lucide-react';
import { useTelemetryStore } from '../store/telemetryStore';
import { useUserStore } from '../store/userStore';

interface ImportDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'telemetry' | 'users';
}

const ImportDataModal: React.FC<ImportDataModalProps> = ({ isOpen, onClose, type }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState<any[]>([]);
  
  const importTelemetry = useTelemetryStore((state) => state.importTelemetry);
  const importUsers = useUserStore((state) => state.importUsers);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    await processFile(file);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const processFile = async (file: File) => {
    setError(null);
    setSuccess(false);
    setPreview([]);

    if (!file.name.endsWith('.xlsx')) {
      setError('Por favor, selecione um arquivo XLSX válido.');
      return;
    }

    try {
      if (type === 'users') {
        await importUsers(file);
      } else {
        await importTelemetry(file);
      }
      
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar o arquivo. Verifique o formato e tente novamente.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <FileSpreadsheet className="w-6 h-6 text-primary-600 mr-2" />
            <h2 className="text-xl font-semibold">
              {type === 'users' ? 'Importar Usuários' : 'Importar Telemetria'}
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">
            Arraste e solte seu arquivo XLSX aqui ou
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            selecione um arquivo
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".xlsx"
            className="hidden"
          />
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            <div className="whitespace-pre-wrap">{error}</div>
          </div>
        )}

        {success && (
          <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg flex items-center">
            <CheckCircle2 className="w-5 h-5 mr-2" />
            Arquivo importado com sucesso!
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportDataModal;