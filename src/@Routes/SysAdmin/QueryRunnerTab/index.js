import { h, Component } from 'preact'
import { ItemContainer } from './style.js'
import {doQueryRunner} from '@Api'
import {downloadFile} from '@Helpers'
import ReportItem from './reportItem.js'


const reports = [
  {
    "reportLabel": "Full App Counts",
    "reportName": "FullApp-counts",
    "paramPrompt": "Funding Opportunities",
    "paramNote": "(comma seperated)",
    "paramValue": "FONs",
    "numbersOnly": false
  },
  {
    "reportLabel": "Full App Expedited",
    "reportName": "fullAppExpedited",
    "paramPrompt": "Funding Opportunities",
    "paramNote": "(comma seperated)",
    "paramValue": "FONs",
    "numbersOnly": false
  },
  {
    "reportLabel": "Full App Log Numbers",
    "reportName": "FullApp-logNos",
    "paramPrompt": "Funding Opportunities",
    "paramNote": "(comma seperated)",
    "paramValue": "FONs",
    "numbersOnly": false
  },
  {
    "reportLabel": "Full App Verify No Dupes",
    "reportName": "FullApp-verifyNoDupes",
    "paramPrompt": "Funding Opportunities",
    "paramNote": "(comma seperated)",
    "paramValue": "FONs",
    "numbersOnly": false
  },
  {
    "reportLabel": "Upcoming Deadlines",
    "reportName": "pendingDeadlinesFromNow",
    "paramPrompt": "Due within how many days from now?",
    "paramNote": "(numbers only)",
    "paramValue": "nbrOfDaysFromNow",
    "numbersOnly": true
  },
  {
    "reportLabel": "Pre App Counts",
    "reportName": "Pre-app-counts",
    "paramPrompt": "Funding Opportunities",
    "paramNote": "(comma seperated)",
    "paramValue": "FONs",
    "numbersOnly": false
  },
  {
    "reportLabel": "Pre App Log Numbers",
    "reportName": "Pre-app-logNos",
    "paramPrompt": "Funding Opportunities",
    "paramNote": "(comma seperated)",
    "paramValue": "FONs",
    "numbersOnly": false
  }
]

export default class QueryRunner extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount() {
  }

  runReport = async (report) => {
    const value = document.getElementById(report.reportName).value
    const request = {
      "reportName": report.reportName,
      "paramValues": {
        [report.paramValue]: value
      }
    }
    const resp = await doQueryRunner(request)
    downloadFile(resp.data, report.reportLabel+".xls")
  }

  render(props, state) {
    return(
      <div>
        <h2>Reports - (Query Runner)</h2>
        <ItemContainer>
        {
          reports.map((report) =>
            <ReportItem report={report} runReport={this.runReport} />
          )
        }
        </ItemContainer>
      </div>
    )
  }
}
