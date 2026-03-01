import React from 'react';

export function TopBar() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#365314_0%,#65A30D_52%,#A3E635_100%)] shadow-[0_10px_30px_rgba(101,163,13,0.22)]">
          <svg
            viewBox="0 0 40 40"
            className="h-6 w-6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M10 28V12h4v6h12v-6h4v16h-4v-6H14v6h-4Z" fill="white" fillOpacity="0.96" />
          </svg>
        </div>
        <div className="flex flex-col leading-none">
          <h1 className="text-gray-900 font-semibold text-lg tracking-tight">Hue Forge</h1>
          <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-lime-600/70">
            Color System Lab
          </span>
        </div>
      </div>
    </header>
  );
}
