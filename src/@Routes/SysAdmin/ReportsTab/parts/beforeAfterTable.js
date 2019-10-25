import { h, Component } from 'preact'
import { TreeTable } from '@Shared'
import { baCustomTree } from '@Static/reports.json'


const BeforeAfterTable = (props) => (
  <TreeTable
    data={props.data}
    headers={["Funding Opp-Log Number", "Application Count"]}
    groups={["display", "fundingOpportunity", "status", "logno"]}
    customTree={baCustomTree}
    colFn={props.colFn}
  />
)

export default BeforeAfterTable
