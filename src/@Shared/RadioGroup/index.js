import { h, Component } from 'preact'
import { RadioButtonChecked, RadioButtonUnchecked } from '@Icons'
import { Option, OptionContainer } from './style.js'

/**
 * @param   {Array<String>}   options
 * @param   {String}          value
 * @param   {Function}        onChange
 * @param   {String}          label     (optional)
 * @param   {Boolean}         horizontal (optional)
 * @param   {Function}        footer
 */

const RadioGroup = (props) => (
  <div className={props.className ? props.className : ""}>
    {props.label && <div>{props.label}</div>}
    <OptionContainer horizontal={props.horizontal}>
    {
      props.options.map((option) => (
        <Radio
          checked={option === props.value}
          option={option}
          onChange={props.onChange}
        />
      ))
    }
    </OptionContainer>
    {props.footer ? props.footer : null}
  </div>
)

export default RadioGroup

const Radio = (props) => (
  <Option
    onClick={(props.onChange) && ((e) => {
      e.stopPropagation()
      props.onChange(props.option)
    })}
  >
    {props.checked ? <RadioButtonChecked /> : <RadioButtonUnchecked />}
    <div>{props.option}</div>
  </Option>
)
