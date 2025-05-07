import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createScratchCard } from "../lib/scratch-utils";

interface ScratchCardProps {
  onScratchComplete: () => void;
  isScratched: boolean;
  prize: any | null;
}

const ScratchCard = ({ onScratchComplete, isScratched, prize }: ScratchCardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scratchCardRef = useRef<HTMLDivElement>(null);
  const [scratchPercentage, setScratchPercentage] = useState(0);
  const scratchThreshold = 50; // Percentage of scratched area to trigger complete
  
  // Fetch game settings for customization
  const { data: settings } = useQuery({
    queryKey: ["/api/settings"],
  });

  useEffect(() => {
    // Reset scratch state when isScratched changes to false
    if (!isScratched && canvasRef.current && scratchCardRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        const scratchCard = scratchCardRef.current;
        const { width, height } = scratchCard.getBoundingClientRect();
        
        // Reset canvas dimensions
        canvas.width = width;
        canvas.height = height;
        
        // Load and draw background image
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          setScratchPercentage(0);
        };
        img.src = 'https://images.unsplash.com/photo-1601987077677-5346c0c57d3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=320&h=200';
      }
    }
  }, [isScratched]);

  useEffect(() => {
    if (canvasRef.current && scratchCardRef.current) {
      const { destroy, getPercentScratched } = createScratchCard(
        canvasRef.current,
        scratchCardRef.current,
        () => {
          const percent = getPercentScratched();
          setScratchPercentage(percent);
          
          if (percent >= scratchThreshold && !isScratched) {
            onScratchComplete();
          }
        }
      );
      
      return () => {
        destroy();
      };
    }
  }, [onScratchComplete, isScratched, scratchThreshold]);

  return (
    <div className="scratch-card glow-effect" ref={scratchCardRef}>
      <div className="scratch-card-prize">
        {prize ? (
          <>
            <div className="text-4xl mb-2">{prize.name}</div>
            <div className="text-xl">{prize.description}</div>
          </>
        ) : (
          <>
            <div className="text-4xl mb-2">?</div>
            <div className="text-xl">SCRATCH TO REVEAL</div>
          </>
        )}
      </div>
      <canvas 
        ref={canvasRef} 
        className={`scratch-card-cover ${isScratched ? 'hidden' : ''}`}
        style={{
          display: isScratched ? 'none' : 'block',
          opacity: 1 - (scratchPercentage / 100)
        }}
      />
    </div>
  );
};

export default ScratchCard;
