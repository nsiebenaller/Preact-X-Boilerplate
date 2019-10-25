import { h, Component } from 'preact'
import style from './Button.less'
import { Btn } from './Styled.js'

/**
 * Button properties
 * @param       {Function}        onClick     Function to call when button is clicked
 * @param       {Boolean}         disabled    Determines if the button is disabled
 * @param       {String|Function} children    Renders into the button component
 * @param       {Boolean}         outlined    Determines if the button has outlined styles
 * @param       {String}          className   Determines custom class to add to button
 * @param       {String}          color       Hexadecimal color for button styling
 */
export default function Button({ onClick, disabled, children, outlined, className, color }) {

  let buttonClass;
  if(outlined) buttonClass = style['outlined-button'];
  else buttonClass = style['button'];

  const disabledClass = disabled ? style['button-disabled'] : '';

  const customClass = className ? className : '';

  const hoverColor = color ? (outlined ? hexToRGB(color, 0.08) : hexToRGB(color, 0.8) ) : null;

  return(
    <Btn
      className={`${buttonClass} ${customClass} ${disabledClass}`}
      tabindex="0"
      outlined={outlined}
      disabled={disabled}
      onClick={(onClick && !disabled) && onClick}
      color={(!disabled) && color}
      hoverColor={(!disabled && color) ? hoverColor : null}
    >{children}</Btn>
  )
}


function hexToRGB(hex, alpha) {
  return `rgba(${parseInt(hex.slice(1, 3), 16)}, ${parseInt(hex.slice(3, 5), 16)}, ${parseInt(hex.slice(5, 7), 16)}, ${alpha ? alpha : ''})`
}
