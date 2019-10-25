import { h, Component } from 'preact'
import { Table, Groupedselect } from '@Shared'
import style from './style.css'
import { compAppHeaders, complianceActions } from '@Static/compliance.json'


const ApplicationTable = (props) => (
  <Table
    defaultSort={'logno'}
    tableClass={style.complianceTable}
    perPage={25}
    data={props.data}
    headers={compAppHeaders}
    actionComponent={(p) => <ActionComponent performAction={props.performAction} {...p} />}
    rowComponent={(p) => (
      <CompRow
        checked={props.checked}
        onChange={props.onChange}
        {...p}
      />)}
    />
)

export default ApplicationTable

const CompRow = (props) => {
	const {data} = props
  const { fundingOpportunity, application } = data.compliance
  const isDisabled = !(
    fundingOpportunity.preApp.jobStatus === "" &&
    fundingOpportunity.fullApp.jobStatus === "" &&
    application.preApp.jobStatus === "" &&
    application.fullApp.jobStatus === "")
	return(
		<tr class={`${style.complianceRow} ${(isDisabled) ? (style.disabledRow) : ('')}`}>
			<td>
      {
        application.preApp.jobStatus !== "" &&
        <b>{`${application.preApp.jobStatus} PreApp`}</b>
      }
      {
        application.fullApp.jobStatus !== "" &&
        <b>{`${application.fullApp.jobStatus} FullApp`}</b>
      }
      {
        fundingOpportunity.preApp.jobStatus !== "" &&
        <b>{`${fundingOpportunity.preApp.jobStatus} PreApp`}</b>
      }
      {
        fundingOpportunity.fullApp.jobStatus !== "" &&
        <b>{`${fundingOpportunity.fullApp.jobStatus} FullApp`}</b>
      }
      {
        !isDisabled &&
        (
          <input
    				type="checkbox"
    				checked={props.checked.includes(data.logno)}
    				onClick={(e) => props.onChange(data.logno)}
    			/>
        )
      }
      </td>
			<td><div>{data.logno}</div></td>
			<td>{data.fy}</td>
			<td>{data.program}</td>
			<td>{data.mechanismOption}</td>
      <td>{(application.preApp.status !== "") ? (application.preApp.status) : (fundingOpportunity.preApp.status)}</td>
      <td>{(application.fullApp.status !== "") ? (application.fullApp.status) : (fundingOpportunity.fullApp.status)}</td>
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
