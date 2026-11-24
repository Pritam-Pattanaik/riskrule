import React from 'react';
import { cn } from '../../lib/cn';

import { useLocation } from 'react-router-dom';

interface PageWrapperProps {
  children: React.ReactNode;
}


export default function PageWrapper({ children }: PageWrapperProps) {
  const location = useLocation();

  const scroll = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => { scroll.current?.scrollTo({ top: 0, behavior: 'instant' }); }, [location.pathname]);
  return (
    <div ref={scroll} className="workspace-content min-h-0 flex-1 overflow-y-auto w-full bg-canvas">
      <div key={location.pathname} className={cn("route-fade mx-auto w-full max-w-[1500px] min-w-0", location.pathname === '/app/ai-coach' ? "h-full" : "p-4 sm:p-6 xl:px-8 pb-16")}>
        {children}
      </div>
    </div>
  );
}
