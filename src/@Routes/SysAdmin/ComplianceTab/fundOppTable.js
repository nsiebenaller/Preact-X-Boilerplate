import { h, Component } from 'preact'
import { Table, Groupedselect } from '@Shared'
import style from './style.css'
import {
  compFundingOppHeaders,
  complianceActions
} from '@Static/compliance.json'

const FundOppTable = (props) => {
  return(
    <Table
      defaultSort={'fundingOpp'}
      tableClass={style.complianceTable}
      perPage={25}
      data={props.data}
      headers={compFundingOppHeaders}
      actionComponent={(p) => <ActionComponent performAction={props.performAction} {...p} />}
      rowComponent={(p) => (
        <CompRow
          checked={props.checked}
          onChange={props.onChange}
          {...p}
        />)}
      />
  )
}

export default FundOppTable

const CompRow = (props) => {
	const {data} = props
  const { preApp, fullApp } = data.compliance
  const isDisabled = !(preApp.jobStatus === "" && fullApp.jobStatus === "")
	return(
		<tr class={`${style.complianceRow} ${(isDisabled) ? (style.disabledRow) : ('')}`}>
			<td>
        {
          preApp.jobStatus !== "" &&
          <b>{`${preApp.jobStatus} PreApp`}</b>
        }
        {
          fullApp.jobStatus !== "" &&
          <b>{`${fullApp.jobStatus} FullApp`}</b>
        }
        {
          !isDisabled &&
          (
            <input
      				type="checkbox"
      				checked={props.checked.includes(data.fundingOpp)}
      				onClick={(e) => props.onChange(data.fundingOpp)}
      			/>
          )
        }
      </td>
			<td><div>{data.fundingOpp}</div></td>
			<td class={style.width300}>{data.numApps}</td>
			<td>{data.fy}</td>
			<td>{data.program}</td>
      <td>{preApp.status}</td>
      <td>{fullApp.status}</td>
		</tr>
	)
}

const ActionComponent = (props) => (
  <Groupedselect
  	class={style.actionDropdown}
  	value={"Perform Compliance Action"}
  	options={complianceActions}
  	onClick={(opt) => props.performAction(opt)}
   />
)
