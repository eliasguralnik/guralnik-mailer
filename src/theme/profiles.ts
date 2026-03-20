// src/theme/profiles.ts

export interface ThemeProfile {
  name: string;
  colors: {
    background: string;
    surface: string;
    primary: string;
    accent?: string;       // Secondary accent (for gradients, highlights)
    text: {
      main: string;
      muted: string;
    };
    border: string;
    success?: string;
    error?: string;
  };
  typography: {
    fontFamily: string;
    heading: {
      fontSize: string;
      fontWeight: string;
      letterSpacing?: string;
    };
    body: {
      fontSize: string;
      lineHeight: string;
    };
  };
  spacing: {
    containerPadding: string;
    elementGap: string;
  };
  borderRadius: {
    container: string;
    button: string;
  };
  shadow?: string; // Box shadow for the container card
}

// ──────────────────────────────────────────
// 1. MODERN (Stripe, Vercel, Linear)
// ──────────────────────────────────────────
export const modernTheme: ThemeProfile = {
  name: 'modern',
  colors: {
    background: '#f6f9fc',
    surface: '#ffffff',
    primary: '#0A0A0A',
    accent: '#6366F1',
    text: { main: '#1a1a2e', muted: '#71717a' },
    border: '#e4e4e7',
    success: '#22c55e',
    error: '#ef4444',
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    heading: { fontSize: '24px', fontWeight: '600', letterSpacing: '-0.025em' },
    body: { fontSize: '15px', lineHeight: '26px' },
  },
  spacing: { containerPadding: '48px', elementGap: '24px' },
  borderRadius: { container: '12px', button: '8px' },
  shadow: '0 1px 3px rgba(0,0,0,0.08), 0 8px 30px rgba(0,0,0,0.04)',
};

// ──────────────────────────────────────────
// 2. MINIMAL (Apple, Notion)
// ──────────────────────────────────────────
export const minimalTheme: ThemeProfile = {
  name: 'minimal',
  colors: {
    background: '#ffffff',
    surface: '#ffffff',
    primary: '#000000',
    text: { main: '#1d1d1f', muted: '#86868b' },
    border: '#f5f5f7',
    success: '#30d158',
    error: '#ff3b30',
  },
  typography: {
    fontFamily: '"SF Pro Display", "Helvetica Neue", Helvetica, Arial, sans-serif',
    heading: { fontSize: '22px', fontWeight: '600', letterSpacing: '-0.02em' },
    body: { fontSize: '15px', lineHeight: '28px' },
  },
  spacing: { containerPadding: '48px', elementGap: '32px' },
  borderRadius: { container: '0px', button: '8px' },
};

// ──────────────────────────────────────────
// 3. ELEGANT (Vogue, High-End Fashion)
// ──────────────────────────────────────────
export const elegantTheme: ThemeProfile = {
  name: 'elegant',
  colors: {
    background: '#FAF8F5',
    surface: '#ffffff',
    primary: '#1B1B1B',
    accent: '#B8860B',
    text: { main: '#1B1B1B', muted: '#8A8578' },
    border: '#E8E3DB',
    success: '#5B8C5A',
    error: '#C45B5B',
  },
  typography: {
    fontFamily: 'Georgia, "Times New Roman", Times, serif',
    heading: { fontSize: '28px', fontWeight: '400', letterSpacing: '0.02em' },
    body: { fontSize: '16px', lineHeight: '30px' },
  },
  spacing: { containerPadding: '56px', elementGap: '28px' },
  borderRadius: { container: '0px', button: '0px' },
  shadow: '0 2px 20px rgba(0,0,0,0.04)',
};

// ──────────────────────────────────────────
// 4. BOLD (Nike, Gymshark, Energy)
// ──────────────────────────────────────────
export const boldTheme: ThemeProfile = {
  name: 'bold',
  colors: {
    background: '#F0F0F0',
    surface: '#ffffff',
    primary: '#FF2D20',
    accent: '#FF6B35',
    text: { main: '#0A0A0A', muted: '#525252' },
    border: '#D4D4D4',
    success: '#15B86C',
    error: '#FF2D20',
  },
  typography: {
    fontFamily: '"Arial Black", "Helvetica Neue", Arial, sans-serif',
    heading: { fontSize: '32px', fontWeight: '900', letterSpacing: '-0.02em' },
    body: { fontSize: '15px', lineHeight: '24px' },
  },
  spacing: { containerPadding: '36px', elementGap: '20px' },
  borderRadius: { container: '0px', button: '0px' },
  shadow: '0 4px 0 rgba(0,0,0,0.1)',
};

// ──────────────────────────────────────────
// 5. CLASSIC (Banks, Enterprise, Trust)
// ──────────────────────────────────────────
export const classicTheme: ThemeProfile = {
  name: 'classic',
  colors: {
    background: '#F4F5F7',
    surface: '#ffffff',
    primary: '#1A56DB',
    accent: '#0E9F6E',
    text: { main: '#1F2A37', muted: '#6B7280' },
    border: '#E5E7EB',
    success: '#0E9F6E',
    error: '#E02424',
  },
  typography: {
    fontFamily: 'Arial, Helvetica, sans-serif',
    heading: { fontSize: '24px', fontWeight: '700' },
    body: { fontSize: '15px', lineHeight: '24px' },
  },
  spacing: { containerPadding: '40px', elementGap: '20px' },
  borderRadius: { container: '6px', button: '6px' },
  shadow: '0 1px 2px rgba(0,0,0,0.06)',
};

// ──────────────────────────────────────────
// 6. FUTURISTIC (Web3, Crypto, Gaming)
// ──────────────────────────────────────────
export const futuristicTheme: ThemeProfile = {
  name: 'futuristic',
  colors: {
    background: '#09090B',
    surface: '#18181B',
    primary: '#00FFCC',
    accent: '#A855F7',
    text: { main: '#FAFAFA', muted: '#71717A' },
    border: '#27272A',
    success: '#00FFCC',
    error: '#FF4D6D',
  },
  typography: {
    fontFamily: '"JetBrains Mono", "Courier New", Courier, monospace',
    heading: { fontSize: '24px', fontWeight: '700', letterSpacing: '-0.02em' },
    body: { fontSize: '14px', lineHeight: '24px' },
  },
  spacing: { containerPadding: '40px', elementGap: '24px' },
  borderRadius: { container: '16px', button: '4px' },
  shadow: '0 0 40px rgba(0,255,204,0.06)',
};

// ──────────────────────────────────────────
// 7. MIDNIGHT (Premium Dark Mode)
// ──────────────────────────────────────────
export const midnightTheme: ThemeProfile = {
  name: 'midnight',
  colors: {
    background: '#0F0F14',
    surface: '#1A1A24',
    primary: '#818CF8',
    accent: '#F472B6',
    text: { main: '#E4E4ED', muted: '#6B6B8D' },
    border: '#2D2D3F',
    success: '#34D399',
    error: '#FB7185',
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    heading: { fontSize: '24px', fontWeight: '600', letterSpacing: '-0.02em' },
    body: { fontSize: '15px', lineHeight: '26px' },
  },
  spacing: { containerPadding: '44px', elementGap: '24px' },
  borderRadius: { container: '12px', button: '8px' },
  shadow: '0 4px 30px rgba(0,0,0,0.3)',
};

// ──────────────────────────────────────────
// 8. NATURE (Sustainability, Organic, Craft)
// ──────────────────────────────────────────
export const natureTheme: ThemeProfile = {
  name: 'nature',
  colors: {
    background: '#F3EDE4',
    surface: '#FFFDF8',
    primary: '#3F6B35',
    accent: '#A0752A',
    text: { main: '#2D2418', muted: '#7A7067' },
    border: '#DDD6C9',
    success: '#3F6B35',
    error: '#B84233',
  },
  typography: {
    fontFamily: 'Georgia, "Palatino Linotype", serif',
    heading: { fontSize: '26px', fontWeight: '400', letterSpacing: '0.01em' },
    body: { fontSize: '15px', lineHeight: '28px' },
  },
  spacing: { containerPadding: '44px', elementGap: '24px' },
  borderRadius: { container: '4px', button: '4px' },
  shadow: '0 2px 12px rgba(45,36,24,0.06)',
};

// ──────────────────────────────────────────
// 9. PLAYFUL (Startups, EdTech, Kids)
// ──────────────────────────────────────────
export const playfulTheme: ThemeProfile = {
  name: 'playful',
  colors: {
    background: '#FFF8F0',
    surface: '#ffffff',
    primary: '#FF6B6B',
    accent: '#FFD93D',
    text: { main: '#2D3436', muted: '#A4B0BE' },
    border: '#FFE0D6',
    success: '#00B894',
    error: '#FF6B6B',
  },
  typography: {
    fontFamily: '"Nunito", "Comic Sans MS", "Segoe UI", sans-serif',
    heading: { fontSize: '28px', fontWeight: '800', letterSpacing: '-0.01em' },
    body: { fontSize: '16px', lineHeight: '26px' },
  },
  spacing: { containerPadding: '40px', elementGap: '20px' },
  borderRadius: { container: '24px', button: '100px' },
  shadow: '0 6px 20px rgba(255,107,107,0.08)',
};

// ──────────────────────────────────────────
// 10. MONOCHROME (Brutalism, High-Fashion)
// ──────────────────────────────────────────
export const monochromeTheme: ThemeProfile = {
  name: 'monochrome',
  colors: {
    background: '#000000',
    surface: '#ffffff',
    primary: '#000000',
    text: { main: '#000000', muted: '#555555' },
    border: '#000000',
    success: '#000000',
    error: '#000000',
  },
  typography: {
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    heading: { fontSize: '36px', fontWeight: '900', letterSpacing: '-0.03em' },
    body: { fontSize: '14px', lineHeight: '22px' },
  },
  spacing: { containerPadding: '48px', elementGap: '32px' },
  borderRadius: { container: '0px', button: '0px' },
  shadow: '4px 4px 0 rgba(0,0,0,1)',
};

// ──────────────────────────────────────────
// THEME REGISTRY
// ──────────────────────────────────────────
export const themes: Record<string, ThemeProfile> = {
  modern: modernTheme,
  minimal: minimalTheme,
  elegant: elegantTheme,
  bold: boldTheme,
  classic: classicTheme,
  futuristic: futuristicTheme,
  midnight: midnightTheme,
  nature: natureTheme,
  playful: playfulTheme,
  monochrome: monochromeTheme,
};