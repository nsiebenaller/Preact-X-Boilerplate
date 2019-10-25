import { h, Component } from 'preact'
import { createPortal } from 'preact/compat'
import { ArrowDropDown } from '@Icons'
import {
	Parent,
	ListDiv,
	ListItem,
	ErrorText,
  Label,
  Arrow,
	ActiveField
} from './style.js'

/**
 * @param     {String}      value         Required - The currently selected value
 * @param     {Function}    onChange      Required - Function to call when value changes
 * @param     {Array}       options       Required - Array of options for dropdown list
 * @param     {String}      class         Optional - Class name of styles to be applied
 * @param     {String}      placeholder   Optional - Placeholder text for the input
 * @param     {String}      label         Optional - Label to be placed above dropdown
 * @param     {String}      error         Optional - Error text to be displayed
 */

export default class DropDown extends Component {
	constructor(props) {
		super(props)
		this.state = {
			opened: false,
			text: "",
			target: ""
		}
	}

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions)
    window.addEventListener("keydown", this.handleArrowKeys)
		document.getElementById("app").addEventListener("scroll", this.updateDimensions)
    this.updateDimensions()
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions)
    window.removeEventListener("keydown", this.handleArrowKeys)
		document.getElementById("app").removeEventListener("scroll", this.updateDimensions)
  }

	handleSetState = (obj) => this.setState(obj)

  handleArrowKeys = (e) => {
    const { opened, target } = this.state
    const { options } = this.props
    if(opened) {
			e.preventDefault()
			if(e.key === "Enter" && target !== "") {
				const selected = this.props.options.filter(x => x.label.includes(this.state.target))[0]
				this.props.onChange(selected)
				this.dropdown.blur()
			}
      else if(e.key === "ArrowUp") {
        if(target !== "") {
          let curr
          options.forEach((e, i) => {
            if(e.value === target) curr = i
          })
					if(curr !== undefined && curr !== null && curr !== 0) {
						this.setState({ target: options[curr-1].value })
					}
        }
      }
      else if(e.key === "ArrowDown") {
				if(target === "") {
					this.setState({ target: options[0].value })
				}
				else {
					let curr
	        options.forEach((e, i) => {
	          if(e.value === target) curr = i
	        })
					if(curr !== undefined && curr !== null && curr !== options.length-1) {
						this.setState({ target: options[curr+1].value })
					}
				}
      }
    }
  }

  updateDimensions = (e) => {
		if(this.dropdown && this.list) {
			const domRect = this.dropdown.getBoundingClientRect()
	    this.list.style.top = `${domRect.top}px`
	    this.list.style.left = `${domRect.left}px`
	    this.list.style.width = `${this.dropdown.offsetWidth - 2}px`
			this.list.style.margin = '1px'
		}
  }

	cleanInput = (e) => {
		var charCode = e.keyCode
		if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode == 8)
		    return e.key
		else
		    return ""
	}

	updateSearchText = (e) => {
		if(e.key !== "Enter") {
			const key = this.cleanInput(e)
			const term = (this.state.text.length + key.length > 3) ? (this.state.text + key) : (key)
			const targets = this.props.options.filter(x => x.label.includes(term))
			const target = (targets.length > 0) ? (targets[0].label) : ("")
			this.setState({ text: term, target: target })
		}
		else {
			const selected = this.props.options.filter(x => x.label.includes(this.state.target))[0]
			this.props.onChange(selected)
			this.dropdown.blur()
		}
	}

  setRef = (ref) => {
    this.list = ref
  }

	setDropdownRef = (ref) => {
		this.dropdown = ref
	}

	openDropdown = (e) => {
		this.updateDimensions()
		this.setState({ opened: true })
	}

	render(props, state) {
		return(
			<div>
				{props.label && <Label>{props.label}</Label>}
				<Parent
					className={`${(props.class) ? (props.class) : ("")}`}
					disabled={!!props.disabled}
					ref={this.setDropdownRef}
					onClick={!props.disabled && ((e) => this.openDropdown(e))}
					onFocus={!props.disabled && ((e) => this.openDropdown(e))}
					onBlur={!props.disabled && ((e) => this.setState({ opened: false }))}
					onKeyPress={this.updateSearchText}
					opened={state.opened}
				>
					<ActiveValue
						value={props.value}
						placeholder={props.placeholder}
						disabled={props.disabled}
					/>
            <List
              setRef={this.setRef}
              leftAlign={props.leftAlign}
              opened={state.opened}
              options={props.options}
              onChange={props.onChange}
              value={props.value}
              parent={this.dropdown}
              target={state.target}
							setState={this.handleSetState}
            />
				</Parent>
				{props.error && <ErrorText>{props.error}</ErrorText>}
			</div>
		)
	}
}

const ActiveValue = ({value, placeholder, ...props}) => (
		<ActiveField>
			<div>{(value) ? (value) : ((placeholder) ? placeholder : "select")}</div>
			<ArrowDropDown />
		</ActiveField>
)

const List = ({leftAlign, opened, options, onChange, value, parent, target, setRef, setState}) => {
	return createPortal(
		<ListDiv closed={!opened} ref={setRef} >
			{
				options && options.map((opt) => {
					return(
						<ListItem
							leftAlign={leftAlign}
							selected={opt.label === value}
							targeted={opt.label === target}
							value={opt.value}
							title={opt.label}
							onMouseDown={(e) => {
								e.preventDefault()
								e.stopPropagation()
							}}
							onClick={(e) => {
								onChange(opt)
								setState({ opened: false })
								parent.blur()
							}}
						>{opt.label}</ListItem>
					)
				})
			}
		</ListDiv>
		, document.getElementsByTagName("BODY")[0]
	)
}
