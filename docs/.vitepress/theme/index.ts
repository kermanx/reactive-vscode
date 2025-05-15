/// <reference types="vitepress/client" />

import type { EnhanceAppContext } from 'vitepress'
import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client'
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import '@shikijs/vitepress-twoslash/style.css'
import 'virtual:uno.css'
import 'virtual:group-icons.css'
import './styles.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }: EnhanceAppContext) {
    app.use(TwoslashFloatingVue)
  },
}
