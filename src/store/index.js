import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'

import commonModule from './common'
import userModule from './user'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    commonModule,
    userModule
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
