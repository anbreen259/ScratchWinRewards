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
        
        // Create custom scratch card background
        // Fill with a royal blue base color
        ctx.fillStyle = '#1a365d';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw a custom gold pattern
        ctx.fillStyle = '#ffc107';
        
        // Draw some gold stars/sparkles
        for (let i = 0; i < 50; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          const size = Math.random() * 8 + 2;
          
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Add some decorative lines
        ctx.strokeStyle = '#ffc107';
        ctx.lineWidth = 2;
        for (let i = 0; i < 8; i++) {
          ctx.beginPath();
          ctx.moveTo(Math.random() * canvas.width, 0);
          ctx.lineTo(Math.random() * canvas.width, canvas.height);
          ctx.stroke();
          
          ctx.beginPath();
          ctx.moveTo(0, Math.random() * canvas.height);
          ctx.lineTo(canvas.width, Math.random() * canvas.height);
          ctx.stroke();
        }
        
        // Add text
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('SCRATCH HERE', canvas.width / 2, canvas.height / 2);
        
        setScratchPercentage(0);
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
