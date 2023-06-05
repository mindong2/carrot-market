/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // darkMode:"media", -> 브라우저 모드에 따른 dark, light모드를 따라감
  /* 
    상단에 dark라는 class를 가진 부모아래 자식의 dark:bg-yellow-500 과 같은 class를 가진 element들이 다크모드로 변경  
    html에 dark를 추가하는식 -> class조작으로 toggle가능
  */
  darkMode:"class", 
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
}
