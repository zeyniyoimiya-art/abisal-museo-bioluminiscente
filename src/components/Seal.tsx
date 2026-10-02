// Sello rojo caligráfico de Lin Yue 林玥 (SVG). Textura de tinta con feTurbulence.
interface Props {
  size?: number;
  stamp?: boolean; // animación de sellado
  id?: string;
}

export default function Seal({ size = 120, stamp = false, id = "seal" }: Props) {
  return (
    <svg
      className={stamp ? "seal seal-stamp" : "seal"}
      viewBox="0 0 120 120"
      width={size}
      height={size}
      role="img"
      aria-label="Sello de Lin Yue, 林玥"
    >
      <defs>
        <filter id={`${id}-ink`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="8" result="t" />
          <feColorMatrix in="t" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.1 2.1" result="mask" />
          <feComposite in="SourceGraphic" in2="mask" operator="in" result="eroded" />
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="2" result="w" />
          <feDisplacementMap in="eroded" in2="w" scale="3" />
        </filter>
      </defs>
      <g filter={`url(#${id}-ink)`}>
        <rect x="8" y="8" width="104" height="104" rx="9" fill="#a6192e" />
        <rect x="15" y="15" width="90" height="90" rx="5" fill="none" stroke="#2a0409" strokeWidth="2.2" opacity="0.55" />
        <text
          x="60"
          y="55"
          textAnchor="middle"
          fontFamily="'Ma Shan Zheng','Noto Serif SC',serif"
          fontSize="46"
          fill="#fdeff0"
        >
          林
        </text>
        <text
          x="60"
          y="101"
          textAnchor="middle"
          fontFamily="'Ma Shan Zheng','Noto Serif SC',serif"
          fontSize="46"
          fill="#fdeff0"
        >
          玥
        </text>
      </g>
    </svg>
  );
}
