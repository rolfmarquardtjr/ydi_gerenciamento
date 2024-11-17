import React, { useState } from 'react';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
}

const Tooltip: React.FC<TooltipProps> = ({ children, content }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute z-50 w-64 px-4 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg -top-2 left-full ml-2">
          <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 -left-1 top-3" />
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;