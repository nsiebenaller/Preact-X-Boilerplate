import { h, Component } from 'preact'
import style from './style.css'
import { TextField, Button } from '@Shared'
import { RightPanel, LeftPanel } from './Panels/'
import {
  getFundingOpportunities,
  getOrganizations,
  findAppsByLogno,
  getAppInfo,
  getMechanisms
} from '@Api'
import { formOptions } from '@Helpers'

const defaultApp = {
  submissionType: '',
  fundingOpportunity: {
    id: -1,
    name: ''
  },
  mechanism: {
    id: -1,
    name: ''
  },
  program: {
    code: ''
  }
}

export default class AppActions extends Component {
  constructor(props) {
    super(props)

    this.state = {
      editing: null,
      logno: "",
      applications: [],
      selectedApp: defaultApp,
      fundingOpps: [],
      organizations: [],
      orgNames: [],
      opened: false,
      infoText: "",
      mechanisms: []
    }
  }

  componentDidMount() {
    this.getOrgs()
  }

  handleSetState = (obj) => this.setState(obj)

  findApplications = async () => {
    if(this.state.logno.length < 2) {
      window.alert("Log Number Search Term Too Short!")
    }
    else {
      this.setState({
        applications: [],
        selectedApp: defaultApp,
        infoText: "loading...",
        editing: null,
      })
      const apps = await findAppsByLogno(this.state.logno)
      if(apps.length === 0) {
        this.setState({infoText: "No Applications Found."})
      }
      else {
        this.setState({applications: apps.reverse(), infoText: ""})
        this.getApplicationInfo(apps[apps.length-1].appPkgId)
      }
    }
  }

  getMechanisms = async (foID, subType) => {
    const { props, state } = this
    const data = await getMechanisms(foID, subType)
    this.setState({ mechanisms: data })
  }

  getApplicationInfo = async (id) => {
    this.setState({ editing: null })
    const data = await getAppInfo(id)
    this.setState({ selectedApp: data })
    this.getFundingOpps(data.fy)
    this.getMechanisms(data.fundingOpportunity.id, null)
  }

  updateApplication = (appObj) => {
    const newObj = Object.assign({}, this.state.selectedApp, appObj)
    this.setState({selectedApp: newObj})
  }

  getFundingOpps = async (fiscalYear) => {
    const data = await getFundingOpportunities(parseInt(fiscalYear))
    this.setState({
      fundingOpps: data.map((fundOpp) => {return({...fundOpp, label: fundOpp.fundingOpp, value: fundOpp.fundingOpp})})
    })
  }

  getOrgs = async () => {
    const orgTypes = ["ORG_ACTIVE", "ORG_APPROVAL_PENDING"]
    const orgs = await getOrganizations(orgTypes)
    //console.log("ORGS:: ", orgs)
    this.setState({
      orgNames: orgs.map(x => x.orgname),
      organizations: orgs
    })
  }

  render(props, state) {
    return(
      <div>
        <div>Search for an application by Log # to perform application actions.</div>
        <div class={style.applicationActions}>
          <div>Log Number: </div>
          <TextField
            value={state.logno}
            onChange={(e) => this.setState({logno: e.replace(" ", "")})}
            onEnter={this.findApplications}
          />
          <Button
            onClick={this.findApplications}
          >Search</Button>
        </div>
        <div>{state.infoText}</div>
        <div class={!state.selectedApp.logNo ? style.hidden : style.panelContainer}>
          <LeftPanel
            applications={state.applications}
            selectedApp={state.selectedApp}
            getApplicationInfo={this.getApplicationInfo}
          />
          <RightPanel
            setState={this.handleSetState}
            editing={state.editing}
            selectedApp={state.selectedApp}
            fundingOpps={state.fundingOpps}
            organizations={state.organizations}
            orgNames={state.orgNames}
            mechanisms={state.mechanisms}
            getMechanisms={this.getMechanisms}
            user={props.user}
            applications={state.applications}
            getApplicationInfo={this.getApplicationInfo}
            findApplications={this.findApplications}
          />
        </div>
      </div>
    )
  }
}
