export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  ssr: false,
  content: {
      experimental: { sqliteConnector: 'native' },
  },
  css: [
    '7.css/dist/7.css',  // importe directement depuis node_modules
    '~/assets/css/content.css'
  ],
  modules: ['@nuxtjs/tailwindcss', 'nuxt-lottie', '@nuxt/icon', '@nuxt/content'],

  runtimeConfig: {
    // The private keys which are only available within server-side
    smtp: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
        toEmail: process.env.SMTP_TO_EMAIL,
        fromEmail: process.env.SMTP_FROM_EMAIL,
    },
  },
  app: {
      head: {
          title: 'Portfolio de Yunikon', // default fallback title
          htmlAttrs: {
              lang: 'fr',
          },
      }
  }
})