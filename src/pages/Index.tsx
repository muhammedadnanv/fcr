import { ImageGenerator } from "@/components/ImageGenerator";
import { SocialLinks } from "@/components/SocialLinks";
import { AuthButtons } from "@/components/AuthButtons";
import { ChatBot } from "@/components/chat/ChatBot";
import { FAQ } from "@/components/FAQ";
import { Documentation } from "@/components/Documentation";
import { PlatformBudget } from "@/components/PlatformBudget";
import { Sparkles, Briefcase, Shield, Star, Heart, Zap, Award, Info, Send } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

const Index = () => {
  const { toast } = useToast();
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch("https://formbold.com/s/9XDVY", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: feedback }),
      });

      if (response.ok) {
        toast({
          title: "Thank you!",
          description: "Your feedback has been submitted successfully.",
        });
        setFeedback("");
      } else {
        throw new Error("Failed to submit feedback");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#1a1a1a] animate-gradient-x">
      <Alert className="rounded-none border-none bg-amber-500/10 backdrop-blur-sm">
        <Info className="h-4 w-4 text-amber-400" />
        <AlertDescription className="text-amber-200 text-xs sm:text-sm">
          This platform's prompt generation is heavily influenced by our unique prompting style
        </AlertDescription>
      </Alert>
      
      <div className="min-h-screen bg-black/5 backdrop-blur-sm">
        <AuthButtons />
        <div className="container max-w-6xl py-4 sm:py-6 md:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
          <div className="space-y-4 sm:space-y-6 md:space-y-8 text-center mb-6 sm:mb-8 md:mb-12 animate-fade-in">
            <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6">
              <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-amber-400 animate-pulse" />
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tighter bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent animate-gradient-x">
                ComicForge AI
              </h1>
              <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-amber-400 animate-pulse" />
            </div>
            
            <div className="flex flex-col items-center justify-center gap-4 sm:gap-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-6 my-4 sm:my-6">
                <div className="flex flex-col items-center gap-2 p-3 sm:p-4 rounded-lg bg-black/20 backdrop-blur-sm hover:bg-black/30 transition-all">
                  <Shield className="w-4 h-4 sm:w-6 sm:h-6 text-amber-400" />
                  <span className="text-xs sm:text-sm text-gray-400">Secure Platform</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-3 sm:p-4 rounded-lg bg-black/20 backdrop-blur-sm hover:bg-black/30 transition-all">
                  <Star className="w-4 h-4 sm:w-6 sm:h-6 text-amber-400" />
                  <span className="text-xs sm:text-sm text-gray-400">Premium Quality</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-3 sm:p-4 rounded-lg bg-black/20 backdrop-blur-sm hover:bg-black/30 transition-all">
                  <Briefcase className="w-4 h-4 sm:w-6 sm:h-6 text-amber-400" />
                  <span className="text-xs sm:text-sm text-gray-400">Professional Tools</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-3 sm:p-4 rounded-lg bg-black/20 backdrop-blur-sm hover:bg-black/30 transition-all">
                  <Zap className="w-4 h-4 sm:w-6 sm:h-6 text-amber-400" />
                  <span className="text-xs sm:text-sm text-gray-400">Fast Generation</span>
                </div>
              </div>

              {/* New Social Links Section */}
              <div className="flex items-center justify-center gap-4 mb-4 sm:mb-6">
                <SocialLinks />
              </div>

              <div className="flex items-center justify-center gap-2 transition-all hover:scale-105 mb-4 sm:mb-6 bg-black/20 backdrop-blur-sm px-3 sm:px-4 py-2 sm:py-3 rounded-full">
                <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 animate-pulse" />
                <span className="text-xs sm:text-sm text-gray-400">Standing with Palestine</span>
              </div>

              <div className="space-y-8 sm:space-y-12 md:space-y-16 lg:space-y-20">
                <div className="transition-all duration-500 hover:scale-[1.01] shadow-xl">
                  <ImageGenerator />
                </div>

                <div className="transition-all duration-500 hover:scale-[1.01] shadow-xl">
                  <FAQ />
                </div>

                <div className="transition-all duration-500 hover:scale-[1.01] shadow-xl">
                  <Documentation />
                </div>

                <div className="transition-all duration-500 hover:scale-[1.01] shadow-xl">
                  <PlatformBudget />
                </div>

                {/* Feedback Form Section */}
                <Card className="p-4 sm:p-6 md:p-8 backdrop-blur-sm bg-black/10 border-gray-800 shadow-xl transition-all duration-500 hover:scale-[1.01] mx-auto max-w-[95%] sm:max-w-[90%] md:max-w-[85%] lg:max-w-[80%]">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-400 mb-4 flex items-center gap-2 justify-center sm:justify-start">
                    <Heart className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                    Share Your Feedback
                  </h2>
                  <p className="text-gray-400 text-sm sm:text-base md:text-lg mb-6 text-center sm:text-left">
                    Help us improve ComicForge AI by sharing your thoughts and suggestions
                  </p>
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    <Textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Type your feedback here..."
                      className="min-h-[150px] sm:min-h-[200px] bg-black/20 border-gray-800 focus:border-amber-500 focus:ring-amber-500/20 placeholder:text-gray-500 text-white resize-none w-full rounded-lg text-sm sm:text-base p-3 sm:p-4"
                      required
                      aria-label="Feedback message"
                    />
                    <div className="flex justify-center sm:justify-start">
                      <Button 
                        type="submit"
                        className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <Send className="w-4 h-4" />
                        Submit Feedback
                      </Button>
                    </div>
                  </form>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
