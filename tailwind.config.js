/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      // Band Requirements Color System
      colors: {
        // Primary Teal/Turquoise Palette with full scale
        teal: {
          50: "#f0fdfa",
          100: "#ccfbf1", 
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6", // Primary color
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
          950: "#042f2e"
        },
        // Semantic Colors
        success: "#10b981",
        warning: "#f59e0b", 
        error: "#ef4444",
        info: "#3b82f6",
        // Band Section Colors
        brass: {
          50: "#fef7ee",
          500: "#f97316", // Orange for brass section
          600: "#ea580c",
          700: "#c2410c"
        },
        woodwind: {
          50: "#f0f9ff",
          500: "#3b82f6", // Blue for woodwind section
          600: "#2563eb",
          700: "#1d4ed8"
        },
        percussion: {
          50: "#fdf4ff",
          500: "#a855f7", // Purple for percussion section
          600: "#9333ea",
          700: "#7c3aed"
        },
        string: {
          50: "#fef2f2", 
          500: "#ef4444", // Red for string section
          600: "#dc2626",
          700: "#b91c1c"
        },
        // Equipment Status Colors
        equipment: {
          available: "#22c55e",
          checkedOut: "#f59e0b",
          maintenance: "#ef4444",
          retired: "#6b7280"
        }
      },
      // Mobile-First Breakpoint System
      screens: {
        'xs': '320px',    // Extra small mobile
        'sm': '640px',    // Small mobile/large mobile
        'md': '768px',    // Tablet portrait 
        'lg': '1024px',   // Tablet landscape/small desktop
        'xl': '1280px',   // Desktop
        '2xl': '1536px'   // Large desktop
      },
      // Enhanced Border Radius for Glassmorphism
      borderRadius: {
        md: "8px",
        lg: "12px",
        xl: "16px"
      },
      // Touch-Friendly Sizing
      minHeight: {
        'touch': '44px',  // Minimum touch target size
      },
      minWidth: {
        'touch': '44px',  // Minimum touch target size
      },
      // Glassmorphism Effects
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        DEFAULT: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px'
      },
      // Typography Scale
      fontSize: {
        'xs': ['12px', { lineHeight: '16px' }],
        'sm': ['14px', { lineHeight: '20px' }],
        'base': ['16px', { lineHeight: '24px' }],
        'lg': ['18px', { lineHeight: '28px' }],
        'xl': ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['30px', { lineHeight: '36px' }],
        '4xl': ['36px', { lineHeight: '40px' }]
      },
      // Animation for Mobile Interactions
      animation: {
        'bounce-light': 'bounce 1s ease-in-out 2',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      // Box Shadow for Glass Effects
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-strong': '0 8px 32px 0 rgba(31, 38, 135, 0.5)'
      }
    }
  },
  plugins: []
};
