import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate, PanInfo, MotionValue } from 'framer-motion';
import { CardDimensions, CardData, Dimensions } from '../types';
import Card from './Card';

// --- HAPTICS HOOK ---
const useHaptics = () => {
  const trigger = (pattern: number | number[]) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {
        // Haptics not supported or blocked
      }
    }
  };

  return {
    light: () => trigger(10),       // Tick
    medium: () => trigger(40),      // Selection
    heavy: () => trigger([30, 50, 30]), // Error or limit
    success: () => trigger([10, 30, 40]),
  };
};

interface CardCarouselProps {
  cards: CardData[];
  cardDim: CardDimensions;
  viewportDim: Dimensions;
}

const CardCarousel: React.FC<CardCarouselProps> = ({ cards, cardDim, viewportDim }) => {
  const [currentVirtualIndex, setCurrentVirtualIndex] = useState(0);
  const haptics = useHaptics();
  
  // dragX represents the GLOBAL scroll position of the track.
  // -SPACING * i = Index i is centered.
  const dragX = useMotionValue(0);

  // --- PHYSICS CONSTANTS ---
  const INACTIVE_SCALE = 0.85;
  
  // Center-to-Center spacing between cards
  const SPACING = (cardDim.width / 2) + cardDim.gap + ((cardDim.width * INACTIVE_SCALE) / 2);

  // Calculate vertical offset to align card bottom with viewport bottom
  const verticalOffset = (viewportDim.height - cardDim.height) / 2;

  // --- BACKGROUND WIPE LOGIC ---
  // When carousel moves by 1 SPACING, Background should move by 1 VIEWPORT_WIDTH.
  // Negate to ensure inverse direction: Drag Right (Pos) -> BG Left (Neg)
  const bgMoveRatio = -viewportDim.width / SPACING;
  const backgroundX = useTransform(dragX, (value) => value * bgMoveRatio);

  // Helper to map infinite virtual index to 0..cards.length-1
  const getWrappedIndex = (virtualIndex: number) => {
    return ((virtualIndex % cards.length) + cards.length) % cards.length;
  };

  // Monitor dragX to update current virtual index state (for rendering window)
  useEffect(() => {
    const unsubscribe = dragX.on("change", (latest) => {
      const rawIndex = -latest / SPACING;
      const rounded = Math.round(rawIndex);
      
      // Update state if we've moved to a new integer slot
      // This triggers re-render of the window of visible cards
      if (rounded !== currentVirtualIndex) {
        setCurrentVirtualIndex(rounded);
        haptics.medium();
      }
    });
    return () => unsubscribe();
  }, [dragX, currentVirtualIndex, haptics, SPACING]);

  const handleCardTap = (virtualIndex: number) => {
    if (virtualIndex === currentVirtualIndex) return;
    
    haptics.medium();
    
    // Animate to the specific virtual position
    animate(dragX, -virtualIndex * SPACING, {
      type: "spring",
      stiffness: 220,
      damping: 28,
      mass: 0.7,
      restDelta: 0.001
    });
  };

  const onDragStart = () => {
    haptics.light();
  };

  const onDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset, velocity } = info;
    const currentPos = dragX.get();
    
    const predictedPos = currentPos + (velocity.x * 0.2);
    const rawIndex = -predictedPos / SPACING;
    let targetIndex = Math.round(rawIndex);
    
    const swipeThreshold = 30;
    const currentIndex = Math.round(-currentPos / SPACING);
    
    // Directional swipe logic
    if (offset.x < -swipeThreshold && targetIndex === currentIndex) {
        targetIndex = currentIndex + 1;
    }
    else if (offset.x > swipeThreshold && targetIndex === currentIndex) {
        targetIndex = currentIndex - 1;
    }

    // No clamping constraints for infinite loop
    
    animate(dragX, -targetIndex * SPACING, { 
      type: "spring", 
      stiffness: 220, 
      damping: 28,
      mass: 0.7,
      restDelta: 0.001
    });
  };

  // --- WINDOW RENDERING LOGIC ---
  // Render current index +/- buffer to ensure visible area is populated
  const buffer = 2; 
  const visibleIndices: number[] = [];
  for (let i = currentVirtualIndex - buffer; i <= currentVirtualIndex + buffer; i++) {
    visibleIndices.push(i);
  }

  return (
    <div 
      className="relative w-full h-full flex items-center justify-center overflow-hidden"
      style={{ perspective: '1000px' }}
    >
      {/* INFINITE DYNAMIC WIPE BACKGROUND */}
      <motion.div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ 
          x: backgroundX,
          // The container doesn't really need a width, we just position children absolutely relative to it
        }}
      >
        {visibleIndices.map(virtualIndex => {
            const wrappedIndex = getWrappedIndex(virtualIndex);
            const cardData = cards[wrappedIndex];
            return (
                <div 
                    key={`bg-${virtualIndex}`}
                    className="absolute top-0 h-full"
                    style={{ 
                        width: viewportDim.width, 
                        background: cardData.bgGradient,
                        // Corrected Formula:
                        // Container moves by +VirtualIndex * ViewportWidth (inverted ratio)
                        // So Panel must be at -VirtualIndex * ViewportWidth to be seen at 0
                        left: -virtualIndex * viewportDim.width
                    }}
                />
            );
        })}
      </motion.div>

      {/* TRACK CONTAINER */}
      <motion.div
        className="relative flex items-center justify-center z-10"
        style={{ x: dragX, y: verticalOffset, width: 0, height: 0 }}
        drag="x"
        // No dragConstraints for infinite scroll
        dragElastic={0.15}
        dragMomentum={false}
        dragTransition={{ bounceStiffness: 200, bounceDamping: 25 }}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        {visibleIndices.map((virtualIndex) => {
          const wrappedIndex = getWrappedIndex(virtualIndex);
          const cardData = cards[wrappedIndex];
          
          return (
            <CardItem 
              key={`card-${virtualIndex}`} // Unique key using virtualIndex for "loop count" awareness
              virtualIndex={virtualIndex}
              currentVirtualIndex={currentVirtualIndex}
              dragX={dragX}
              card={cardData}
              cardDim={cardDim}
              spacing={SPACING}
              onTap={() => handleCardTap(virtualIndex)}
              inactiveScale={INACTIVE_SCALE}
            />
          );
        })}
      </motion.div>
    </div>
  );
};

interface CardItemProps {
  virtualIndex: number;
  currentVirtualIndex: number;
  dragX: MotionValue<number>;
  card: CardData;
  cardDim: CardDimensions;
  spacing: number;
  onTap: () => void;
  inactiveScale: number;
}

const CardItem: React.FC<CardItemProps> = ({ 
  virtualIndex, 
  currentVirtualIndex,
  dragX, 
  card, 
  cardDim, 
  spacing,
  onTap,
  inactiveScale
}) => {
  // Determine absolute position based on virtual index
  const absoluteX = virtualIndex * spacing;
  
  // Transform logic now needs to handle the infinite strip
  // We use `dragX` (global) + `absoluteX` (local) to determine where this card is relative to viewport center
  const x = useTransform(dragX, (value) => value + absoluteX);
  
  const scale = useTransform(x, 
    [-spacing * 2, -spacing, 0, spacing, spacing * 2], 
    [inactiveScale * 0.9, inactiveScale, 1, inactiveScale, inactiveScale * 0.9]
  );
  
  const opacity = useTransform(x, 
    [-spacing * 2, -spacing, 0, spacing, spacing * 2], 
    [0, 0.7, 1, 0.7, 0]
  );

  const zIndexRaw = useTransform(x, 
    [-spacing * 1.5, 0, spacing * 1.5], 
    [0, 100, 0]
  );
  const zIndex = useTransform(zIndexRaw, (v) => Math.round(v));

  const isActive = virtualIndex === currentVirtualIndex;

  return (
    <motion.div
      style={{
        position: 'absolute',
        width: cardDim.width,
        height: cardDim.height,
        left: absoluteX, 
        scale,
        opacity,
        zIndex,
        marginLeft: -cardDim.width / 2,
        marginTop: -cardDim.height / 2,
        top: 0,
        cursor: 'grab'
      }}
      onTap={onTap}
      whileTap={{ cursor: 'grabbing' }}
    >
      <Card data={card} dimensions={cardDim} active={isActive} />
    </motion.div>
  );
};

export default CardCarousel;