import { Component } from 'react'
import PropTypes from 'prop-types'

export const propTypes = {
  id: PropTypes.string.isRequired,
  closeModalAction: PropTypes.func,
  open: PropTypes.bool,
}

function withModalBehaviour(WrappedComponent) {
  class Modal extends Component {
    constructor(props) {
      super(props)

      this.state = {
        open: props.open,
      }

      this.handleOpen = this.handleOpen.bind(this)
      this.handleClose = this.handleClose.bind(this)
    }

    // Hack to open the modal from other libraries than React (now used by angular)
    componentDidMount() {
      const { id, open } = this.props
      window.addEventListener(`openForm_${id}`, this.handleOpen)

      if (open) {
        this.handleOpen()
      }
    }

    componentDidUpdate(prevProps) {
      const { open } = this.props
      if (prevProps.open !== open) {
        this.handleOpen()
      }
    }

    componentWillUnmount() {
      const { id } = this.props
      window.removeEventListener(`openForm_${id}`, this.handleOpen)
    }

    handleOpen() {
      this.setState({ open: true })
    }

    handleClose() {
      const { closeModalAction } = this.props
      this.setState({ open: false })
      closeModalAction()
    }

    render() {
      const { open } = this.state
      return <WrappedComponent {...this.props} handleClose={this.handleClose} open={open} />
    }
  }

  Modal.defaultProps = {
    closeModalAction: () => {},
    open: false,
  }

  Modal.propTypes = propTypes

  return Modal
}

export default withModalBehaviour
