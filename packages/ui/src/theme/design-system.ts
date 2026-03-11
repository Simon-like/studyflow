// StudyFlow 设计系统 - 统一样式规范
export const designSystem = {
  // 颜色系统 - 严格遵循demo.html
  colors: {
    // 主色调 - 珊瑚橙
    coral: {
      DEFAULT: "#E8A87C",
      light: "#F5C9A8",
      dark: "#D4956A",
      50: "#FDF6F1",
      100: "#FAEBE0",
      200: "#F5D6C1",
      300: "#F0C1A2",
      400: "#EBAC83",
      500: "#E8A87C",
      600: "#D4956A",
      700: "#C08258",
      800: "#AB6F46",
      900: "#965C34",
    },
    
    // 辅助色 - 鼠尾草绿
    sage: {
      DEFAULT: "#9DB5A0",
      dark: "#7A9A7E",
      50: "#F4F7F4",
      100: "#E9EFE9",
      200: "#D3DFD4",
      300: "#BDCFBE",
      400: "#A7C0A9",
      500: "#9DB5A0",
      600: "#7A9A7E",
      700: "#5F7F63",
      800: "#456448",
      900: "#2A492D",
    },
    
    // 中性色
    cream: "#FDF8F3",
    warm: "#FAF5F0",
    charcoal: "#3D3D3D",
    stone: "#8A8A8A",
    mist: "#C9C5C1",
    
    // 功能色
    success: "#9DB5A0",
    warning: "#E8A87C",
    error: "#E57373",
    info: "#81C784",
  },
  
  // 字体系统
  fonts: {
    display: "Outfit, sans-serif",
    body: "Noto Sans SC, sans-serif",
  },
  
  // 圆角系统
  radius: {
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "20px",
    "2xl": "24px",
    "3xl": "32px",
    full: "9999px",
  },
  
  // 阴影系统
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
  },
  
  // 间距系统
  spacing: {
    0: "0",
    1: "4px",
    2: "8px",
    3: "12px",
    4: "16px",
    5: "20px",
    6: "24px",
    7: "28px",
    8: "32px",
    9: "36px",
    10: "40px",
    11: "44px",
    12: "48px",
    14: "56px",
    16: "64px",
    20: "80px",
    24: "96px",
    28: "112px",
    32: "128px",
    36: "144px",
    40: "160px",
    44: "176px",
    48: "192px",
    52: "208px",
    56: "224px",
    60: "240px",
  },
  
  // 动画系统
  animations: {
    duration: {
      "75": "75ms",
      "100": "100ms",
      "150": "150ms",
      "200": "200ms",
      "300": "300ms",
      "500": "500ms",
      "700": "700ms",
      "1000": "1000ms",
    },
    timing: {
      linear: "linear",
      in: "cubic-bezier(0.4, 0, 1, 1)",
      out: "cubic-bezier(0, 0, 0.2, 1)",
      "in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
    },
  },
  
  // 断点系统
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
  
  // 组件特定样式
  components: {
    button: {
      base: "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:pointer-events-none",
      variants: {
        primary: "bg-coral text-white hover:bg-coral-600 focus:ring-coral/50 active:scale-95",
        secondary: "bg-white text-charcoal border border-mist hover:bg-warm focus:ring-coral/30 active:scale-95",
        ghost: "bg-transparent text-charcoal hover:bg-warm focus:ring-coral/30 active:scale-95",
      },
      sizes: {
        sm: "px-3 py-1.5 text-sm rounded-lg",
        md: "px-4 py-2 text-base rounded-xl",
        lg: "px-6 py-3 text-lg rounded-2xl",
      },
    },
    
    card: {
      base: "bg-white rounded-2xl shadow-sm transition-all duration-200",
      variants: {
        default: "",
        hover: "hover:shadow-lg hover:-translate-y-1",
        elevated: "shadow-lg",
      },
    },
    
    input: {
      base: "w-full px-4 py-3 bg-white border rounded-xl text-charcoal placeholder:text-mist transition-all duration-200 focus:outline-none focus:ring-2 disabled:bg-warm disabled:cursor-not-allowed",
      variants: {
        default: "border-mist focus:border-coral focus:ring-coral/30",
        error: "border-error focus:border-error focus:ring-error/30",
      },
    },
  },
} as const;

export type DesignSystem = typeof designSystem;