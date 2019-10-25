import { h, Component } from 'preact'
import style from './style.css'

/**
 * TextField Component
 * @param  	{String} 		value 				Required - Value to display in input
 * @param 	{Function}	onChange      Required - Function to call when input changes
 * @param		{Function}	onEnter 			Optional - Function to call when focused & enter is pressed
 * @param 	{Function}	onBlur				Optional - Function to call when input blurs
 * @param		{String}		placeholder		Optional - Placeholder text to display
 * @param		{String}		class 				Optional - Style class to apply
 * @param		{String}		label					Optional - Label to display over the input
 * @param		{Boolean}		fullWidth			Optional - Defines element as block style (width 100%)
 * @param		{String}		type					Optional - Defines the input as a certain type (number, password)
 */

const getType = (props) => {
	if(props.password) return "password"
	if(props.number) return "number"
}

const TextField = (props) => {
	let blurFn = ((e) => e)
	if(!props.onBlur) {
		blurFn = props.onBlur
	}
	return(
		<div class={style.cContainer}>
			{props.label && <div class={style.cTextLabel}>{props.label}</div>}
			<input
				class={`
					${style.cTextfield}
					${props.class ? props.class : ""}
					${props.fullWidth ? style.fullWidth : ""}
					${props.icon ? style.extraPadding : ""}
					${props.disabled ? style.disabled : ""}
				`}
				placeholder={props.placeholder}
				onInput={props.onChange &&
					((e) => {
						if(props.disabled) return
						if(props.numbersOnly) {
							e.target.value = e.target.value.replace(/\D/g,'')
							props.onChange(e.target.value.replace(/\D/g,''))
						}
						else {
							props.onChange(e.target.value)
						}
					})
				}
				onKeyPress={props.onEnter && ((e) => e.key === "Enter" && props.onEnter(e))}
				onBlur={blurFn}
				value={props.value}
				type={getType(props)}
			/>
			{props.icon && (
				props.icon
			)}
		</div>
	)
}

export default TextField
