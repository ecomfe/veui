import { createContext } from '../../managers/context'

let { Provider, Consumer, useConsumer } = createContext('select-context')

export {
  Provider as SelectProvider,
  Consumer as SelectConsumer,
  useConsumer as useSelectConsumer
}
