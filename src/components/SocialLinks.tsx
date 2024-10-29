import { Instagram, Linkedin, Phone } from "lucide-react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

export function SocialLinks() {
  const socialLinks = [
    {
      icon: Instagram,
      href: "https://www.instagram.com/ai.adnanvv/",
      label: "Instagram",
    },
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/in/muhammedadnanvv/",
      label: "LinkedIn",
    },
    {
      icon: Phone,
      href: "https://wa.me/919656778508",
      label: "WhatsApp",
    },
  ];

  return (
    <footer className="w-full py-6 mt-8 border-t">
      <div className="container flex justify-center items-center gap-4">
        <TooltipProvider>
          {socialLinks.map((link) => (
            <Tooltip key={link.label}>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  asChild
                >
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                  >
                    <link.icon className="h-4 w-4" />
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{link.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
    </footer>
  );
}