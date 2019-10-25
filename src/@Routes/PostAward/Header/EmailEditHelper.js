import { h, Component } from 'preact'
import { LabelModal } from './style.js'

export default class LabelHelpModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      open: false
    }
  }

  setRef = (name) => (ref) =>  this[name] = ref
  openModal = () => {
    this.updateDimensions()
    this.setState({ open: true })
  }
  closeModal = () => this.setState({ open: false })
  updateDimensions = () => {
		if(this.base && this.modal) {
			const domRect = this.base.getBoundingClientRect()
	    this.modal.style.top = `${domRect.top - 30}px`
	    this.modal.style.left = `${domRect.left + 40}px`
			this.modal.style.margin = '1px'
		}
  }

  render(props, state) {
    return(
      <div
        onMouseEnter={this.openModal}
        onMouseLeave={this.closeModal}
      >
        {props.children}
        <LabelModal
          ref={this.setRef('modal')}
          hidden={!state.open}
        >Editing email here will only update your Award email communications. If you need to edit your profile email, please go to My Profile and update your contact info.</LabelModal>
      </div>
    )
  }
}
