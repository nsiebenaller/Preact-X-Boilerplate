import { h, Component } from 'preact'
import { createPortal } from 'preact/compat'
import {
  Parent,
  Input,
  OptionList,
  Option,
  NotFound,
  ListParent,
  TextLabel,
} from './style.js'

/**
 * AutoComplete Component
 * @param   {String}    value         Required  - Current displayed value
 * @param   {Array}     options       Required  - Available options to match against
 * @param   {Function}  onChange      Required  - Function to call when input is changed
 * @param   {String}    label         Optional  - Label to display above input
 * @param   {Number}    maxOptions    Optional  - Max number of options in list for the list to appear
 * @param   {Number}    minLength     Optional  - Min number of characters in input for the list to appear
 * @param   {String}    class         Optional  - Styling class to apply to parent element
 * @param   {String}    placeholder   Optional  - Placeholder of input element
 * @param   {Boolean}   fullWidth     Optional  - Converts element to block element (setting width to 100%)
 */

const filterOptions = (options, value, max = null) => {
  const valueLowerCase = value ? value.toLowerCase() : ''
  const filtered = options.filter(x => x && x.toLowerCase().includes(valueLowerCase))
  if(max && filtered.length > max) {
    return filtered.slice(0, max)
  }
  return filtered
}

export default class AutoComplete extends Component {
  constructor(props) {
    super(props)
    this.state = {
      opened: false
    }
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions)
    document.getElementById("app").addEventListener("scroll", this.updateDimensions)
    this.updateDimensions()
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions)
    document.getElementById("app").removeEventListener("scroll", this.updateDimensions)
  }

  updateDimensions = (e) => {
    if(this.input && this.list) {
      const domRect = this.input.getBoundingClientRect();
      this.list.style.top = `${domRect.top + this.input.offsetHeight}px`
      this.list.style.left = `${domRect.left}px`
      this.list.style.width = `${this.input.offsetWidth}px`
    }
  }

  setRef = (ref) => {
    this.list = ref
  }

  setDropdownRef = (ref) => this.dropdown = ref

  setInputRef = (ref) => this.input = ref

  handleSetState = (e) => this.setState(e)

  handleInput = (e) => {
    this.props.onChange(e)
    if(!this.state.opened) {
      this.setState({opened: true})
    }
  }

  render(props, state) {
    const valueLength = props.value ? props.value.length : 0
    const minLengthPass = props.minLength ? (valueLength >= props.minLength) : (valueLength > 0)
    const options = filterOptions(props.options, props.value, props.maxOptions)
    return(
      <Parent
        className={props.class && props.class}
        ref={this.setDropdownRef}
      >
        {props.label && <TextLabel>{props.label}</TextLabel>}
        <Input
          ref={this.setInputRef}
          fullWidth={props.fullWidth}
          placeholder={props.placeholder ? props.placeholder : null}
          onInput={props.onChange && ((e) => this.handleInput(e.target.value))}
          value={props.value}
          onClick={(e) => {
            this.updateDimensions()
            this.setState({opened: true})
          }}
          onBlur={(e) => {
            this.setState({opened: false})
            props.onBlur && props.onBlur()
          }}
        />
        {
          options.length !== 0 &&
          <List
            setRef={this.setRef}
            opened={state.opened && minLengthPass}
            options={filterOptions(props.options, props.value, props.maxOptions)}
            onClick={props.onChange}
            setState={this.handleSetState}
          />
        }
      </Parent>
    )
  }
}

const List = (props) => {
  return createPortal(
    <ListParent
      opened={props.opened}
      ref={props.setRef}
    >
      <OptionList>
      {
        props.options.length === 0 &&
        <NotFound>not found</NotFound>
      }
      {
        props.options.map((opt) => {
          return(
            <Option
              onMouseDown={(e) => {
                e.preventDefault()
              }}
              onClick={() => {
                props.onClick(opt)
                props.setState({opened: false})
              }}
            >{opt}</Option>
          )
        })
      }
      </OptionList>
    </ListParent>
    , document.getElementsByTagName("BODY")[0]
  )
}
