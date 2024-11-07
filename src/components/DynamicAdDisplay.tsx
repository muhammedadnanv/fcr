import { useState, useEffect } from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { X } from 'lucide-react';
import { Button } from './ui/button';

const AD_REFRESH_INTERVAL = 5000;

const STATIC_ADS = [
  {
    display_url: "https://i.ibb.co/BTB2sfN/image-removebg-preview.png",
    title: "Vyapar App",
    redirect_url: "https://vyaparapp.in/?referrer_code=NVZ52VY"
  },
  {
    display_url: "https://i.ibb.co/BTB2sfN/image-removebg-preview.png",
    title: "Vyapar Business",
    redirect_url: "https://vyaparapp.in/?referrer_code=NVZ52VY"
  },
  {
    display_url: "https://i.ibb.co/8MydcJj/image-removebg-preview-1.png",
    title: "Great Learning",
    redirect_url: "https://www.mygreatlearning.com/academy?referrer_code=GLL44ZJATMMKQ"
  },
  {
    display_url: "https://i.ibb.co/TmpvKQ7/image-removebg-preview-2.png",
    title: "Digital Growth",
    redirect_url: "https://digitalgrowthcommunity.in/home-9400?am_id=muhammad5507"
  }
];

export function DynamicAdDisplay() {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % STATIC_ADS.length);
    }, AD_REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  const handleAdClick = () => {
    const currentAd = STATIC_ADS[currentAdIndex];
    if (currentAd?.redirect_url) {
      window.open(currentAd.redirect_url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
  };

  const currentAd = STATIC_ADS[currentAdIndex];
  if (!currentAd) return null;

  return (
    <div className="w-full py-1 sm:py-2 bg-black/10 backdrop-blur-sm fixed bottom-0 left-0 z-50">
      <div className="container max-w-xl mx-auto px-2 relative">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute -top-1 -right-1 bg-black/80 hover:bg-black text-white rounded-full z-10 transition-colors w-4 h-4 sm:w-6 sm:h-6"
            onClick={handleRemove}
          >
            <X className="h-2 w-2 sm:h-3 sm:w-3" />
          </Button>
          <HoverCard>
            <HoverCardTrigger asChild>
              <div 
                className="cursor-pointer transition-all hover:scale-105 relative"
                onClick={handleAdClick}
              >
                <img
                  src={currentAd.display_url}
                  alt={currentAd.title}
                  className="w-full max-w-[120px] h-8 sm:h-10 object-contain rounded-lg shadow-lg mx-auto royal-shadow"
                  loading="lazy"
                />
              </div>
            </HoverCardTrigger>
            <HoverCardContent 
              className="w-36 sm:w-48 bg-black/90 border-gray-800"
              side="top"
            >
              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-amber-400">{currentAd.title}</h4>
                <img
                  src={currentAd.display_url}
                  alt={currentAd.title}
                  className="w-full h-auto rounded-lg"
                  loading="lazy"
                />
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>
    </div>
  );
}