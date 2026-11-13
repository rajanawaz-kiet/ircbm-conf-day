import React from 'react';

interface KIETLogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

/**
 * Clean, high-fidelity vector representation of the official standalone KIET Logo.
 * Features a blue arch with an orange star on top and a tilted 3D orbiting ring.
 */
export const KIETLogo: React.FC<KIETLogoProps> = ({ className = '', size, ...props }) => {
  return (
    <svg
      viewBox="0 0 200 220"
      className={`${className} select-none`}
      style={size ? { height: size, width: 'auto' } : undefined}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Orange Star on top */}
      <polygon
        points="100,6 104.5,19 118.5,19 107,27.5 111.5,40.5 100,32 88.5,40.5 93,27.5 81.5,19 95.5,19"
        fill="#F58220"
      />
      
      {/* 3D Orbit Ring: Back half */}
      <path
        d="M 18,105 A 82 22 0 0 1 182,105"
        fill="none"
        stroke="#F58220"
        strokeWidth="8.5"
        strokeLinecap="round"
        transform="rotate(-18 100 105)"
      />

      {/* Blue Gateway Arch */}
      <path
        d="M 35,170 C 35,90 60,40 100,40 C 140,40 165,90 165,170 L 141,170 C 141,110 124,75 100,75 C 76,75 59,110 59,170 Z"
        fill="#0F75BC"
      />

      {/* 3D Orbit Ring: Front half */}
      <path
        d="M 182,105 A 82 22 0 0 1 18,105"
        fill="none"
        stroke="#F58220"
        strokeWidth="8.5"
        strokeLinecap="round"
        transform="rotate(-18 100 105)"
      />

      {/* KIET Bold typography */}
      <text
        x="100"
        y="212"
        textAnchor="middle"
        fill="#0E3C8B"
        fontWeight="900"
        fontSize="38"
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        letterSpacing="2.5"
      >
        KIET
      </text>
    </svg>
  );
};

interface KIETLogoClearProps {
  className?: string;
}

/**
 * Clean, high-fidelity responsive component representing the "KIET Logo clear.jpg" asset.
 * Includes the vector KIET logo on the left, "Karachi Institute of Economics and Technology"
 * in bold typography, "Centre of Excellence" in elegant italic serif, and the diagonal-slashed
 * "25 Years & More" badge on the right.
 */
export const KIETLogoClear: React.FC<KIETLogoClearProps> = ({ className = '' }) => {
  return (
    <div
      id="kiet-coe-logo"
      className={`inline-flex items-center select-none max-w-full transition-all ${className}`}
    >
      {/* Vector KIET Logo */}
      <KIETLogo className="h-14 w-auto flex-shrink-0" />

      {/* Center Typography Block */}
      <div className="flex flex-col justify-center ml-3.5 mr-4 pl-3.5 border-l border-[#F0F5F9]">
        <div className="text-[12px] sm:text-[13px] font-extrabold leading-[1.2] text-[#0B2038] tracking-tight text-left uppercase">
          Karachi Institute
          <span className="block text-[#4B6178] font-normal lowercase my-0.5 text-[11px] sm:text-[12px]">of</span>
          Economics &amp; Tech
        </div>
        <div className="h-[2px] bg-[#F58220] my-1 w-full rounded-full" />
        <div className="text-[9px] sm:text-[10px] font-bold text-[#F58220] tracking-[0.14em] uppercase font-serif italic text-left">
          Centre of Excellence
        </div>
      </div>

      {/* Slanted Accent Separator */}
      <div className="w-[1.5px] h-10 bg-[#F58220]/60 self-center rounded-full" />

      {/* 25 Years Badge */}
      <div className="flex flex-col items-center justify-center pl-4 pr-1.5 flex-shrink-0">
        <div className="relative w-12 h-8 flex items-center justify-center select-none font-black text-3xl sm:text-4xl tracking-tighter">
          <span className="text-[#0F75BC] -mr-[2px]">2</span>
          <span className="text-[#F58220]">5</span>
          {/* Real diagonal-slashed cutting separator */}
          <div className="absolute w-[3px] h-11 bg-white rotate-[24deg] shadow-xs transform origin-center left-[47%] border-l border-r border-[#E2EDF4]" />
        </div>
        <div
          className="text-[9px] sm:text-[10px] text-[#4B6178] font-semibold tracking-tight -mt-0.5 select-none"
          style={{ fontFamily: '"Playpen Sans", "Comic Sans MS", cursive, sans-serif' }}
        >
          Years &amp; More...
        </div>
      </div>
    </div>
  );
};
