import { h, Component } from 'preact'
import style from '../style.css'
import {
  Button,
  Icon,
  Dropdown,
  AutoComplete,
} from '@Shared'
import {
  updateApplication,
  uploadSingleFile,
  deleteApp,
  getLovList,
  findAppsByLogno,
} from '@Api'
import { formOptions, getUnique } from '@Helpers/index.js'
import {
  TopForm,
  BottomForm,
  FileUploadForm
} from '../FormParts/'

function getOrg(orgName, organizations) {
  if(organizations.find(x => x.orgname === orgName)) {
    return organizations.find(x => x.orgname === orgName)
  }
  return {id: null}
}

function getDocTypeCrit(attachment, docTypeCrits) {
  return docTypeCrits.find(x => x.name === attachment)
}

export default class RightPanel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      topStatus: false,
      botStatus: false,
      fileUploadStatus: false,
      topForm: {
        fo: '',
        foID: -1,
        subType: '',
        mech: '',
        mechID: -1,
        program: '',
        saving: false
      },
      botForm: {
        preAppStatus: '',
        preAppStatusID: -1,
        fullAppStatus: '',
        fullAppStatusID: -1,
        perfOrg: '',
        perfOrgID: -1,
        contractOrg: '',
        contractOrgID: -1,
        fullAppOrg: '',
        fullAppOrgID: -1,
        saving: false
      },
      appType: "select",
      appComp: "select",
      subGroup: "select",
      attachment: "select",
      hasSubgroups: false,
      file: "",
      fileData: null,
      deleteAppType: null,
      preAppStatuses: [],
      fullAppStatuses: [],
      isFileValid: false
    }
  }

  async componentDidMount() {
    const preApp = getLovList('PRE_APPLICATION_STATUS')
    const fullApp = getLovList('FULL_APPLICATION_STATUS')
    const values = await Promise.all([preApp, fullApp])
    this.setState({
      preAppStatuses: values[0].map(x => { return({ ...x, value: x.sysCode, label: x.sysCode }) }),
      fullAppStatuses: values[1].map(x => { return({ ...x, value: x.sysCode, label: x.sysCode }) })
    })
  }

  _handleFundingOppChange = (e) => {
    const { state, props } = this

    const fo = props.fundingOpps.find(x => x.fundingOpp === e)
    if(fo) {
      props.getMechanisms(fo.id, null)
      this.setState({
        topForm: {
          ...state.topForm,
          fo: fo.fundingOpp,
          foID: fo.id,
          program: fo.program,
          subType: 'Select a Submission Type',
          mech: 'Select a Mechanism',
          mechID: -1
        }
      })
    }
    else {
      this.setState({
        topForm: {
          ...state.topForm,
          fo: e,
          foID: -1,
          subType: 'Invalid Funding Opportunity',
          mech: 'Invalid Funding Opportunity',
          mechID: -1
        }
      })
    }
  }

  _handleSubTypeChange = (e) => {
    const { state, props } = this
    this.setState({
      topForm: {
        ...state.topForm,
        subType: e.value,
        mech: 'Select a Mechanism',
        mechID: -1
      }
    })
  }

  _handleMechChange = (e) => {
    const { state } = this
    this.setState({
      topForm: {
        ...state.topForm,
        mech: e.mechanism,
        mechID: e.id
      }
    })
  }

  _handleEditTopForm = (open = true) => {
    const { props, state } = this
    if(open) {
      this.setState({
        topForm: {
          fo: props.selectedApp.fundingOpportunity.name,
          foID: props.selectedApp.fundingOpportunity.id,
          subType: props.selectedApp.submissionType,
          mech: props.selectedApp.mechanism.name,
          mechID: props.selectedApp.mechanism.id,
          program: props.selectedApp.program.code
        }
      })
      props.setState({ editing: "top" })
    }
    else {
      this.setState({
        topForm: {
          fo: '',
          foID: -1,
          subType: '',
          mech: '',
          mechID: -1,
          program: '',
          saving: false
        }
      })
      props.setState({ editing: null })
    }
  }

  _handlePreAppStatusChange = (e) => {
    const { props, state } = this

    this.setState({
      botForm: {
        ...state.botForm,
        preAppStatus: e.sysCode,
        preAppStatusID: e.id,
      }
    })
  }

  _handleFullAppStatusChange = (e) => {
    const { props, state } = this

    this.setState({
      botForm: {
        ...state.botForm,
        fullAppStatus: e.sysCode,
        fullAppStatusID: e.id,
      }
    })
  }

  _handleOrgChange = (e, orgType) => {
    const { props, state } = this
    const org = props.organizations.find(x => x.orgname === e)
    this.setState({
      botForm: {
        ...state.botForm,
        [orgType]: e,
        [orgType+'ID']: org ? org.id : -1
      }
    })
  }

  _handleEditBotForm = (open = true) => {
    const { props, state } = this

    const preAppStatus = state.preAppStatuses.find(x => x.sysCode === props.selectedApp.preAppStatusCode)
    const fullAppStatus = state.fullAppStatuses.find(x => x.sysCode === props.selectedApp.fullAppStatusCode)
    const performingOrg = props.selectedApp.organizations.find(x => x.appInfoOrgType === 'PERFORMING_ORG')
    const contractingOrg = props.selectedApp.organizations.find(x => x.appInfoOrgType === 'CONTRACTING_ORG')
    const fullAppOrg = props.selectedApp.organizations.find(x => x.appInfoOrgType === 'FULLAPP_ORG')

    if(open) {
      this.setState({
        botForm: {
          preAppStatus: props.selectedApp.preAppStatusCode,
          preAppStatusID: preAppStatus ? preAppStatus.id : -1,
          fullAppStatus: props.selectedApp.fullAppStatusCode,
          fullAppStatusID: fullAppStatus ? fullAppStatus.id : -1,
          perfOrg: performingOrg ? performingOrg.name : '',
          perfOrgID: performingOrg ? performingOrg.id : -1,
          contractOrg: contractingOrg ? contractingOrg.name : '',
          contractOrgID: contractingOrg ? contractingOrg.id : -1,
          fullAppOrg: fullAppOrg ? fullAppOrg.name : '',
          fullAppOrgID: fullAppOrg ? fullAppOrg.id : -1,
          saving: false
        }
      })
      props.setState({ editing: 'bot' })
    }
    else {
      this.setState({
        botForm: {
          preAppStatus: '',
          preAppStatusID: -1,
          fullAppStatus: '',
          fullAppStatusID: -1,
          perfOrg: '',
          perfOrgID: -1,
          contractOrg: '',
          contractOrgID: -1,
          fullAppOrg: '',
          fullAppOrgID: -1,
          saving: false
        }
      })
      props.setState({ editing: null })
    }

  }

  handleUpload = async () => {
    const { props, state } = this

    const isValid = this.validateUpload()
    if(!isValid) {
      window.alert("Please Fill in All Fields!")
      return
    }

    const docTypeCrit = getDocTypeCrit(
      state.attachment,
      state.appType === "Full App" ? props.selectedApp.fullAppFileTypes : props.selectedApp.preAppFileTypes
    )

    const request = {
      appPkgId: props.selectedApp.appPkgId,
      relatedToId: '',
      relatedToTypeSysCode: '',
      fileTypeId: '',
      documentTypeCritId: docTypeCrit.id,
      file: state.fileData,
      uploadedBy: props.user,
      fileDescription: ''
    }
    console.log(request)

    const resp = await uploadSingleFile(request)
    if(!resp.success) {
      window.alert("Error Uploading File!")
      return
    }
    console.log("Success!")
    this.setState({
      appType: "select",
      appComp: "select",
      subGroup: "select",
      attachment: "select",
      hasSubgroups: false,
      file: "",
      fileDate: null,
      fileUploadStatus: true
    })
  }

  validateUpload = () => {
    const { state } = this

    const preAppValid = (state.appType !== "Pre App") || (state.appType === "Pre App" && state.attachment !== "select")
    const fullAppValid = (state.appType !== "Full App") || (state.appType === "Full App" && state.attachment !== "select" && state.appComp !== "select")
    const subGroupValid = (state.appType !== "Full App") || (state.appType === "Full App" && !state.hasSubgroups) || (state.appType === "Full App" && state.hasSubgroups && state.subGroup !== "select")
    const fileValid = (state.fileData !== null)

    return (preAppValid && fullAppValid && subGroupValid && fileValid)
  }

  handleSave = async (statusType) => {
    const { props, state } = this
    const isBotForm = statusType === 'botStatus'
    let request = {}
    const formType = isBotForm ? 'botForm' : 'topForm'

    if(statusType === 'botStatus') {
      request = {
        appPkgID: props.selectedApp.appPkgId,
        foID: null,
        submissionType: props.selectedApp.submissionType,
        mechID: null,
        preStatus: state.botForm.preAppStatusID,
        fullStatus: state.botForm.fullAppStatusID,
        preAppPerformingOrg: state.botForm.perfOrgID,
        preAppContractingOrg: state.botForm.contractOrgID,
        fullAppOrg: state.botForm.fullAppOrgID,
      }
    }
    else {
      request = {
        appPkgID: props.selectedApp.appPkgId,
        foID: state.topForm.foID,
        submissionType: state.topForm.subType,
        mechID: state.topForm.mechID,
        preStatus: null,
        fullStatus: null,
        preAppPerformingOrg: null,
        preAppContractingOrg: null,
        fullAppOrg: null
      }
    }

    console.log("SENDING REQUEST...", request)
    this.setState({ [formType]: { ...state[formType], saving: true } })
    const resp = await updateApplication(request)
    this.setState({ [formType]: { ...state[formType], saving: false } })
    console.log("RECIEVED...", resp)

    if(resp.success) {
      this.setState({ [statusType]: true })
      props.getApplicationInfo(props.selectedApp.appPkgId)
      props.setState({
        editing: null,
        applications: props.applications.map(x => {
          if(x.appPkgId === props.selectedApp.appPkgId) {
            return { ...x, logNo: props.selectedApp.logNo }
          }
          return x
        })
      })
    }
    else {
      window.alert("Error Saving Application")
    }
  }

  handleDelete = () => {
    const appID = this.props.selectedApp.id
    const appType = this.state.deleteAppType
    const {logno} = this.props.selectedApp
    if(!appID) {
      window.alert("Please Select an Application")
      return
    }
    const valid = ["fullapp", "preapp"].includes(appType)
    if(valid) {
      if(window.confirm(`Are you sure you want to delete ${logno}?`)) {
        deleteApp(appID, appType)
          .then((resp) => {
            if(!resp.success) window.alert("Error Deleting App")
            else {
              console.log("success!")
              this.setState({
                deleteAppType: "",
              })
            }
          })
      }
    }
    else {
      window.alert("Please Select App Type!")
    }
  }

  handleSetState = (obj) => {
    this.setState(obj)
    this.setState({
      isFileValid: this.validateUpload()
    })
  }

  render(props, state) {
    return(
      <div style={{ marginBottom: "450px" }}>
        <h2 style={{marginTop: "0"}}>Update Application</h2>
        <TopForm
          isEditing={props.editing === "top"}
          setState={this.handleSetState}
          topForm={state.topForm}
          selectedApp={props.selectedApp}
          handleFundingOppChange={this._handleFundingOppChange}
          handleSubTypeChange={this._handleSubTypeChange}
          handleMechChange={this._handleMechChange}
          handleEdit={this._handleEditTopForm}
          handleSave={this.handleSave}
          mechanisms={props.mechanisms}
          fundingOpps={props.fundingOpps}
          topStatus={props.topStatus}
        />
        <hr />
        <br />
        <BottomForm
          isEditing={props.editing === "bot"}
          setState={this.handleSetState}
          botForm={state.botForm}
          selectedApp={props.selectedApp}
          handleEdit={this._handleEditBotForm}
          handlePreAppStatusChange={this._handlePreAppStatusChange}
          handleFullAppStatusChange={this._handleFullAppStatusChange}
          handleOrgChange={this._handleOrgChange}
          handleSave={this.handleSave}
          orgNames={props.orgNames}
          organizations={props.organizations}
          preAppStatuses={state.preAppStatuses}
          fullAppStatuses={state.fullAppStatuses}
          botStatus={state.botStatus}
        />
        <hr />
        <FileUploadForm
          setState={this.handleSetState}
          selectedApp={props.selectedApp}
          handleUpload={this.handleUpload}
          file={state.file}
          fileData={state.fileData}
          appType={state.appType}
          appComp={state.appComp}
          attachment={state.attachment}
          subGroup={state.subGroup}
          hasSubgroups={state.hasSubgroups}
          isValid={state.isFileValid}
          fileUploadStatus={state.fileUploadStatus}
        />
        <hr />
      </div>
    )
  }
}
