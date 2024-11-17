import React from 'react';
import { motion } from 'framer-motion';

interface NAVTProgressBarProps {
  current: number;
  total: number;
}

const NAVTProgressBar: React.FC<NAVTProgressBarProps> = ({ current, total }) => {
  const progress = (current / total) * 100;

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">
          Questão {current} de {total}
        </span>
        <span className="text-sm font-medium text-primary-600">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
};

export default NAVTProgressBar;