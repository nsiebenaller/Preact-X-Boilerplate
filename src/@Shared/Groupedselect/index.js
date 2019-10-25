import { h, Component } from 'preact'
import style from './style.css'

/*
	PROPS
	@param: value - required
	@param: onClick - required
	@param: options - required
	@param: class - optional
*/

export default class GroupedSelect extends Component {
	constructor(props) {
		super(props)
		this.state = {
			opened: false,
		}
	}

	render(props, state) {
		return(
			<div class={`${style.cDropdown} ${(props.class) ? (props.class) : ("")}`}
				ref={dropdown => this.dropdown = dropdown}
				tabindex="0" //use this to recieve blur/focus
				onFocus={() => {this.setState({opened: true})}}
				onBlur={() => {this.setState({opened: false})}}
			>
				<div>
					{props.value ? props.value : "select"}
					<i class={`material-icons ${style.cArrow}`}>arrow_drop_down</i>
				</div>
				<div class={(state.opened) ? (`${style.cDrop}`) : (`${style.cDrop} ${style.cClose}`)}>
        {
          Object.keys(props.options).map((group, i) => {

            return(
              <div>
                <div class={style.groupLabel}>{group}</div>
                {
                  props.options[group].map((option) => {
                    return(
                      <div
												class={style.optionLabel}
												onClick={() => {
													props.onClick(option)
													this.dropdown.blur()
												}}
											>{option.label}</div>
                    )
                  })
                }
								{
									Object.keys(props.options).length-1 !== i &&
									<hr />
								}								
              </div>
            )
          })
        }
				</div>
			</div>
		)
	}
}
