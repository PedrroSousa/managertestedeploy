/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                lampi: {
                    green: '#4CAF50',
                    dark: '#388E3C',
                    light: '#A5D6A7', // Added for softer hovers if needed
                    offwhite: '#F9F9F9',
                    offwhite2: '#F0F0F0',
                    text: '#333333',
                }
            }
        },
    },
    plugins: [],
}
