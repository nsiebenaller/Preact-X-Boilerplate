import { h, Component } from 'preact'
import style from './style.css'
import {Dropdown, Icon} from '@Shared'
import BeforeAfter from './beforeAfterFilters.js'
import CompLog from './compLogFilters.js'

const tmpOpts = [
  {
    label: "Compliance Log",
    value: "Compliance Log"
  },
  {
    label: "Compliance Run Before After Log",
    value: "Compliance Run Before After Log"
  },
  // {
  //   label: "Compliance Run Result",
  //   value: "Compliance Run Result"
  // },
  // {
  //   label: "Compliance EGS Transfer Log",
  //   value: "Compliance EGS Transfer Log"
  // }
]

const ActionBar = (props) => {
  return(
    <div class={`flex-row ${style.aBar}`}>
      <fieldset>
        <legend><Icon icon={"description"}/><b>Select Report</b></legend>
        <div class={style.fieldGroup}>
          <p>Report</p>
          <Dropdown
            class={style.reportDD}
            value={props.report}
            options={tmpOpts}
            onChange={(e) => {
              props.setState({
                data: null,
                fy: "",
                programs: ["All"],
                fundingOpps: ["All"],
                appType: "Full App",
                report: e.value
              })
            }}
          />
        </div>
      </fieldset>
      <fieldset class={(props.report === 'select') ? (style.disabled) : ("")}>
        <legend><Icon icon={"filter_list"}/><b>Select Filters</b></legend>
        {props.report === 'select' && <div>...</div>}
        {props.report === 'Compliance Run Before After Log' && <BeforeAfter {...props} />}
        {props.report === 'Compliance Log' && <CompLog {...props} />}
      </fieldset>
    </div>
  )
}
export default ActionBar
