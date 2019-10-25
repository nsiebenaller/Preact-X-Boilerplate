import { h, Component } from 'preact'
import style from './style.css'

const Radio = (props) => (
  <div
    class={style.rParent}
    onClick={props.onClick && (() => props.onClick())}>
    <div class={style.rGroup}>
      <i class={`material-icons ${style.rIcon} ${props.checked ? style.rIconActive : ""}`}>
      {props.checked ? "radio_button_checked" : "radio_button_unchecked"}
      </i>
      <input type="radio" />
    </div>
    <div class={style.rText}>{props.label}</div>
  </div>
)

export default Radio
