import { useState, useEffect } from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useQuery } from '@tanstack/react-query';
import { LoadingSpinner } from './LoadingSpinner';

const AD_REFRESH_INTERVAL = 5 * 60 * 1000;
const VYAPAR_AD = {
  display_url: "https://i.ibb.co/9gDWPXT/image.png",
  title: "Vyapar App - Business Accounting Software",
  redirect_url: "https://vyaparapp.in/?referrer_code=NVZ52VY"
};

interface ImgBBResponse {
  data: {
    display_url: string;
    title: string;
  }[];
}

const IMGBB_API_KEY = '73ffc7abc53c74281c83c278d6a9a82b';

const fetchAds = async (): Promise<ImgBBResponse> => {
  const response = await fetch(`https://api.imgbb.com/1/account/images?key=${IMGBB_API_KEY}`);
  if (!response.ok) throw new Error('Failed to fetch ads');
  return response.json();
};

export function DynamicAdDisplay() {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [showVyaparAd, setShowVyaparAd] = useState(true);

  const { data: ads, isLoading, error } = useQuery({
    queryKey: ['ads'],
    queryFn: fetchAds,
    refetchInterval: AD_REFRESH_INTERVAL,
    staleTime: AD_REFRESH_INTERVAL,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (ads?.data?.length) {
        setShowVyaparAd(prev => !prev);
        if (!showVyaparAd) {
          setCurrentAdIndex((prev) => (prev + 1) % ads.data.length);
        }
      }
    }, AD_REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [ads?.data?.length, showVyaparAd]);

  if (isLoading) return <LoadingSpinner />;
  if (error && !showVyaparAd) return null;

  const handleAdClick = () => {
    if (showVyaparAd) {
      window.open(VYAPAR_AD.redirect_url, '_blank');
    }
  };

  const currentAd = showVyaparAd ? VYAPAR_AD : (ads?.data?.[currentAdIndex]);
  if (!currentAd) return null;

  return (
    <div className="w-full py-2 sm:py-4 bg-black/10 backdrop-blur-sm fixed bottom-0 left-0 z-50">
      <div className="container max-w-6xl mx-auto px-4">
        <HoverCard>
          <HoverCardTrigger asChild>
            <div 
              className="cursor-pointer transition-all hover:scale-105"
              onClick={handleAdClick}
            >
              <img
                src={currentAd.display_url}
                alt="Advertisement"
                className="w-full max-w-md h-16 sm:h-24 object-cover rounded-lg shadow-lg mx-auto royal-shadow"
                loading="lazy"
              />
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="w-64 sm:w-80 bg-black/90 border-gray-800">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-amber-400">{currentAd.title}</h4>
              <img
                src={currentAd.display_url}
                alt="Advertisement"
                className="w-full h-auto rounded-lg"
                loading="lazy"
              />
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  );
}