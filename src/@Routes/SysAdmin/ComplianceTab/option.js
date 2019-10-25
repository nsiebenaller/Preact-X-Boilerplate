import { h, Component } from 'preact'
import { OptionContainer, Opt } from './style.js'

const Option = (props) => (
  <OptionContainer>
    {
      props.options.map((option) => (
        <Opt
          selected={props.selectedOption === option}
          onClick={props.onChange && (() => props.onChange(option))}
        >{option}</Opt>
      ))
    }
  </OptionContainer>
)

export default Option
