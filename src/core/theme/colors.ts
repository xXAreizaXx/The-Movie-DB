const DarkColors = {
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

const LightColors = {
  primary: '#F8FAFC',
  secondary: '#E2E8F0',
  accent: '#E50914',
  background: '#FFFFFF',
  surface: '#F1F5F9',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  success: '#16A34A',
  warning: '#D97706',
  error: '#DC2626',
} as const;

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
}

export type ColorKey = keyof ThemeColors;
export type ColorScheme = 'dark' | 'light';

export const ThemeMap = {
  dark: DarkColors,
  light: LightColors,
} as const;

export const Colors = DarkColors;
