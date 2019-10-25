import { h, Component } from 'preact'
import { Parent } from './style.js'


const Checkbox = (props) => (
	<Parent
		className={props.class ? props.class : ""}
		checked={props.checked}
    onClick={(e) => {
      e.stopPropagation()
      props.onClick(e)
    }}
  >
		<i className="material-icons">
      {
        props.checked ?
        'check_box' :
        'check_box_outline_blank'
      }
    </i>
    <div>{props.label}</div>
	</Parent>
)

export default Checkbox
