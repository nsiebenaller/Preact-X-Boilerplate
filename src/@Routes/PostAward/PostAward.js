import { h, Component } from 'preact'
import style from './PostAward.less';
import { Tabs } from '@Shared'
import * as Api from '@Api'
import Header from './Header/Header.js'
import TechnicalReports from './TechnicalReports/TechnicalReports.js'
import { tabs } from '@Static/PostAward/tabs.json'
import { helpdeskTabs } from '@Static/PostAward/helpdeskTabs.json'

export default class PostAward extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedApp: {},
      submittedDocuments: [],
      principalInvestigator: {},
      businessOfficial: {},
      alternateSubmitter: {},
      isLoading: false,
      isEditing: undefined,
      isSaving: false,
      newEmail: '',
      user: null
    }
  }

  async componentWillMount() {
    this.fetchUser();
    this.getSubmittedDocuments(true);
  }

  fetchUser = async () => {
    const { user } = this.props;
    const request = {
      active: null,
      email: "",
      firstname: "",
      lastname: "",
      locked: null,
      roles: null,
      username: user.userName
    }

    try {

      const userFound = await Api.findUsers(request);
      if(userFound.length === 0){
        window.alert("Error fetching user.");
        return;
      }

      this.setState({ user: userFound[0] });
    } catch (e) {
      window.alert("Error fetching user.")
    }
  }

  getSubmittedDocuments = async (doLoading = false) => {
    if(doLoading) this.setState({ isLoading: true })

    const appPkgID = window.appPkgID
    const values = await Promise.all([Api.getSubmittedDocuments(appPkgID), Api.getAppInfo(appPkgID)])

    this.setState({
      submittedDocuments: values[0],
      isLoading: false,
      selectedApp: values[1],
      principalInvestigator: getPI(values[1]),
      businessOfficial: getBO(values[1]),
      alternateSubmitter: getAS(values[1])
    })

    if(doLoading) this.setState({ isLoading: false })
  }

  handleSetState = (obj) => this.setState(obj)

  downloadGuide = (e) => {
    e.preventDefault()
    Api.downloadOrgFile("Guide.pdf", window.eBRAP.guideID)
  }

  renderTab = () => {
    const { props, state } = this
    switch(props.selTab) {
      case "TechnicalReports.htm":
        return (
          <TechnicalReports
            {...props}
            {...state}
            getSubmittedDocuments={this.getSubmittedDocuments}
          />)
        break
      default:
        break
    }
  }

  saveEmail = async () => {
    const { state } = this

    this.setState({ isSaving: true });

    let contactType;
    switch(state.isEditing) {
      case 'principalInvestigator':
        contactType = 'POSTAWARD_PI';
        break;
      case 'businessOfficial':
        contactType = 'POSTAWARD_BO';
        break;
      case 'alternateSubmitter':
        contactType = 'POSTAWARD_ALTPI';
        break;
      default:
        break;
    }

    try {
      const req = {
        appPkgId: parseInt(window.appPkgID),
        contactType: contactType,
        email: state.newEmail
      }

      const resp = await Api.updateContactEmail(req)

      this.setState({ isSaving: false, newEmail: '', isEditing: false })
      if(resp.data.success) {
        this.getSubmittedDocuments()
        window.alert("Email Updated!")
      }
      else {
        console.log(resp.data)
        window.alert("Error Saving Email")
      }
    }
    catch(e) {
      window.alert("Error Saving Email", e)
      this.setState({ isSaving: false })
    }
  }

  getTabs = () => {
    const url = this.props.router.location.pathname;
    return (url.includes('Helpdesk')) ?
     (helpdeskTabs) : (tabs);
  }

  render(props, state) {
    if(!state.user) return null;

    return(
      <div class={style['parent']}>
        <h3>Award Management</h3>
        <a class={style['guide-link']} target="_blank" onClick={this.downloadGuide} href="/">Guide for Funded Investigators</a>

        <Header
          setState={this.handleSetState}
          principalInvestigator={state.principalInvestigator}
          businessOfficial={state.businessOfficial}
          alternateSubmitter={state.alternateSubmitter}
          logNumber={state.selectedApp.logNo}
          awardNumber={state.selectedApp.awardNbr}
          userID={props.user.id}
          isEditing={state.isEditing}
          isSaving={state.isSaving}
          newEmail={state.newEmail}
          onSave={this.saveEmail}
          user={state.user}
        />
        <Tabs options={this.getTabs()} selected={props.selTab} />

        {this.renderTab()}
      </div>
    )
  }
}

function getPI(app) {
  if(app.contacts) {
    let pi
    pi = app.contacts.find(x => x.appInfoContactType === 'POSTAWARD_PI')
    if(pi) return pi
  }
  return {id: -1, name: '', emailAddress: ''}
}

function getBO(app) {
  if(app.contacts) {
    let pi
    pi = app.contacts.find(x => x.appInfoContactType === 'POSTAWARD_BO')
    if(pi) return pi
  }
  return {id: -1, name: '', emailAddress: ''}
}

function getAS(app) {
  if(app.contacts) {
    let as
    as = app.contacts.find(x => x.appInfoContactType === 'POSTAWARD_ALTPI')
    if(as) return as
  }
  return {id: -1, name: '', emailAddress: ''}
}
