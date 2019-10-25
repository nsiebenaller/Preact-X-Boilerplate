import { h, Component } from 'preact';
import { Modal, Button } from '@Shared';

import styles from './SelectedApp.less';
import FileUploader from './AppActions/FileUploader.js';
import FileTable from './AppActions/FileTable.js';
import AppHeader from './AppHeader.js';
import {
  uploadSingleFile,
  deleteAppFile,
  getFiles,
  validate425File,
} from '@Api'


export default class SingleApp extends Component {
  constructor(props) {
    super(props)

    this.state = {
      fileList: [],
      type: 'Federal Financial Report (SF-425)',
      description: '',
      file: "",
      fileData: null,
      status: "",
      statusColor: "red",
      isModalOpen: false,
      modalTitle: "",
      modalContents: "",
      fileID: null,
      sf425ID: -1,
      canUpload: false,
    }
  }

  componentDidMount() {
    this.getFiles()
  }

  setVar = (obj) => this.setState(obj)

  getFiles = async () => {
    const { props } = this

    // Get SF-425 File Type ID
    const sf425 = props.orgFileTypes.find(lov => lov.sysCode === 'SF425')
    this.setState({ sf425ID: sf425.id })

    // Get SF-425 for Application
    const request = {
      requestedFiles: [
        {
          relatedToTypeSysCode: null,
          relatedToId: null,
          appPkgId: props.app.appPkgId,
          fileTypeIds: [sf425.id]
        }
      ]
    }
    const response = await getFiles(request)
    this.setState({ fileList: response.fileDtos })
  }

  uploadFile = () => {
    const {
      type,
      description,
      fileData,
      file,
      sf425ID
    } = this.state
    const typePass = type !== 'select file type'
    const descPass = description !== ""
    const filePass = fileData !== null
    if(typePass && descPass && filePass) {
      this.handleUpload()
    }
    else {
      this.setState({status: "You must fill in all of the fields.", statusColor: "red"})
      console.log("ERR", typePass, descPass, filePass)
    }
  }

  handleUpload = async () => {
    const {
      type,
      description,
      fileData
    } = this.state
    const { logNo } = this.props.app

    try {
      const resp = await validate425File(logNo, fileData)
      if(!resp.valid) {
        const validationMessage = this.getValidationMessage(resp.status);
        this.setState({
          modalTitle: validationMessage.title,
          modalContents: validationMessage.content,
          isModalOpen: true,
          fileID: resp.fileID,
          canUpload: resp.status === "noPostAward"
        })
      }
      else this.uploadSF425()
    }
    catch(e) {
      console.log("ERR", e)
      const validationMessage = this.getValidationMessage("formNoAward");
      this.setState({
        modalTitle: validationMessage.title,
        modalContents: validationMessage.content,
        isModalOpen: true,
        fileID: resp.fileID,
        canUpload: resp.status === "noPostAward"
      })
      //this.uploadSF425()
    }
  }

  getValidationMessage = (status) => {
    const { awardNbr } = this.props.appInfo

    if(status.includes("noMatch")) {
      const formAwardNumber = status.replace("noMatch", "")
      return {
        title: 'Award Number Does Not Match',
        content: `The award number, ${formAwardNumber}, on the SF 425 form that you are uploading does not match the award number found on this application, ${awardNbr}. There is a chance that you might be uploading this file to the wrong application.`
      }
    }
    else if(status === "formNoAward") {
      return {
        title: 'Award Number Not Found on SF 425 Form',
        content: `We could not find an award number on the SF 425 form that you are attempting to upload. The award number associated with this application is ${awardNbr}.`
      }
    }
    else if(status === 'appNoAward') {
      return {
        title: 'Award Number Not Found on Application',
        content: 'The application to which you are attempting upload SF 425 does not currently have an award number associated with it. There is a chance that you might be uploading this file to the wrong application.'
      }
    }
    else if(status === 'bothNoAward') {
      return {
        title: 'Award Number Not Found',
        content: 'We could not find an award number on the SF 425 form that you are attempting to upload and the selected application currently has no assigned award number. There is a chance that you might be uploading this file to the wrong application.'
      }
    }
    else if(status === "noPostAward") {
      return {
        title: 'No Post Award',
        content: 'We could not find a post award application associated with this log number. Make sure that this application has a post award associated with it.'
      }
    }
    else {
      return {
        title: 'Error Validating File',
        content: `Error code: ${status}`
      }
    }
  }

  uploadSF425 = async () => {
    const { props, state } = this
    const request = {
      appPkgId: props.app.appPkgId,
      relatedToId: null,
      relatedToTypeSysCode: null,
      fileTypeId: state.sf425ID,
      documentTypeCritId: null,
      file: state.fileData,
      uploadedBy: props.user.userName,
      fileDescription: state.description
    }

    this.setState({ isModalOpen: false })

    // Do file upload
    try {
      const resp = await uploadSingleFile(request)

      if(resp.success) {
        this.setState({
          status: "Success!",
          statusColor: "green",
          type: "Federal Financial Report (SF-425)",
          description: "",
          file: "",
          fileData: null
        })
        document.getElementById("upload").value = ''
        this.getFiles()
      }
      else {
        console.log("ERR", resp)
        this.setState({status: "Error uploading file.", statusColor: "red"})
        document.getElementById("upload").value = ''
      }
    }
    catch(e) {
      console.log("ERR", e)
      this.setState({status: "Error uploading file.", statusColor: "red"})
      document.getElementById("upload").value = ''
    }
  }

  deleteFile = async (fileID) => {
    const { fileList } = this.state
    const resp = await deleteAppFile(fileID)
    if(resp.success) {
      this.setState({ fileList: fileList.filter(f => f.id !== fileID) })
    }
    else {
      console.log("ERR!", resp)
    }
  }

  hideModal = () => this.setState({ isModalOpen: false });

  render({ app, ...props }, state) {
    const isValid = (state.type !== 'select file type' && state.description !== "" && state.fileData !== null)

    return(
      <div class={styles['container']}>
        <Modal
          title={state.modalTitle}
          content={state.modalContents}
          actionPrompt={state.canUpload ? 'You cannot upload this file.' : `Are you sure you would like to continue uploading this file?`}
          confirmText={'Upload File'}
          open={state.isModalOpen}
          onClose={this.hideModal}
          onConfirm={this.uploadSF425}
          actions={state.canUpload && <Button className={styles['cancel-btn']} onClick={this.hideModal}>Cancel</Button>}
        />
        <AppHeader
          toggleShowApp={props.toggleShowApp}
          app={app}
          appInfo={props.appInfo}
        />
        <div class={styles['action-row']}>
          <FileUploader
            orgFileTypes={props.orgFileTypes}
            type={state.type}
            description={state.description}
            file={state.file}
            status={state.status}
            statusColor={state.statusColor}
            setState={this.setVar}
            uploadFile={this.uploadFile}
            isValid={isValid}
            hasPostAward={app.hasPostAward}
          />
          <FileTable
            fileList={state.fileList}
            deleteFile={this.deleteFile}
          />
        </div>
      </div>
    )
  }
}
