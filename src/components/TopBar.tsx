import React from 'react';
import { Github } from 'lucide-react';
import { PROJECT_REPO_URL } from '@/utils/projectMeta';

export function TopBar() {
  const logoSrc = `${import.meta.env.BASE_URL}favicon.svg`;

  return (
    <header className="h-[60px] w-full bg-surface-panel/70 backdrop-blur-2xl flex items-center px-8 relative z-50 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.8)] border-b border-border-default/60">
      <div className="flex items-center gap-3">
        <img 
          src={logoSrc} 
          alt="Hue Forge logo" 
          className="h-9 w-9 object-contain rounded-[10px] shadow-[0_1px_2px_rgba(0,0,0,0.1)]" 
        />
        <div className="flex flex-col leading-none gap-0.5">
          <h1 className="text-text-main font-bold text-lg">Hue Forge</h1>
          <span className="text-[11px] font-medium text-text-muted">
            Color System Lab
          </span>
        </div>
      </div>
      <div className="ml-auto">
        <a
          href={PROJECT_REPO_URL}
          target="_blank"
          rel="noreferrer"
          aria-label="Open Hue Forge GitHub repository"
          className="flex items-center justify-center w-9 h-9 rounded-full border border-border-default/80 text-text-tertiary hover:text-text-main hover:bg-surface-sunken hover:border-border-focus/50 transition-all duration-300 active:scale-95"
        >
          <Github className="w-[1.2rem] h-[1.2rem] stroke-[2px]" />
        </a>
      </div>
    </header>
  );
}
