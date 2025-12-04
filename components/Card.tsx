import React from 'react';
import { CardDimensions, CardData } from '../types';

interface CardProps {
  data: CardData;
  dimensions: CardDimensions;
  active: boolean;
}

const Card: React.FC<CardProps> = ({ data, dimensions, active }) => {
  // Center image horizontally: (CardWidth - ImageWidth) / 2
  const sidePadding = (dimensions.width - dimensions.imageWidth) / 2;
  
  // The reference implies the image is somewhat top-aligned with padding
  const topPadding = sidePadding; 

  return (
    <div
      className="relative flex flex-col items-center bg-white overflow-hidden select-none transition-shadow duration-300"
      style={{
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        borderRadius: '12px', // Reduced by 50% from 24px
        boxShadow: active 
          ? '0 25px 50px -12px rgba(0,0,0,0.4)' // Deeper, more diffuse shadow for active
          : '0 10px 15px -3px rgba(0,0,0,0.1)',
      }}
    >
      {/* 
         1. IMAGE CONTAINER 
         Fixed height from specs: 139.6px
      */}
      <div 
        className="flex-shrink-0 relative z-10 bg-gray-100"
        style={{
          width: `${dimensions.imageWidth}px`,
          height: `${dimensions.imageHeight}px`,
          marginTop: `${topPadding}px`,
          borderRadius: '10px', // Reduced by 50% from 20px
          overflow: 'hidden',
        }}
      >
        <img 
          src={data.imageUrl} 
          alt="Card Visual"
          className="w-full h-full object-cover block"
          draggable={false}
        />
        {/* Subtle overlay for better text contrast if needed, or style consistency */}
        <div className="absolute inset-0 bg-black/5 mix-blend-overlay"></div>
      </div>

      {/* 
         2. TEXT CONTAINER
         Takes remaining space.
         Formerly held text, now kept empty to maintain white space structure.
      */}
      <div className="flex-1 w-full flex flex-col items-center justify-center relative z-10 px-1 pt-1">
        {/* Text removed as requested */}
      </div>

      {/* Glossy Reflection Gradient */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-transparent pointer-events-none z-20 opacity-50"></div>
    </div>
  );
};

export default Card;