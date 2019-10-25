import { h, Component } from 'preact';
import style from './OrgGroup.less';

export default function OrgGroup({ data }) {
  return(
    <tr class={`${style['comp-row']} ${style['comp-group']}`}>
      <td>
        <div>
          <b>Fiscal Year: {data.value}</b>({data.items.length})
        </div>
      </td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
  )
}
