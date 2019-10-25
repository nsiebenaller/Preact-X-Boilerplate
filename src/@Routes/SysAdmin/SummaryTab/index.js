import { h, Component } from 'preact'
import SysMetric from "./SysMetric.js"

const SummaryTab = ({sysReport, ...props}) => {
  return(
  <div>
    <h2>System Administration Summary</h2>
    <hr />
    <SysMetric
      label={'Free Space'}
      value={sysReport.freeSpaceMB}
    />
    <SysMetric
      label={'Total Space'}
      value={sysReport.totalSpaceMB}
    />
    <SysMetric
      label={'# of Authenticated Users'}
      value={sysReport.authUsers}
    />
    <SysMetric
      label={'# of Active Sessions'}
      value={sysReport.activeSessions}
    />

    <br />
    <a href="/eBRAP/SysAdmin/loadAwardNbrSpreadsheet.htm">Load Award Number Spreadsheet</a>
    <p>Spreadsheet should contain a single header row at the top and columns for log number, award number, EGS Org Id, and Organization Name</p>

    <br/>
    <a href="/eBRAP/SysAdmin/loadScienceOfficerSpreadsheet.htm">Load Multiple Science Officers Spreadsheet</a>
    <p>Spreadsheet should contain a single header row at the top and columns for log number, first name, last name, and email</p>


  </div>
)}

export default SummaryTab
