import { Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface WinModalProps {
  isOpen: boolean;
  onClose: () => void;
  prize: {
    name: string;
    description: string;
    value: string;
    icon: string;
  };
}

const WinModal = ({ isOpen, onClose, prize }: WinModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative text-center">
        <div className="mb-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-premium-gold-100 text-premium-gold-500 mb-4">
            <Trophy className="h-8 w-8" />
          </div>
          <h3 className="text-2xl font-montserrat font-bold text-gray-900">Congratulations!</h3>
          <p className="text-gray-600 mt-2">
            You've won a <span className="font-semibold text-premium-gold-500">{prize.name} {prize.description}</span>
          </p>
        </div>
        
        {/* Celebration graphic with confetti and fireworks */}
        <div className="celebration-graphic rounded-lg h-40 mb-4 flex items-center justify-center relative overflow-hidden">
          <div className="confetti-container">
            {Array.from({ length: 50 }).map((_, i) => (
              <div 
                key={i}
                className="confetti-piece"
                style={{
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 10 + 5}px`,
                  height: `${Math.random() * 10 + 5}px`,
                  background: ['#ffc107', '#1a365d', '#f59e0b', '#3b82f6', '#10b981'][Math.floor(Math.random() * 5)],
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${Math.random() * 3 + 2}s`
                }}
              />
            ))}
          </div>
          <div className="text-4xl font-bold text-white z-10">Congratulations!</div>
        </div>
        
        <p className="text-gray-600 mb-6">Your prize has been added to your account and is ready to use!</p>
        
        <div className="space-y-3">
          <Button 
            className="w-full bg-premium-gold-500 hover:bg-premium-gold-400 text-royal-blue-800 py-3 px-4 rounded-lg font-bold"
          >
            Claim Prize
          </Button>
          <Button 
            variant="outline"
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-lg font-medium"
            onClick={onClose}
          >
            Play Again
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WinModal;
