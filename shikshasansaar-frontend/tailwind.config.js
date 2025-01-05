/** @type {import('tailwindcss').Config} */
module.exports = {
  // Specify the paths to all of the template files in your project
  content: [
    "./src/**/*.{html,js}", // Adjust this according to your project structure
  ],
  theme: {
    // Customize the default theme settings
    extend: {
      // You can add custom colors, fonts, spacing, etc., here
      colors: {
        // Example: Adding custom color
        primary: '#1d4ed8', // Tailwind's blue-600
      },
      spacing: {
        // Example: Adding custom spacing
        '128': '32rem', // Add a custom spacing size
      },
    },
  },
  // Include any plugins you want to use
  plugins: [],
}
