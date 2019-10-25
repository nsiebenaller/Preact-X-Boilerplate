import { h, Component } from 'preact'
import ActionBar from './parts/actionBar.js'
import style from './style.css'
import {Button} from '@Shared'
import {
  runBeforeAfterReport,
  runCompLogReport,
  downloadBeforeAfterReport,
  downloadCompLogReport,
  getFundingOpportunities,
  getPrograms,
} from '@Api'
import { formOptions } from '@Helpers'
import BeforeAfterTable from './parts/beforeAfterTable.js'
import CompLogTable from './parts/compLogTable.js'

export default class Reports extends Component {
  constructor(props) {
    super(props)
    this.state = {
      report: "select",
      fy: "",
      programs: ["All"],
      fundingOpps: ["All"],
      appType: "Full App",
      data: null,
      foList: [],
      programList: []
    }
  }

  componentDidMount() {
    // this.getFOList()
    // this.getProgramList()
  }

  handleSetState = (obj) => this.setState(obj)

  runReport = () => {
    const {props, state} = this
    if(state.report === "Compliance Run Before After Log") {
      this.runBALogReport()
    }
    else if(state.report === "Compliance Log") {
      this.runCompLogReport()
    }
    else {
      console.log("INVALID REPORT")
    }
  }
  runBALogReport = () => {
    const {props, state} = this
    const valid = ( state.fy !== "" &&
      !state.programs.includes("") &&
      !state.fundingOpps.includes("") )
    if(valid) {
      const reportObj = {
        fy: state.fy,
        ...(!state.programs.includes("All") && { programs: state.programs } ),
        ...(!state.fundingOpps.includes("All") && { fundingOpps: state.fundingOpps } ),
        appType: state.appType
      }
      runBeforeAfterReport(reportObj)
        .then((data) => {this.setState({data: data})})
    }
    else {
      window.alert("Please fill in all fields!")
    }

  }
  runCompLogReport = () => {
    const {props, state} = this
    const valid = ( state.fy !== "" &&
      !state.programs.includes("") &&
      !state.fundingOpps.includes("") )

    if(valid) {
      const reportObj = {
        fy: state.fy,
        ...(!state.programs.includes("All") && { programs: state.programs } ),
        ...(!state.fundingOpps.includes("All") && { fundingOpps: state.fundingOpps } ),
        appType: state.appType
      }
      runCompLogReport(reportObj)
        .then((data) => {this.setState({data: data})})
    }
    else {
      window.alert("Please fill in all fields!")
    }

  }

  downloadReport = () => {
    const {props, state} = this
    if(state.report === "Compliance Run Before After Log") {downloadBeforeAfterReport()}
    else if(state.report === "Compliance Log") {downloadCompLogReport()}
  }

  setYear = (fiscalYear) => {
    this.setState({fy: fiscalYear})
    this.getFOList(fiscalYear)
    this.getProgramList(fiscalYear)
  }

  getFOList = (fiscalYear) => {
    getFundingOpportunities(fiscalYear)
      .then((data) => {
        this.setState({foList: formOptions(data, "fundingOpp", true)})
      })
  }

  getProgramList = (fiscalYear) => {
    getPrograms(fiscalYear).then((data) => {
      this.setState({programList: formOptions(data, "program", true)})
    })
  }

  render(props, state) {
    return(
      <div>
        <h2>Report Viewer</h2>
        <div class={style.exportContainer}>
        <div>Please choose a report from the below dropdown to start</div>
        <br />
          {state.data && <Button
            class={style.exportBtn}
            outlined
            color={'#2196f3'}
            onClick={this.downloadReport}
          >Export to Excel</Button>}
        </div>
        <ActionBar
          setYear={this.setYear}
          setState={this.handleSetState}
          runReport={this.runReport}
          report={state.report}
          {...state}
        />
        {state.report === "Compliance Run Before After Log" && state.data &&
          <BeforeAfterTable
            data={state.data}
            colFn={[((arr) => arr.length)]}
          />
        }
        {state.report === "Compliance Log" && state.data &&
          <CompLogTable data={state.data} />
        }
      </div>
    )
  }
}
