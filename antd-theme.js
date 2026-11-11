// Webflasher — Ant Design Theme
// In .tsx umbenennen und `import type { ThemeConfig } from 'antd'` ergänzen,
// falls das Projekt TypeScript nutzt.
//
//   import { ConfigProvider } from 'antd';
//   import { webflasherTheme } from './antd-theme';
//   <ConfigProvider theme={webflasherTheme}>…</ConfigProvider>

import { theme } from 'antd';

export const webflasherTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    // Flächen: Layout schwarz, Container eine Stufe heller
    colorBgLayout: '#000000',
    colorBgContainer: '#141414',
    colorBgElevated: '#1f1f1f',

    // Kanten
    colorBorder: '#424242',          // interaktive Elemente
    colorBorderSecondary: '#303030', // Trennlinien in Panels

    // Status und Akzent (antd-Defaults für Dark, bewusst nicht überschrieben)
    colorPrimary: '#1668dc',
    colorSuccess: '#49aa19',
    colorWarning: '#d89614',
    colorError: '#dc4446',

    borderRadius: 6,
    borderRadiusLG: 8,
    borderRadiusSM: 4,

    fontFamilyCode: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace",
  },
  components: {
    // Tooling-UI: dichte Oberfläche, aber Controls groß genug zum Treffen
    Button: { controlHeight: 40 },
    Input: { controlHeight: 40 },
    Select: { controlHeight: 40 },
    Layout: { headerHeight: 56, headerBg: '#141414', headerPadding: '0 24px' },
    Menu: { darkItemBg: '#141414', darkSubMenuItemBg: '#141414' },
  },
};

// Werte, für die antd keine Tokens hat — Code-Feld, Hex-Dump, Serial-Log.
export const codeTokens = {
  bg: '#000000',          // dunkelste Fläche, liegt in den Panels
  lineNumber: '#595959',
  plain: '#D9D9D9',
  keyword: '#a0a9f7',
  string: '#d8b97d',
  number: '#e8a33d',
  func: '#3c89e8',
  comment: '#8C8C8C',
  // Log-Level, abgeleitet aus den antd-Statusfarben
  levelInfo: '#3c89e8',
  levelWarn: '#d89614',
  levelError: '#dc4446',
  levelDebug: '#a0a9f7',
  // Hex-Dump
  hexOffset: '#8C8C8C',
  hexAscii: '#6abe39',
  // Meta-Text: #8C8C8C statt antds colorTextTertiary (#737373),
  // das bei 12px unter 4.5:1 Kontrast fällt
  meta: '#8C8C8C',
};
