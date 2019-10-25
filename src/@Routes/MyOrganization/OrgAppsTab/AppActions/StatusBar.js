import { h, Component } from 'preact';
import style from './StatusBar.less';

export default function StatusBar({ status, statusColor, onClose }) {
  return(
    <div
      class={`${(status === "") ? (style['hidden']) : (style['status-bar'])} ${style[statusColor]}`}
      onClick={onClose}
    >{status}<div>x</div>
    </div>
  )
}
