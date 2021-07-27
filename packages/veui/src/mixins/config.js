import { configContext } from '../managers/config'

// 1. 倾向暴露 factory 而非直接 mixin object
// 2. 使用方自己声明注入字段，可读性更好
export default configContext.useConsumer
