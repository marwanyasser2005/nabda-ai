import React, { useState, useEffect, useRef } from 'react';
import { ResponsiveContainer } from 'recharts';

interface ChartContainerProps {
  children: React.ReactElement;
  height?: number | string;
  className?: string;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({ children, height = 300, className = "" }) => {
  const [isReady, setIsReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Determine if the container has valid dimensions
    const checkDimensions = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        // If container has width, we are ready to render the chart
        if (clientWidth > 0) {
           setIsReady(true);
        }
      }
    };

    // Initial check
    checkDimensions();

    // Observe resizing just in case
    const observer = new ResizeObserver(() => {
       checkDimensions();
    });
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // Fallback timer to force render if observer is slow
    const timer = setTimeout(() => setIsReady(true), 500);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={className}
      style={{ 
        width: '100%', 
        height: height, 
        minHeight: typeof height === 'number' ? height : 100,
        position: 'relative' 
      }} 
    >
      {isReady ? (
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-slate-800/30 rounded-lg animate-pulse">
           <span className="text-slate-600 text-xs">Initializing Analytics...</span>
        </div>
      )}
    </div>
  );
};