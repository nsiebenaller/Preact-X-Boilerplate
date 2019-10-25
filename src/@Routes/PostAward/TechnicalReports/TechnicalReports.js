import { h, Component } from 'preact'
import { GroupTable } from '@Shared'
import style from './TechnicalReports.less'
import * as API from '@Api'
import Table from './Table/Table.js'
import SearchBar from './SearchBar/index.js'
import FileUploader from './FileUploader.js'
import RevisedUploader from './RevisedUploader/RevisedUploader.js'

export default class TechnicalReports extends Component {
  constructor(props) {
    super(props)

    this.state = {
      filterFn: null,
      fileUploaderOpen: undefined,
      labels: [],
      allFileTags: {},
      isDoc: false,
      isRevisedOpen: false,
      selectedBundle: {}
    }
  }

  componentWillMount() {
    this.getTechReportLabels()
    this.getAllFileTags()
  }

  getTechReportLabels = async () => {
    const { props } = this
    const labels = await API.getTechReportLabels(props.user.id)
    this.setState({ labels: labels })
  }

  getAllFileTags = async () => {
    const resp = await API.getTechReportFileTypes()
    this.setState({ allFileTags: resp })
  }

  isFileUploaderOpen = () => {
    const { props, state } = this
    let isFileUploaderOpen = false
    if(!props.isLoading && props.submittedDocuments.length === 0) isFileUploaderOpen = true
    if(state.fileUploaderOpen) isFileUploaderOpen = true
    if(state.fileUploaderOpen === false) isFileUploaderOpen = false
    return isFileUploaderOpen
  }

  handleSetState = (obj) => this.setState(obj)

  closeRevisedUploader = () => this.setState({ isRevisedOpen: false, selectedBundle: {} });

  openRevisedUploader = (idx) => {
    document.getElementById("app").scrollTop = 0;
    this.setState({ selectedBundle: this.props.submittedDocuments.find(b => b.id === idx), isRevisedOpen: true, fileUploaderOpen: false });
  }

  render(props, state) {
    if(props.isLoading) {
      return(<div>Loading...</div>)
    }

    let data = []
    if(state.filterFn === null) data = props.submittedDocuments
    else if(state.isDoc) {
      data = props.submittedDocuments.map(bundle => ({ ...bundle, documents: bundle.documents.filter(state.filterFn) }))
    }
    else {
      data = props.submittedDocuments.filter(state.filterFn)
    }

    return(
      <div class={style['parent']}>
        {
          !state.isRevisedOpen &&
          <FileUploader
            fileUploaderOpen={this.isFileUploaderOpen()}
            setState={this.handleSetState}
            labels={state.labels}
            allFileTags={state.allFileTags}
            user={props.user}
            getSubmittedDocuments={props.getSubmittedDocuments}
            submittedDocuments={props.submittedDocuments}
            getTechReportLabels={this.getTechReportLabels}
          />
        }
        <RevisedUploader
          open={state.isRevisedOpen}
          onClose={this.closeRevisedUploader}
          allFileTags={state.allFileTags}
          bundle={state.selectedBundle}
          getSubmittedDocuments={props.getSubmittedDocuments}
        />
        {
          (props.isLoading) &&
          (<div>Loading Documents...</div>)
        }
        {
          (props.submittedDocuments.length === 0 && !props.isLoading) &&
          (
            <div className={style['no-doc-text']}>
              <div><b>Submitted Documents</b></div>
              <div>You have not Submitted any documents yet. Once you submit, your submitted documents will appear in this section</div>
            </div>
          )
        }
        {
          (props.submittedDocuments.length > 0 && !props.isLoading) &&
          (
            <div class={style['body']}>
            <SearchBar
              setState={this.handleSetState}
              labels={state.labels}
              allFileTags={state.allFileTags}
            />

              <div class={style['document-table']}>
                <Table
                  getSubmittedDocuments={props.getSubmittedDocuments}
                  getTechReportLabels={this.getTechReportLabels}
                  submittedDocuments={data}
                  labels={state.labels}
                  openRevisedUploader={this.openRevisedUploader}
                  selectedBundleID={state.selectedBundle.id ? state.selectedBundle.id : -1}
                />
              </div>
            </div>
          )
        }
      </div>
    )
  }
}
