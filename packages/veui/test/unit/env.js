window.getComputedStyle = () => {
  return {
    transitionDelay: '',
    animationDelay: '',
    transitionDuration: '',
    animationDuration: ''
  }
}

window.getSelection = () => ({
  removeAllRanges: () => {}
})
