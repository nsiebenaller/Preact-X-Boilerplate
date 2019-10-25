import { h, Component } from 'preact'
import style from './style.css'
import {Table} from '@Shared'
import {compHeaders} from '@Static/reports.json'


const CompLogTable = (props) => (
  <Table
    group={'fundingOpportunity'}
    defaultSort={'logno'}
    headers={compHeaders}
    data={props.data}
    rowComponent={(p) => (<ReportRow {...p} />)}
  />
)

export default CompLogTable

const ReportRow = (props) => {
	const {data} = props
  if(data.items) {
    return(
      <tr class={`std-row ${style.reportRow} ${style.reportHead}`}>
        <td class={style.reportHeader}>
          <div><b>{data.value}</b> ({data.items.length})</div>
        </td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    )
  }
	return(
		<tr class={`std-row ${style.reportRow}`}>
			<td>{data.program}</td>
			<td>{data.logno}</td>
			<td>{data.appType}</td>
      <td>{data.autoSubmit}</td>
      <td>{data.status}</td>
      <td>{data.compliance}</td>
      <td>{data.files}</td>
		</tr>
	)
}
