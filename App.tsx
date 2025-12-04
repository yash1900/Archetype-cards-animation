import React from 'react';
import CardCarousel from './components/CardCarousel';
import { VIEWPORT_DIMENSIONS, CARD_DIMENSIONS, CARDS_DATA } from './constants';

const App: React.FC = () => {
  // Scaling factor to present the specific mobile dimensions comfortably on desktop
  const SCALE = 2.8;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#02040a] p-8 font-sans overflow-hidden">
      
      <div className="flex flex-col items-center">
        
        {/* Device Frame */}
        <div 
          className="relative bg-black rounded-[35px] shadow-2xl border-[6px] border-[#1e293b] overflow-hidden"
          style={{
            width: `${VIEWPORT_DIMENSIONS.width * SCALE}px`,
            height: `${VIEWPORT_DIMENSIONS.height * SCALE}px`,
            boxShadow: '0 0 60px -15px rgba(29, 78, 216, 0.3)' // Deep blue ambient glow
          }}
        >
          {/* Internal Scaler */}
          <div 
            className="origin-top-left w-full h-full"
            style={{
              transform: `scale(${SCALE})`,
              width: `${VIEWPORT_DIMENSIONS.width}px`,
              height: `${VIEWPORT_DIMENSIONS.height}px`,
            }}
          >
            {/* App UI Background - Transparent to allow carousel BG to show */}
            <div className="w-full h-full relative overflow-hidden bg-transparent">
              
              {/* Carousel Container */}
              <div className="absolute inset-0 z-10">
                 <CardCarousel 
                    cards={CARDS_DATA}
                    cardDim={CARD_DIMENSIONS}
                    viewportDim={VIEWPORT_DIMENSIONS}
                 />
              </div>

            </div>
          </div>
          
          {/* Screen Glare Reflection */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/5 via-transparent to-transparent rounded-[28px] z-50"></div>
        </div>

      </div>
    </div>
  );
};

export default App;