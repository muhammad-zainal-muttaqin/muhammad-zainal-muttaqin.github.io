/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['index.html'],
    theme: {
        container: {
            center: true,
            padding: '16px',
        },
        extend: {
            colors: {
                primary: '#312e81',
                secondary: '#6366f1',
                dark: '#0f172a'
            },
            screens: {
                '2xl': '1320px',
            }
        },
        plugins: [],
    }
}