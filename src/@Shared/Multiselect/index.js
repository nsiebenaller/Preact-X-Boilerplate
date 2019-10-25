import { h, Component } from 'preact'
import { ArrowDropDown, CheckBox, CheckBoxOutlineBlank } from '@Icons'
import style from './style.css'

/*
	PROPS
	@param: value - required
	@param: onChange - required
	@param: options - required
	@param: class - optional
*/

function handleMultiSelect(resp, allVal) {
  if(resp.value === allVal) {
    if(resp.selected.includes(allVal)) {
      return []
    }
    else {
      return [resp.value]
    }
  }
  else {
    if(resp.selected.includes(resp.value)) {
      return resp.selected.filter(i => i !== allVal && i !== resp.value)
    }
    else {
      return resp.selected.filter(i => i !== allVal).concat(resp.value)
    }
  }
}

export default class Multiselect extends Component {
	constructor(props) {
		super(props)
		this.state = {
			opened: false,
      rolloverLimit: (props.rolloverLimit) || 2,
		}
	}

  componentDidMount() {
    document.addEventListener("click", this._polyfill)
    //window.addEventListener("click", (e) => )
  }

  componentWillUnmount() {
    document.removeEventListener("click", this._polyfill)
  }

  _polyfill = (e) => {
    if(
      this.state.opened &&
      this.dropdown &&
      e.target !== this.dropdown &&
      !this.dropdown.contains(e.target)
    ) {
      this.setState({ opened: false })
    }
  }


	render(props, state) {
    const cClass = (props.class) ? (props.class) : ("")
		return(
      <div>
        {props.label && <div class={style.cTextLabel}>{props.label}</div>}
  			<div class={`${style.cDropdown} ${style.cMultiselect} ${cClass}`}
  				ref={dropdown => this.dropdown = dropdown}
  				tabindex="0" //use this to recieve blur/focus
  				onFocus={() => {this.setState({opened: true})}}
  				onBlur={() => {this.setState({opened: false})}}
  			>
  				<div
            class={`${style.cMultitext}`}
            onFocus={() => {this.setState({opened: true})}}
          >
            {props.value.length === 0 && props.noValueText ? props.noValueText : (props.value.length === 0 ? 'select' : '')}
  					{(props.value.length > state.rolloverLimit) ? (`${props.value.length} selected`) : props.value.join(", ")}
            <ArrowDropDown class={style.cArrow} />
  				</div>
  				<div class={(state.opened) ? (`${style.cDrop} ${style.cMultidrop}`) : (`${style.cDrop} ${style.cMultidrop} ${style.cClose}`)}>
  					{
  						props.options.map((opt) => {
  							const selClass = (opt.value === props.value) ? (`${style.cSel}`) : ("")
  							return(
  								<div
  									class={`${style.cMultiopt} ${selClass}`}
  									value={opt.value}
                    title={opt.label}
                    onMouseDown={(e) => {
      								e.preventDefault()
      								e.stopPropagation()
      							}}
  									onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
  										const resp = Object.assign({}, opt, {selected: props.value})
  										const res = (props.allValue) ?
  											(Object.assign({}, resp, {parsed: handleMultiSelect(resp, props.allValue)})) :
  											(resp)
  										props.onChange(res)
  									}}
  								>
                    {
                      (props.value.includes(opt.value) || props.value.includes('All') || (props.allValue && props.value.includes(props.allValue))) ?
                      (
                        <CheckBox class={style.cOptIcon} />
                      ) :
                      (
                        <CheckBoxOutlineBlank class={style.cOptIcon} />
                      )
                    }
  									<div class={`${style.cOptLabel}`}>{opt.label}</div>
  								</div>
  							)
  						})
  					}

  				</div>
			</div>
      </div>
		)
	}
}
