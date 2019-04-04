jest.mock('popper.js', () => {
  const PopperJS = jest.requireActual('popper.js')

  return class {
    constructor () {
      this.placements = PopperJS.placements
      return {
        destroy: () => {},
        scheduleUpdate: () => {}
      }
    }
  }
})

window.getComputedStyle = () => {
  return {
    transitionDelay: '',
    animationDelay: '',
    transitionDuration: '',
    animationDuration: ''
  }
}
