import colors from '../data/colors.json';

export const isDarkishTheme = (appliedTheme: string): boolean =>
  ['dark', 'halloween', 'forest', 'black', 'luxury', 'dracula'].includes(
    appliedTheme,
  );

type Colors = {
  [key: string]: { color: string | null; url: string };
};

export const getLanguageColor = (language: string): string => {
  if (!language) return 'gray';
  const langs = colors as Colors;
  return langs[language]?.color || 'gray';
};

export const skeleton = ({
  widthCls,
  heightCls,
  shape = 'rounded',
  className = '',
}: {
  widthCls: string;
  heightCls: string;
  shape?: string;
  className?: string;
}) => (
  <div
    className={`animate-pulse bg-base-300 ${widthCls} ${heightCls} ${shape} ${className}`}
  />
);

// Simple GA event helper used by some components
export const ga = {
  event: (action: string, params?: Record<string, string>) => {
    try {
      (window as any).gtag?.('event', action, params);
    } catch {}
  },
};
