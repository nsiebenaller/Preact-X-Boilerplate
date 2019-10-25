import { h, Component } from 'preact'
import { ArrowDropDown, CheckBox, CheckBoxOutlineBlank } from '@Icons'
import style from './style.css'

/*
	PROPS
	@param: value - required
	@param: onClick - required
	@param: options - required
	@param: class - optional
*/

export default class GroupedMultiSelect extends Component {
	constructor(props) {
		super(props)
		this.state = {
			opened: false,
		}
	}

	render(props, state) {
		return(
			<div>
				{props.label && <div class={style.cTextLabel}>{props.label}</div>}
				<div class={`${style.cDropdown} ${(props.class) ? (props.class) : ("")}`}
					ref={dropdown => this.dropdown = dropdown}
					tabindex="0" //use this to recieve blur/focus
					onFocus={() => { this.setState({opened: true}) }}
					onBlur={() => { this.setState({opened: false}) }}
				>
					<ActiveValue
						value={props.value}
					/>
					<div class={(state.opened) ? (`${style.cDrop}`) : (`${style.cDrop} ${style.cClose}`)}>
	        {
	          Object.keys(props.options).map((group, idx) =>
	            (
	              <div>
	                {idx === 0 && !props.noAllValue && <Option onClick={props.onClick} option={{label: "All", value: "All"}} selValue={props.value} />}
	                <div class={style.groupLabel}>{group}</div>
	                {
	                  props.options[group].map((option) => {
	                    return(
	                      <Option
	                        onClick={props.onClick}
	                        option={option}
	                        selValue={props.value}
	                      />
	                    )
	                  })
	                }
	              </div>
	            ))
	        }
					</div>
				</div>
			</div>
		)
	}
}

const handleMultiselect = (opt, curr) => {
	if(opt.value !== "All") {
		return (curr.includes(opt.value)) ?
			(curr.filter(x => x !== opt.value && x !== "All")) :
			(curr.filter(x => x !== "All").concat(opt.value))
	}
	else {
		return (curr.includes("All")) ?
			(curr.filter(x => x !== "All")) :
			(["All"])
	}
}

const ActiveValue = ({value}) => (
	<div>
		{
			!value || !value.length ?
				"select" :
				(value.length > 2) ?
					`${value.length} selected` :
					value.join(", ")
		}
		<ArrowDropDown class={style.cArrow} />
	</div>
)

const Option = (props) => {
	return(
	  <div
	    class={`${style.optionLabel} ${(props.option.label === 'All') ? style.allOption : ""}`}
			onMouseDown={(e) => {
				e.preventDefault()
				e.stopPropagation()
			}}
	    onClick={() => {
				const resp = {
					value: props.option.value,
					label: props.option.label,
					selected: handleMultiselect(props.option, props.selValue)
				}
	      props.onClick(resp)
	    }}
	  >
			{
				( props.selValue && (props.selValue.includes(props.option.value) || props.selValue.includes('All')) ) ?
				(<CheckBox />) : (<CheckBoxOutlineBlank />)
			}
	    <div class={`${style.cOptLabel}`}>{props.option.label}</div>
	  </div>
	)
}
