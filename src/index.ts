import { PiniaCustomProperties, PiniaCustomStateProperties, PiniaPluginContext, _Method } from "pinia";
import { tract, trigger } from "./lib/reactive";
import { Bucket, MiddelWare, PathKey } from "./types";

function createSagaMiddleware(context: PiniaPluginContext): Partial<PiniaCustomProperties & PiniaCustomStateProperties> | void {
  const { options } = context
  const { saga, actions } = options
  const actionsKey = Object.keys(actions)

  if (!saga || actionsKey.length === 0) {
    return
  }

  const sagaOptions = Array.isArray(saga) ? saga : [saga]
  const bucket: Bucket = new Map()

  sagaOptions.forEach(({ paths, middleware }) => {
    if (!middleware || middleware.length === 0) return

    // 如果没有监听actions，或者传了一个空数组，则监听所有的actions
    if (!paths || paths.length === 0) {
      tract(bucket, actionsKey, middleware)
      return
    }

    tract(bucket, paths, middleware)
  })

  return actionsKey.reduce((middleware, key) => {
    middleware[key] = new Proxy(actions[key], {
      apply(target, thisArg, argArray) {
        Reflect.apply(target, thisArg, argArray)
        bucket.has(key) && trigger(bucket.get(key) as Set<MiddelWare>)
      }
    })
    return middleware
  }, {} as Record<PathKey, _Method>)
}

export default createSagaMiddleware