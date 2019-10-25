import { h, Component } from 'preact'
import { Route } from 'react-router-dom'
import style from './MyOrganization.less'
import Tabs from '@Shared/Tabs'
import OrgAppsList from './OrgAppsTab/OrgAppsList.js'
import SelectedApp from './OrgAppsTab/SelectedApp.js'
import * as Api from '@Api'
import {formOptions, getUniqueArray} from '@Helpers'

let activeRequests = 0;

export default class MyOrganization extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: false,
      app: {},
      appInfo: {},
      showApp: false,
      orgFileTypes: [],
      applications: [],
      orgOptions: [],
      programOptions: [],
      fyOptions: [],
      isLoadingApps: false
    }
  }

  componentDidMount() {
    this.fetchFileTypes()
    const startYear = new Date().getFullYear() + 4;
    this.fetchApplications(startYear)
    this.getOrgOptions()
  }

  fetchFileTypes = async () => {
    const data = await Api.getLovList('POST_AWARD_FILE_TYPE')
    this.setState({ orgFileTypes: data.filter(x => x.sysCode === 'SF425') })
  }
  fetchApplications = async (fy, limit = 1000, offset = 0) => {
    const { props } = this
    this.setState({ isLoadingApps: true })

    // Get relevant org IDs
    const orgIDs = this.getOrgIDsForUser()
    if(orgIDs.length === 0) {
      window.alert("No Organizations Found Associated With User")
      console.log(props.user)
      return
    }

    // Fetch apps for org
    try {
      activeRequests += 1;
      Api.getAppsByOrgIDs(orgIDs, fy, limit, offset)
        .then((resp) => {
          // Concat orgs & set state
          const { state } = this;
          const newApps = state.applications.concat(resp)
          const fyOptions = formOptions(newApps, "fy").reverse()
          fyOptions.unshift({ value: "All", label: "All" })
          this.setState({
            applications: getUniqueArray(newApps, 'appPkgId'),
            programOptions: formOptions(newApps, "programCode", true),
            fyOptions: fyOptions
          })
          activeRequests -= 1;
          if(activeRequests === 0) this.setState({ isLoadingApps: false })
        })
    }
    catch(e) {
      console.log("ERR", e)
      return
    }

    //Fetch more Apps if necessary
    if(fy !== 2000 && !Api.IS_DEV) this.fetchApplications(fy - 1, 1000, 0);
  }

  getOrgIDsForUser = () => {
    const { user } = this.props;

    function isValid(roles) {
      const sysCodes = roles.map(x => x.sysCode)
      if(sysCodes.includes('AOR')) return true
      if(sysCodes.includes('AA')) return true
      if(sysCodes.includes('BO')) return true
      return false
    };
    return user.orgs.filter(x => isValid(x.roles)).map(org => org.id);
  }

  getOrgOptions = () => {
    const { user } = this.props
    const orgOptions = [{id: -1, label: "All", value: "All"}].concat(user.orgs.map((org) => ({id: org.id, label: org.orgName, value: org.orgName})))
    this.setState({ orgOptions: orgOptions })
  }
  setApp = (app) => {
    this.getAppInfo(app.appPkgId)
    this.setState({app: app})
  }
  toggleShowApp = (show) => {
    if(show) return this.props.router.history.push('/eBRAP/org/MyOrgApplications/Application.htm')
    return this.props.router.history.push('/eBRAP/org/MyOrgApplications.htm')
  }
  getAppInfo = async (id) => {
    const resp = await Api.getAppInfo(id)
    this.setState({ appInfo: resp })
  }

  setLoading = () => this.setState({ loading: true })

  renderList = () => {
    const { props, state } = this;
    return(
      <OrgAppsList
        path="/eBRAP/org/MyOrgApplications.htm"
        user={props.user}
        setApp={this.setApp}
        toggleShowApp={this.toggleShowApp}
        applications={state.applications}
        orgOptions={state.orgOptions}
        programOptions={state.programOptions}
        fyOptions={state.fyOptions}
        isLoadingApps={state.isLoadingApps}
      />
    )
  }

  renderSingle = () => {
    const { props, state } = this;
    return(
      <SelectedApp
        path="/eBRAP/org/MyOrgApplications/Application.htm"
        user={props.user}
        app={state.app}
        appInfo={state.appInfo}
        toggleShowApp={this.toggleShowApp}
        orgFileTypes={state.orgFileTypes}
      />
    )
  }

  render(props, state) {

    if(state.isLoading) return(<div>Loading...</div>);

    const access = props.user.menus.find(m => m.label === "My Organization(s)");
    const subTabs = (access) ? (access.children) : ([]);

    return(
      <div class={style.myOrg}>
        <Tabs options={subTabs} selected={props.selTab} setLoading={this.setLoading} />
        <Route path="/eBRAP/org/MyOrgApplications.htm" render={this.renderList} />
        <Route path="/eBRAP/org/MyOrgApplications/Application.htm" render={this.renderSingle} />
      </div>
    )
  }
}
