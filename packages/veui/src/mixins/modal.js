import modal from '../managers/modal'

export default {
  data () {
    return {
      $_modalOpen: false
    }
  },
  methods: {
    openModal () {
      if (this.$data.$_modalOpen) {
        return
      }
      modal.open()
      this.$data.$_modalOpen = true
    },
    closeModal () {
      if (!this.$data.$_modalOpen) {
        return
      }
      modal.close()
      this.$data.$_modalOpen = false
    },
    isModalOpen () {
      return this.$data.$_modalOpen
    }
  }
}
