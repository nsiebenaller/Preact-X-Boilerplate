import { h, Component } from 'preact'
import style from './ImageRow.less'
import { IS_DEV } from '@Api'

export default function ImageRow(props) {

  const imgUrl = `${IS_DEV ? '' : '/eBRAP/build'}/assets/images/DoD-icon-min.png`

  return (
  	<div>
  		<div class={style['header-img']}>
  			<img src={imgUrl} style="height: 110px;" />
  		</div>
  	</div>
  )
}
