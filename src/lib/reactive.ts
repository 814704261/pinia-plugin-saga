import { Bucket, MiddelWare, PathKey } from "~/types";
import run from "./run";

export function tract(bucket: Bucket, paths: PathKey[], middleware: MiddelWare[]) {
  paths.forEach(path => {
    if (bucket.has(path)) {
      const set = bucket.get(path)
      middleware.forEach(m => set?.add(m))
    } else {
      bucket.set(path, new Set(middleware))
    }
  })
}

export function trigger(middlewares: Set<MiddelWare>) {
  middlewares.forEach((fn) => {
    run(fn)
  })
}
