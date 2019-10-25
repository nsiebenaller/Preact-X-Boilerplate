import { h, Component, render } from 'preact'
import {Container,CloseIcon} from './style.js'


const vert = [
  'top', 'bottom'
]
const horiz = [
  'left', 'right', 'center'
]

const Modal = (props) => {
  return(
    <Container
      id={props.id}
      show={props.opened}
      vertical={props.vertical}
      horizontal={props.horizontal}
    >
      <div>{props.text}</div>
      <CloseIcon
        className={`material-icons`}
        onClick={props.onClose && (() => props.onClose())}
      >clear</CloseIcon>
    </Container>
  )
}

export default Modal
