import { h, Component } from 'preact'
import style from '../style.css'
import { Table } from '@Shared'

const LeftPanel = (props) => {
  return(
    <div style="min-width: 680px;">
      <Table
        defaultSort={'id'}
        tableClass={style.appActionsTable}
        headers={{
          "Log #": "logno",
          "Principal Investigator": "pi",
          "Pre App Status": "preAppStatus",
          "Full App Status": "fullAppStatus"
        }}
        data={props.applications}
        rowComponent={(p) => (
          <tr
            class={`std-row ${style.appActionsRow} ${props.selectedApp.logNo === p.data.logNo ? style.selRow : ""}`}
            onClick={() => {
              props.getApplicationInfo(p.data.appPkgId)
            }}
          >
            <td>{p.data.logNo}</td>
            <td>{p.data.pi}</td>
            <td>{p.data.preAppStatus}</td>
            <td>{p.data.fullAppStatus}</td>
          </tr>)}
      />
    </div>
  )
}

export default LeftPanel
