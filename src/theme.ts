import { StyleSheet } from 'react-native';

export const colors = {
  background: '#1d232a',
  surface: '#191e24',
  cardBg: '#202933',
  textPrimary: '#e5e7eb',
  textSecondary: '#9ca3af',
  textMuted: '#6b7280',
  accent: '#60a5fa',
  accentSecondary: '#a78bfa',
  accentLight: '#1f2937',
  border: '#2a3642',
  skeleton: '#2a3642',
  badgeBg: '#60a5fa',
  badgeText: '#ffffff',
  linkedIn: '#0a66c2',
  star: '#facc15',
  timelineDot: '#334155',
  timelineLine: '#2a3642',
  errorBg: '#3f1d1d',
  errorBorder: '#7f1d1d',
  errorText: '#fca5a5',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 18,
  xl: 22,
  xxl: 26,
} as const;

export const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: radius.lg,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    opacity: 0.85,
    marginBottom: spacing.md,
  },
});

export const languageColors: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Rust: '#dea584',
  Go: '#00ADD8',
  CSS: '#563d7c',
  HTML: '#e34c26',
  Java: '#b07219',
  'C#': '#178600',
  'C++': '#f34b7d',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Shell: '#89e051',
  Vue: '#41b883',
};
