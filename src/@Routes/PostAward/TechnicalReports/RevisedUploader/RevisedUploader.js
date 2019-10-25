import { h, Component } from 'preact';
import style from './RevisedUploader.less';
import { Cancel } from '@Icons';
import * as API from '@Api';
import { SectionSeperator } from '../style.js';
import RevisedModal from './RevisedModal.js';
import FirstSection from './FirstSection/FirstSection.js';
import SecondSection from './SecondSection/SecondSection.js';
import ThirdSection from './ThirdSection/ThirdSection.js';
import RevisedProgress from '../RevisedProgress/RevisedProgress.js';

export default class RevisedUploader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      isUploading: false,
      revisedIDs: [],
      revisedOpen: false,
      showUpload: false,
      uploadProgress: 0,
      uploadError: null,
      uploadLabel: '',
      uploadText: ''
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.open === true && this.props.open === false) {
      this.setState({
        files: [],
        isUploading: false,
        revisedIDs: [],
        revisedOpen: false,
        showUpload: false,
        uploadProgress: 0,
        uploadError: null,
        uploadLabel: '',
        uploadText: ''
      })
    }
  }

  addFile = (e) => {
    const { state } = this;

    const ele = document.getElementById("file-upload-label");
    const files = Array.from(e.target.files || e.dataTransfer.files);

    // Validation
    if((files.length + state.files.length) > 6) {
      window.alert("Too Many Files (Maximum 6 Files)");
      ele.classList.remove("file-upload-hover");
      return;
    }

    const mb90 = 9e+7;
    const iFiles = files.filter((file) => file.size <= mb90);
    if(iFiles.length > files.length) {
      window.alert("One or more files are over the size limit (90MB)");
    }

    // Setup files in state
    const fileList = [];
    for(let i = 0; i < iFiles.length; i++) {
      fileList.push({
        file: iFiles[i],
        tag: "Select File Type",
        revisedReason: null
      });
    }
    this.setState({ files: state.files.concat(fileList) });
    ele.classList.remove("file-upload-hover");
  }

  removeFile = (idx) => {
    const { state } = this;
    this.setState({
      files: state.files.filter((f, i) => i !== idx)
    });
  }

  setTag = (idx, tag) => {
    const { state } = this;
    this.setState({
      files: state.files.map((f, i) => (i === idx) ? ({ ...f, tag: tag }) : (f))
    });
  }

  getTags = () => {
    const { props } = this;
    if(props.bundle) {
      switch(props.bundle.type) {
        case 'Quarterly':
          return props.allFileTags['QUARTERLY'];
          break;
        case 'Monthly':
          return props.allFileTags['MONTHLY'];
          break;
        case 'Semi-Annual':
          return props.allFileTags['SEMI_ANNUAL'];
          break;
        case 'Annual':
          return props.allFileTags['ANNUAL'];
          break;
        case 'Addendum':
          return props.allFileTags['ADDENDUM'];
          break;
        default:
          return [];
          break;
      }
    }
    return [];
  }

  setRevision = (tag) => (revision) => {
    const { state } = this;
    this.setState({
      files: state.files.map((f, i) => (f.tag === tag) ? ({ ...f, revisedReason: revision }) : (f))
    });
  }

  onUpload = () => {
    const { props } = this;

    // Check if any new files already exist - show modal if there are dupes
    const dupeIDs = this.checkForDuplicates();
    if(dupeIDs.length > 0) this.setState({ revisedIDs: dupeIDs, revisedOpen: true, uploadLabel: 'Waiting to Upload Files...', uploadProgress: 0, uploadError: null, uploadText: '' });
    else this.startUploadLoop();
  }

  checkForDuplicates = () => {
    const { props, state } = this;
    const dupeIDs = [];
    props.bundle.documents.forEach((d) => {
      state.files.forEach((f, idx) => {
        if(d.type === f.tag) dupeIDs.push(idx);
      })
    })
    return dupeIDs;
  }

  startUploadLoop = async () => {
    const { state, props } = this;

    //Upload progress bar
    this.setState({ isUploading: true, showUpload: true, uploadLabel: this.getProgressLabel(0, true), uploadProgress: 0, uploadError: null, uploadText: '' });

    let uploadSuccess = true;
    for(let i = 0; i < state.files.length; i++) {
      const success = await this.uploadFile(state.files[i]);
      console.log(`Upload file '${state.files[i].file.name}' success?`, success)
      if(!success) {
        this.setState({ isUploading: false, uploadError: true, uploadLabel: 'Error uploading file.', uploadText: 'Error' });
        uploadSuccess = false;
        break;
      }
      const uploadProgress = (((i+1) / state.files.length) * 100)
      const progressLabel = this.getProgressLabel(uploadProgress, true);
      this.setState({ uploadProgress: uploadProgress, uploadLabel: progressLabel })
    }
    if(uploadSuccess) {
      setTimeout(() => { this.setState({ files: [], isUploading: false, revisedIDs: [], revisedOpen: false, uploadText: 'File(s) Submitted Successfully!!!' }) }, 500)
    }
    setTimeout(() => { this.setState({ isUploading: false, showUpload: false, uploadLabel: '', uploadProgress: 0, uploadError: null, uploadText: '' }) }, 7000)
    props.getSubmittedDocuments();
    props.onClose();
  }

  uploadFile = async (file) => {
    const { props, state } = this;
    const limitedDistribution = props.bundle.documents.length > 0 ?
      (props.bundle.documents.find(d => d.type.includes("Report")).limitedDistribution) : (false);
    const tag = this.getTags().find(t => t.name === file.tag);
    const revisedReason = file.revisedReason !== null ?
      (file.revisedReason === "Revised" ? "REVISION" : "ADMIN_CORRECTION") : (null);
    const request = {
      bundleId: props.bundle.id,
      file: file.file,
      type: tag.id,
      revisedReason: revisedReason,
      limitedDistribution: limitedDistribution
    }
    try {
      const resp = await API.uploadTechnicalReportFile(request);
      if(resp.success) return true;
      else return false;
    }
    catch(e) {
      console.log("ERR", e);
      return false;
    }
  }

  onCancel = () => this.setState({
    files: [],
    isUploading: false,
    revisedIDs: [],
    revisedOpen: false,
    showUpload: false,
    uploadProgress: 0,
    uploadError: null
  });

  closeRevisionModal = () => this.setState({ revisedOpen: false, revisedIDs: [], isUploading: false });

  getProgressLabel = (uploadProgress, isUploading) => {
    const { state } = this;
    if(!isUploading) return `Waiting to Upload Files...`;
    if(state.uploadError) return "Error uploading File.";
    const total = state.files.length;
    const curr = total * (uploadProgress / 100);
    return `${curr} of ${total} files completed`;
  }

  render(props, state) {
    return(
      <div>
        {
          (props.open && !!props.bundle) &&
          <div className={style['parent']}>
            <RevisedModal
              open={state.revisedOpen}
              onClose={this.closeRevisionModal}
              setRevision={this.setRevision}
              fileList={state.files.filter((f, i) => state.revisedIDs.includes(i))}
              startUploadLoop={this.startUploadLoop}
            />
            <div className={style['header']}>
              <b>Submit Documents</b>
              <div>To download report template, please visit MRDC website: <a target="_blank" href=" https://mrdc.amedd.army.mil/index.cfm/resources/researcher_resources/reporting/technical"> https://mrdc.amedd.army.mil/index.cfm/resources/researcher_resources/reporting/technical</a></div>
              <Cancel class={style['close-icon']} onClick={props.onClose} />
            </div>
            <div className="flex-row">
              <FirstSection
                bundle={props.bundle}
              />
              <SectionSeperator display />
              <SecondSection
                addFile={this.addFile}
              />
              <SectionSeperator display />
              {
                state.files.length === 0 &&
                <div className={style['closed-section']}><div>Tag Each File</div></div>
              }
              {
                state.files.length !== 0 &&
                <ThirdSection
                  files={state.files}
                  removeFile={this.removeFile}
                  setTag={this.setTag}
                  tags={this.getTags()}
                  onUpload={this.onUpload}
                  onCancel={this.onCancel}
                  isUploading={state.isUploading}
                />
              }
            </div>
          </div>
        }
        { state.showUpload && <RevisedProgress progress={state.uploadProgress} label={state.uploadLabel} error={state.uploadError} text={state.uploadText} /> }
      </div>
    )
  }

}
