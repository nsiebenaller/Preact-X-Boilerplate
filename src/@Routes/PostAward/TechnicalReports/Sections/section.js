import { h, Component } from 'preact'
import {
  StepOpen,
  StepClosed
} from '../style.js'

const Section = (props) => {
  if(!props.open) {
    return(
      <StepClosed>
        {props.closedHeader}
      </StepClosed>
    )
  }
  return(
    <StepOpen>
      <b>{props.header}</b>
      <div>{props.children}</div>
    </StepOpen>
  )
}

export default Section
