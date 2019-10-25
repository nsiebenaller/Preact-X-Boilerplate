import { h, Component } from 'preact'
import style from './EditRow.less'

export default function Row(props) {
  return(
    <div class={style['header']}>
      <b>{props.label}</b>
      <div>{props.value}</div>
    </div>
  )
}
