import 'pinia';
export type PathKey = string | number | symbol;
export type MiddelWare = () => Generator;
export type Bucket = Map<PathKey, Set<MiddelWare>>

export interface SagaStateOptions {
  paths?: PathKey[];
  middleware?: MiddelWare[];
}


declare module 'pinia' {
  export interface DefineStoreOptionsBase<S, Store> {
    saga?: SagaStateOptions | SagaStateOptions[]
  }
}
