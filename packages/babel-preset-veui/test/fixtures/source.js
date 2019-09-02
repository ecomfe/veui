import { Input } from 'veui'
import { clone } from 'lodash'

export let a = { ...{ a: 1 } }

console.log(clone)

export class A {
  a = 42
}

export default {
  render () {
    return <div>A</div>
  }
}
