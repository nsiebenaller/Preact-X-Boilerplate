import { h, Component } from 'preact'

/**
 * Icon Component
 * @param   {String}    icon      Required - icon to display (https://material.io/tools/icons/?style=baseline)
 * @param   {String}    class     Optional - Style class to apply
 * @param   {String}    title     Optional - title to apply when hovering
 * @param   {Function}  onClick   Optional - Function to call when icon is clicked
 */

const Icon = (props) => (
  <div
    class={props.class ? props.class : ""}
    title={`${props.title ? props.title : ""}`}
  >
    <i class={`material-icons`}
    onClick={props.onClick && (() => props.onClick())}
    >{props.icon}</i>
  </div>
)
export default Icon


// To be used in the future...
/*
const Icon = ({ icon, ...props }) => {
  switch(icon) {
    case 'arrow_back':
      return <Icons.ArrowBack {...props} />
      break
    case 'arrow_drop_down':
      return <Icons.ArrowDropDown {...props} />
      break
    case 'arrow_drop_up':
      return <Icons.ArrowDropUp {...props} />
      break
    case 'cancel':
      return <Icons.Cancel {...props} />
      break
    case 'check_circle':
      return <Icons.CheckCircle {...props} />
      break
    case 'check_circle_outline':
      return <Icons.CheckCircleOutline {...props} />
      break
    case 'clear':
      return <Icons.Clear {...props} />
      break
    case 'delete':
      return <Icons.Delete {...props} />
      break
    case 'delete_outline':
      return <Icons.DeleteOutline {...props} />
      break
    case 'edit':
      return <Icons.Edit {...props} />
      break
    case 'radio_button_checked':
      return <Icons.RadioButtonChecked {...props} />
      break
    case 'radio_button_unchecked':
      return <Icons.RadioButtonUnchecked {...props} />
      break
    case 'save':
      return <Icons.Save {...props} />
      break
    case 'save_alt':
      return <Icons.SaveAlt {...props} />
      break
    default:
      return <div>{icon}</div>
  }
}
*/
