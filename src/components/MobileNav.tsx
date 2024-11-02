import { useState } from "react";
import { Menu, X } from "lucide-react";
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/clerk-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn } = useAuth();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px] bg-background/95 backdrop-blur-sm">
        <div className="flex flex-col space-y-4 mt-4">
          {isSignedIn ? (
            <div className="flex justify-center">
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    rootBox: "shadow-xl",
                    card: "bg-black/20 backdrop-blur-sm border-gray-800",
                    userPreviewMainIdentifier: "text-amber-400",
                    userPreviewSecondaryIdentifier: "text-gray-400",
                  }
                }}
              />
            </div>
          ) : (
            <>
              <SignInButton mode="modal">
                <Button variant="ghost" className="w-full justify-start">
                  Sign in
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700">
                  Sign up
                </Button>
              </SignUpButton>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}