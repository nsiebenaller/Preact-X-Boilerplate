import { h, Component, render } from 'preact'
import { createPortal } from 'preact/compat'
import Modal from './modal/index.js'
import style from './style.css'


export default class ModalManager extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render(props, state) {
    return(
      <Portal into="body">
        <Modal {...props} />
      </Portal>
    )
  }
}
