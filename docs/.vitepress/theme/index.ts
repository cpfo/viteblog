import { h } from 'vue'
import Theme from 'vitepress/theme'
import Waline from './components/Waline.vue'
import './styles.css'

export default {
  extends: Theme,
  Layout: () => {
    return h(Theme.Layout, null, {
      'doc-after': () => h(Waline),
    })
  },
}
