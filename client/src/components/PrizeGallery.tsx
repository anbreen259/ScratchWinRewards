import { Gift, Star, Percent, Clock, Box, Gamepad } from "lucide-react";

const iconMap: Record<string, any> = {
  "gift": Gift,
  "star": Star,
  "percent": Percent,
  "clock": Clock,
  "box": Box,
  "gamepad": Gamepad
};

interface PrizeGalleryProps {
  prizes: any[];
}

const PrizeGallery = ({ prizes }: PrizeGalleryProps) => {
  // Only show active prizes
  const activePrizes = prizes.filter(prize => prize.isActive);
  
  return (
    <div className="bg-royal-blue-700 rounded-lg p-6 shadow-lg mb-8">
      <h3 className="text-xl font-montserrat font-bold mb-4 text-center">Available Prizes</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {activePrizes.map((prize, index) => {
          const IconComponent = iconMap[prize.icon] || Gift;
          
          return (
            <div 
              key={prize.id || index} 
              className={`bg-royal-blue-600 rounded-lg p-3 text-center ${index === 0 ? 'shimmer' : ''}`}
            >
              <div className="bg-premium-gold-500 text-royal-blue-800 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <IconComponent size={20} />
              </div>
              <div className="font-montserrat font-semibold">{prize.name}</div>
              <div className="text-xs text-royal-blue-100">{prize.description}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PrizeGallery;
