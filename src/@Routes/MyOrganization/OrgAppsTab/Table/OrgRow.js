import { h, Component } from 'preact';


export default function OrgRow (props) {
  const { data } = props
  const permission = true
  return(
    <tr class="comp-row">
      <td>
        <div
          class={`${(permission) ? ("logno-link") : ("")}`}
          onClick={() => {
            if(permission) {
              props.setApp(data)
              props.toggleShowApp(true)
            }
          }}
        >{data.logNo}</div>
      </td>
      <td><div class="max-width-400-col">{data.title}</div></td>
      <td>{data.programCode}</td>
      <td>{data.piFullname}</td>
      <td>{data.preAppDueDate ? data.preAppDueDate.toLocaleDateString() : ''}</td>
      <td>{data.preAppStatus}</td>
      <td>{data.fullAppDueDate ? data.fullAppDueDate.toLocaleDateString() : ''}</td>
      <td>{data.fullAppStatus}</td>
      <td>{data.awardNumber}</td>
    </tr>
  )
}
