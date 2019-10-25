import { h, Component } from 'preact'
import { HelpOutline } from '@Icons'
import { LabelModal } from './style.js'


export default class LabelHelpModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      open: false
    }
  }

  componentDidMount() {
    window.addEventListener("click", this.handleClick);
    window.addEventListener("resize", this.updateDimensions);
    document.getElementById("app").addEventListener("scroll", this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.handleClick);
    window.removeEventListener("resize", this.updateDimensions);
    document.getElementById("app").removeEventListener("scroll", this.updateDimensions);
  }

  handleClick = (e) => {
    if(this.parent && !this.parent.contains(e.target)) this.closeModal()
  }
  setRef = (name) => (ref) =>  this[name] = ref
  openModal = () => {
    this.updateDimensions()
    this.setState({ open: !this.state.open })
  }
  closeModal = () => this.setState({ open: false })
  updateDimensions = () => {
		if(this.base && this.modal) {
			const domRect = this.base.getBoundingClientRect()
	    this.modal.style.top = `${domRect.top - 150}px`
	    this.modal.style.left = `${domRect.left - 75}px`
			this.modal.style.margin = '1px'
		}
  }

  render(props, state) {
    return(
      <div
        onClick={this.openModal}
        ref={this.setRef('parent')}
      >
        <HelpOutline class="pointer" />
        <LabelModal
          ref={this.setRef('modal')}
          hidden={!state.open}
        >This field allows you to create a  label which can be used to categorize your files. And making it easier to find a file later using the Search by label option from the Submitted Documents table below. You can either create a new label or use one that you have previously created.
        </LabelModal>
      </div>
    )
  }
}
