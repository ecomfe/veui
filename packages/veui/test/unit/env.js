window.getComputedStyle = () => ({
  transitionDelay: '',
  animationDelay: '',
  transitionDuration: '',
  animationDuration: ''
})

window.getSelection = () => ({
  removeAllRanges: () => {}
})

Element.prototype.getBoundingClientRect = function () {
  return {
    top: 0,
    right: 100,
    bottom: 100,
    left: 0,
    width: 100,
    height: 100
  }
}
