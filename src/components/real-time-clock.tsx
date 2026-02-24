'use client';

import React, { useState, useEffect } from 'react';

const RealTimeClock = ({ className }: { className?: string }) => {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const getFormattedTime = () => {
        const options: Intl.DateTimeFormatOptions = {
            timeZone: 'Asia/Jakarta', // GMT+7
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        };
        const formatter = new Intl.DateTimeFormat('en-GB', options);
        const parts = formatter.formatToParts(new Date());

        const partsMap = parts.reduce((acc, part) => {
            if (part.type !== 'literal') {
                acc[part.type] = part.value;
            }
            return acc;
        }, {} as Record<string, string>);
        
        return `${partsMap.day}-${partsMap.month}-${partsMap.year} ${partsMap.hour}:${partsMap.minute}:${partsMap.second}`;
    }
    
    setTime(getFormattedTime()); // Set initial time
    const timerId = setInterval(() => setTime(getFormattedTime()), 1000);
    return () => clearInterval(timerId);
  }, []);

  const placeholder = '00-00-0000 00:00:00';
  const displayTime = time || placeholder;

  return (
    <div className={className}>
        <div className="bg-card/80 backdrop-blur-sm px-3 py-2 rounded-lg border shadow-sm">
            <p className={`font-mono text-sm font-semibold tracking-wider whitespace-nowrap ${!time ? 'text-transparent' : 'text-foreground/90'}`}>
                {displayTime}
            </p>
        </div>
    </div>
  );
};

export default RealTimeClock;
