import { h, Component, render } from 'preact'
import { createPortal } from 'preact/compat'
import {
  Backdrop,
  ModalBox,
  ModalTitle,
  ModalContents,
  ModalActionPrompt,
  ModalActions,
  Confirm,
  Cancel,
} from './style.js'

/**
 * @param   {Function}              onClose
 * @param   {String}                modalClass
 * @param   {Boolean}               open
 * @param   {String|Component}      title
 * @param   {String|Component}      content
 * @param   {String|Component}      actionPrompt
 * @param   {String}                confirmText
 * @param   {Function}              onClose
 * @param   {Function}              onConfirm
 * @param   {Component}             actions
 */

export default class Modal extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  onClose = () => {
    if(this.props.onClose) this.props.onClose()
  }

  preventDefault = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  render(props, state) {
    return createPortal(
      <Backdrop
        onClick={this.onClose}
        open={props.open}
      >
        <ModalBox onClick={this.preventDefault} className={props.modalClass || ''}>
          <ModalTitle>{props.title}</ModalTitle>
          <ModalContents>{props.content}</ModalContents>
          {props.actionPrompt && <ModalActionPrompt>{props.actionPrompt}</ModalActionPrompt>}
          {
            props.actions ?
              props.actions :
              (
                <ModalActions>
                  <Cancel onClick={props.onClose}>Cancel</Cancel>
                  <Confirm onClick={props.onConfirm && (() => props.onConfirm())}>{props.confirmText}</Confirm>
                </ModalActions>
              )
          }
        </ModalBox>
      </Backdrop>
      , document.getElementsByTagName("BODY")[0]
    )
  }
}
