import createSagaMiddleware from '~~/src/index.js'

import { describe, beforeEach, it, expect, vi, beforeAll, test } from 'vitest'
import { createApp, nextTick, Vue2, isVue2, install, ref } from 'vue-demi'
import { setActivePinia, createPinia, defineStore } from 'pinia'


function delay(ms: number) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms)
  })
}

function* hello() {
  const one: number = yield 2;
  console.log('one', one)

  const two: number = yield 3 * one;
  console.log('two', two)

  return 4;
}

function* syncHello() {
  yield delay(1000 * 2)
  console.log('两秒后打印')

  yield delay(1000 * 2)
  console.log('四秒后打印')
}

beforeAll(() => {
  if (isVue2 && Vue2) {
    Vue2.config.productionTip = false
    Vue2.config.devtools = false
    install(Vue2)
  }
})

describe('index.ts', () => {
  beforeEach(() => {
    const app = createApp({})
    const pinia = createPinia()
    pinia.use(createSagaMiddleware)
    app.use(pinia)
    setActivePinia(pinia)
  })

  describe('initStore', () => {
    const useStore = defineStore('test', {
      state() {
        return {
          test: 123
        }
      },
      actions: {
        testAction() {
          this.test = 321
        }
      },
      saga: {
        paths: ['testAction'],
        middleware: [hello, syncHello]
      }
    })

    test('test proxy', async () => {
      const store = useStore()
      store.testAction()
    })
  })

  describe('initStore', () => {
    const useStore = defineStore('test2', {
      state() {
        return {
          test: 1
        }
      },
      actions: {
        testAction() {
          this.test = 2
        }
      },
      saga: {
        paths: [],
        middleware: [hello, syncHello]
      }
    })

    test('test proxy 2', async () => {
      const store = useStore()
      store.testAction()
    })
  })
})
