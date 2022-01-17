export type KeyType<O, K> = K extends keyof O ? O[K] : {}

export type NullableProp<Props> = {
  [K in keyof Props]: Props[K] extends boolean ? Props[K] : Props[K] | null
}

export type LooseObject<T extends object> = T & {
  [key: keyof any]: unknown
}

export type Promisify<T> = T | Promise<T>

export type RemoveNil<T> = T extends null | undefined | infer S ? S : T

export type RequiredKey<T, ChildrenKey extends string = 'children'> = {
  [K in keyof T as K extends ChildrenKey ? never : K]: T[K]
} & {
  [K in keyof T as K extends ChildrenKey ? K : never]-?: RemoveNil<T[K]>
}

// Omit 遇到 [k: string] 这种 key 会有问题
export type SafeOmit<T, Keys> = {
  [K in keyof T as K extends Keys ? never : K]: T[K]
}
