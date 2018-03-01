export default function warn (...messages) {
  if (console && console.warn) {
    Function.prototype.apply.call(console.warn, console, messages)
  }
}
