import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const HeroCard = React.forwardRef(({
  className,
  children,
  buttonText = "Get Started",
  onButtonClick,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "mx-auto flex flex-col items-center justify-center space-y-6 rounded-lg border bg-card p-6 shadow-sm sm:max-w-lg sm:p-8 md:max-w-2xl md:p-8 lg:p-12 xl:max-w-4xl",
        className
      )}
      {...props}
    >
      <div className="flex max-w-prose flex-col items-center space-y-4 text-center">
        {children}
      </div>
      <Button
        size="lg"
        onClick={onButtonClick}
        className="px-8 py-3 text-base font-semibold shadow-lg hover:shadow-xl sm:px-10 lg:px-12 transition-all duration-200"
      >
        {buttonText}
      </Button>
    </div>
  );
});

HeroCard.displayName = "HeroCard";

export { HeroCard };
