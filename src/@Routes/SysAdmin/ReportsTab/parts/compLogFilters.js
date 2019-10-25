import { h, Component } from 'preact'
import style from './style.css'
import {
  Button,
  Dropdown,
  Multiselect,
} from '@Shared'
import {formFiscalYearList} from '@Helpers/index.js'
import {appTypes} from '@Static/reports.json'

const CompLogFilters = (props) => {
  return(
    <div class={`flex-row`}>
      <div class={style.fieldGroup}>
        <p>Fiscal Year</p>
        <Dropdown
          class={style.reportDDsm}
          value={props.fy.toString()}
          options={formFiscalYearList()}
          onChange={(e) => {
            props.setYear(e.value)
          }}
        />
      </div>
      <div class={style.fieldGroup}>
        <p>Program</p>
        <Multiselect
          class={style.reportDDsm}
          value={props.programs}
          options={props.programList}
          allValue={'All'}
          onChange={(e) => {
            props.setState({programs: e.parsed})
          }}
        />
      </div>
      <div class={style.fieldGroup}>
        <p>Funding Opportunity</p>
        <Multiselect
          class={style.reportDD}
          value={props.fundingOpps}
          options={props.foList}
          allValue={'All'}
          onChange={(e) => {
            props.setState({fundingOpps: e.parsed})
          }}
        />
      </div>
      <div class={style.fieldGroup}>
        <p>Application Type</p>
        <Dropdown
          class={style.reportDDsm}
          value={props.appType}
          options={appTypes}
          onChange={(e) => {
            props.setState({appType: e.value})
          }}
        />
      </div>
      <div class={style.buttonGroup}>
        <Button
          onClick={props.runReport}
        >Run Report</Button>
      </div>
    </div>
  )
}

export default CompLogFilters
