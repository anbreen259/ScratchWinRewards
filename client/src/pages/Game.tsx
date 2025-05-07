import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Trophy } from "lucide-react";
import ScratchCard from "../components/ScratchCard";
import PrizeGallery from "../components/PrizeGallery";
import WinModal from "../components/WinModal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Game = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showWinModal, setShowWinModal] = useState(false);
  const [currentPrize, setCurrentPrize] = useState<any>(null);
  const [isScratched, setIsScratched] = useState(false);
  
  // Fetch game settings
  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ["/api/settings"],
  });
  
  // Fetch available prizes
  const { data: prizes, isLoading: prizesLoading } = useQuery({
    queryKey: ["/api/prizes"],
  });
  
  const handleScratchComplete = async () => {
    setIsScratched(true);
    
    try {
      const response = await fetch("/api/play", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to play the game");
      }
      
      const result = await response.json();
      
      if (result.win) {
        setCurrentPrize(result.prize);
        setShowWinModal(true);
        createConfetti();
      } else {
        toast({
          title: "Better luck next time!",
          description: "Try again for another chance to win.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handlePlayAgain = () => {
    setShowWinModal(false);
    setIsScratched(false);
    setCurrentPrize(null);
  };
  
  // Create confetti animation
  const createConfetti = () => {
    const confettiColors = ['#ffc107', '#1a365d', '#ffffff', '#f59e0b', '#3b82f6'];
    
    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement('div');
      confetti.classList.add('confetti');
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      confetti.style.width = Math.random() * 10 + 5 + 'px';
      confetti.style.height = Math.random() * 10 + 5 + 'px';
      confetti.style.animationDuration = Math.random() * 3 + 2 + 's';
      document.body.appendChild(confetti);
      
      // Remove confetti after animation completes
      setTimeout(() => {
        confetti.remove();
      }, 5000);
    }
  };
  
  if (settingsLoading || prizesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-royal-blue-800 to-royal-blue-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-montserrat mb-4">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-royal-blue-800 to-royal-blue-900 text-white">
      {/* Header */}
      <header className="py-4 px-6 bg-royal-blue-700 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Trophy className="text-premium-gold-500 h-6 w-6 mr-2" />
            <h1 className="text-xl font-montserrat font-bold">
              {settings?.title || "Scratch & Win"}
            </h1>
          </div>
          <Button 
            variant="outline" 
            className="bg-royal-blue-600 hover:bg-royal-blue-500 text-white border-royal-blue-500 py-2 px-4 rounded text-sm"
            onClick={() => setLocation("/login")}
          >
            Admin Login
          </Button>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Intro Text */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-montserrat font-bold mb-2">Try Your Luck!</h2>
            <p className="text-royal-blue-100">
              {settings?.instructionText || "Scratch the card below to reveal your prize"}
            </p>
          </div>

          {/* Scratch Card Component */}
          <div className="mb-10">
            <ScratchCard 
              onScratchComplete={handleScratchComplete} 
              isScratched={isScratched}
              prize={currentPrize}
            />
            <div className="text-center mt-4 text-royal-blue-100">
              <p className="text-sm">
                <span className="inline-block mr-1">👆</span>
                Use your finger or mouse to scratch the card
              </p>
            </div>
          </div>

          {/* Prize Gallery */}
          {settings?.showPrizeGallery && prizes && (
            <PrizeGallery prizes={prizes} />
          )}

          {/* Call to Action */}
          <div className="text-center">
            <Button 
              className="bg-premium-gold-500 hover:bg-premium-gold-400 text-royal-blue-800 font-montserrat font-bold py-3 px-8 rounded-full shadow-lg transform transition hover:scale-105"
              onClick={handlePlayAgain}
              disabled={!isScratched}
            >
              Play Again
            </Button>
          </div>
        </div>
      </main>

      {/* Win Modal */}
      {showWinModal && currentPrize && (
        <WinModal 
          isOpen={showWinModal} 
          onClose={handlePlayAgain}
          prize={currentPrize}
        />
      )}
    </div>
  );
};

export default Game;
