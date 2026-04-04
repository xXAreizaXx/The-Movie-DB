export const Colors = {
  primary: '#0F172A',
  secondary: '#1E293B',
  accent: '#E50914',
  background: '#020617',
  surface: '#0B1220',
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  border: '#1F2937',
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
} as const;

export type ColorKey = keyof typeof Colors;
