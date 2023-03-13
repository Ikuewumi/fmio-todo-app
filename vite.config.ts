import { defineConfig } from "vite"
import {VitePWA} from "vite-plugin-pwa";




export default defineConfig({



    plugins: VitePWA({
        includeAssets: ['favicon.ico', 'apple-touch-icon.png',"*/.ttf", "*/.woff", "*/.css", "*/.woff2", "*/.png", 'fonts/*.ttf', 'images/*.png'],
        manifest: {
          name: 'Todo App',
          short_name: 'Todo',
          description: 'A mini-app to keeptrack of your todos',
          theme_color: '#3a7bfd',
          icons: [
            {
              src: 'android-chrome-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'android-chrome-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        }
      })


})