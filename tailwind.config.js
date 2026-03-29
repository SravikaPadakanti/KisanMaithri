/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                farm: {
                    green: {
                        DEFAULT: '#2F855A', // Primary deep green
                        light: '#48BB78',
                        dark: '#22543D',
                    },
                    earth: '#C05621', // Earthy orange
                    sky: '#63B3ED', // Sky blue
                    cream: '#F7FAFFC', // Background cream (custom tint of off-white)
                    darkbg: '#1A202C', // Deep charcoal for dark mode
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                }
            }
        },
    },
    plugins: [],
}
