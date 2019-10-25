import { h, Component } from 'preact'
import moment from 'moment'
import style from './FileUploader.less'
import {
  SectionSeperator,
  NewDocButton
} from './style.js'
import * as API from '@Api'
import { Clear } from '@Icons'
import { Button } from '@Shared'
import ModalManager from './ModalManager.js'
import FirstSection from './Sections/FirstSection.js'
import SecondSection from './Sections/secondSection.js'
import ThirdSection from './Sections/thirdSection.js'
import UploadProgress from './UploadProgress/'

function findTags(reportType, tagsMap) {
  if(!tagsMap['QUARTERLY']) return []

  switch(reportType) {
    case 'Quarterly':
      return tagsMap['QUARTERLY']
      break
    case 'Monthly':
      return tagsMap['MONTHLY']
      break
    case 'Semi-Annual':
      return tagsMap['SEMI_ANNUAL']
      break
    case 'Annual':
      return tagsMap['ANNUAL']
      break
    case 'Addendum':
      return tagsMap['ADDENDUM']
      break
    default:
      return []
      break
  }
}

export default class FileUploader extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selected: 0,
      reportType: "",
      reportTypes: ["Monthly", "Quarterly", "Semi-Annual", "Annual", "Addendum"],
      label: "",
      startDate: null,
      sdFocused: false,
      endDate: null,
      edFocused: false,
      limitedDistribution: "",
      finalReport: "",
      files: [],
      fileTags: [],
      modalOpen: false,
      validationType: [],
      existingReportChoice: [],
      existingReportTypes: [],
      uploadProgress: 0,
      isUploading: false,
      errorTexts: [],
      matchedBundle: false,
      helpModalOpen: false
    }
  }

  resetForm = () => {
    this.setState({
      selected: 0,
      reportType: "",
      reportTypes: ["Monthly", "Quarterly", "Semi-Annual", "Annual", "Addendum"],
      label: "",
      startDate: null,
      sdFocused: false,
      endDate: null,
      edFocused: false,
      limitedDistribution: "",
      finalReport: "",
    })
  }

  _formDocuments = () => {
    const { state } = this
    const documents = []
    state.files.forEach((file, i) => {
      const document = {
        id: null,
        name: file.name,
        type: state.fileTags[i],
        submittedOn: '',
        revisedReason: null,
        limitedDistribution: state.limitedDistribution === "Yes",
        fileAttributeId: null
      }
      documents.push(document)
    })
    return documents
  }

  handleSetState = (obj) => this.setState(obj)

  handleFirstSection = (obj) => {
    this.setState(obj, () => {
      const { state } = this
      this.setState({
        errorTexts: this.validateDates(state.startDate, state.endDate, state.reportType)
      })
      if(
        state.reportType !== "" &&
        state.startDate !== null &&
        state.endDate !== null &&
        state.limitedDistribution !== "" &&
        state.finalReport !== "" &&
        state.selected === 0
      ) {
        this.setState({ selected: 1 })
      }
    })
  }

  addFile = (e, ele) => {
    const { props, state } = this
    e.preventDefault()
    e.stopPropagation()
    let files = Array.from(e.target.files || e.dataTransfer.files)

    console.log("ADD FILES", files)

    // FILE VALIDATION
    if(files.length + state.files.length > 6) {
      console.log("Too Many Files")
      window.alert("Too Many Files (Maximum 6 Files)")
      return
    }
    const mb90 = 9e+7
    const inFiles = files.filter((file) => file.size <= mb90)
    if(inFiles.length < files.length) {
      console.log("file(s) too large")
      window.alert("One or more files are over the size limit (90MB)")
    }

    // SETUP FILES IN STATE
    let fileTags = []
    for(let i = 0; i < inFiles.length; i++) {
      fileTags.push("Select File Type")
    }
    this.setState({
      files: state.files.concat(inFiles),
      fileTags: state.fileTags.concat(fileTags)
    })
  }

  removeFile = (idx) => {
    const { props, state } = this
    this.setState({
      files: state.files.filter((e, i) => i !== idx),
      fileTags: state.fileTags.filter((e, i) => i !== idx)
    })
  }

  setTag = (idx, tag) => {
    const { props, state } = this
    state.fileTags[idx] = tag
    this.setState({
      fileTags: state.fileTags.slice()
    })
  }

  cancel = () => {
    this.setState({
      uploaderOpen: false,
      selected: 0,
      reportType: "",
      label: "",
      startDate: null,
      sdFocused: false,
      endDate: null,
      edFocused: false,
      limitedDistribution: "",
      finalReport: "",
      files: [],
      fileTags: [],
      uploadProgress: 0
    })
  }

  validate = async () => {
    const { props, state } = this
    const sysCodes = {
      "Quarterly": "QUARTERLY",
      "Monthly": "MONTHLY",
      "Semi-Annual": "SEMI_ANNUAL",
      "Annual": "ANNUAL",
      "Addendum": "ADDENDUM"
    }
    const appPkgID = parseInt(window.appPkgID)
    const request = {
      appPkgId: appPkgID,
      bundle: {
        id: null,
        type: sysCodes[state.reportType],
        startDate: state.startDate.getTime(),
        endDate: state.endDate.getTime(),
        label: state.label,
        isFinal: state.finalReport === "Yes",
        documents: this._formDocuments()
      }
    }
    console.log("REQ", request)
    this.setState({ isUploading: true })
    const resp = await API.validateBundle(request)
    console.log("RESP", resp)
    if(resp.success) {
      // UPLOAD
      this.beginUploadProcess()
    }
    else {
      // DISPLAY ERROR MODAL
      if(resp.messages.includes('FILE_MISSING') && !state.matchedBundle) {
        this.setState({
          validationType: ['FILE_MISSING'],
          modalOpen: true,
          isUploading: false
        })
        return
      }

      const messages = (resp.messages.includes('FILE_MISSING') && state.matchedBundle) ? (resp.messages.filter(x => x !== 'FILE_MISSING')) : resp.messages

      if(messages.includes('REPORT_EXISTS')) {
        const arr = []
        const types = []
        const validationTypes = ['START_BEFORE_END_DATE', "START_AFTER_TODAY", "START_END_DATE_MATCH", 'DATE_RANGE_CONFLICT', 'REPORT_EXISTS', 'DATE_OVERLAP', 'FILE_MISSING']
        messages.forEach((e, i) => {
          if(i !== 0 && !validationTypes.includes(e)) {
            arr.push('')
            types.push(e)
          }
        })
        this.setState({
          existingReportChoice: arr,
          existingReportTypes: types
        })
      }
      else {
        this.setState({
          existingReportChoice: [],
          existingReportTypes: []
        })
      }

      this.setState({
        validationType: messages,
        modalOpen: true,
        isUploading: false
      })
    }
  }

  checkValidation = () => {
    // Find next validation
    const newValidations = []
    const validationTypes = ['START_BEFORE_END_DATE', "START_AFTER_TODAY", "START_END_DATE_MATCH", 'DATE_RANGE_CONFLICT', 'REPORT_EXISTS', 'DATE_OVERLAP', 'FILE_MISSING']
    this.state.validationType.forEach((validation, i) => {
      if(i !== 0) {
        if(validationTypes.includes(validation)) {
          newValidations.push(validation)
        }
      }
    })

    // Setup new validation if it has it, otherwise upload
    if(newValidations.length === 0) {
      this.setState({
        validationType: newValidations,
        isUploading: true
      })
      this.beginUploadProcess()
    }
    else {
      this.setState({
        validationType: newValidations,
        modalOpen: true,
        isUploading: true
      })
    }
  }

  beginUploadProcess = async () => {
    const response = await this.createBundle()
    if(!response) {
      window.alert("Error creating bundle")
      return
    }
    this.beginUpload(response)
  }

  createBundle = async () => {
    const { state, props } = this
    const sysCodes = {
      "Quarterly": "QUARTERLY",
      "Monthly": "MONTHLY",
      "Semi-Annual": "SEMI_ANNUAL",
      "Annual": "ANNUAL",
      "Addendum": "ADDENDUM"
    }

    if(!state.startDate && !state.endDate) {
      window.alert("Please select both Start Date & End Date")
      return
    }

    const appPkgID = parseInt(window.appPkgID)
    const request = {
      id: null,
      appPkgId: appPkgID,
      typeCode: sysCodes[state.reportType],
      startDate: state.startDate.getTime(),
      endDate: state.endDate.getTime(),
      label: state.label,
      isFinal: state.finalReport === 'Yes',
      userId: parseInt(window.userID)
    }
    const response = await API.createTechReportBundle(request)
    props.getTechReportLabels()
    return response.id
  }

  beginUpload = (bundleID) => {
    const { props, state } = this

    this.setState({ uploadProgress: 0, isUploading: true })
    const fileTags = findTags(state.reportType, props.allFileTags)

    async function processFiles(setState, resetForm, getSubmittedDocuments) {
      let counter = 0
      let revisionCounter = 0
      let errorCounter = 0

      for(let i = 0; i < state.files.length; i++) {
        // DO FILE UPLOAD CALLS HERE
        const fileType = fileTags.find(x => x.name === state.fileTags[i])

        let revisionReason = null
        if(state.existingReportChoice.length && state.existingReportChoice.length > 0) {
          if(state.existingReportTypes.includes(fileType.name)) {
            const choice = state.existingReportChoice[revisionCounter]
            if(choice === "Revised") revisionReason = 'REVISION'
            else revisionReason = 'ADMIN_CORRECTION'
            revisionCounter++
          }
        }

        const request = {
          bundleId: bundleID,
          file: state.files[i],
          type: fileType.id,
          revisedReason: revisionReason,
          limitedDistribution: state.limitedDistribution === 'Yes'
        }
        console.log("FILE REQUEST", request)
        const response = await API.uploadTechnicalReportFile(request)
        if(!response.success) {
          // Upload file has failed
          errorCounter++
          console.log("ERR UPLOADING FILE", request)
        }

        setState({ uploadProgress: counter + 1 })
        counter += 1
      }
      // DONE UPLOADING
      if(errorCounter > 0) window.alert(`Error uploading ${errorCounter} files.`)
      setState({ uploadProgress: -1, isUploading: false, matchedBundle: false, errorTexts: [] })
      resetForm()
      getSubmittedDocuments()
      setTimeout(() => {
        setState({
          uploadProgress: 0,
          isUploading: false,
          files: [],
          fileTags: [],
        })
      }, 7000)
    }
    processFiles(this.handleSetState, this.resetForm, props.getSubmittedDocuments)

  }

  validateDates = (stDate, edDate, reportType) => {
    const errorTexts = []

    const startDate = moment(stDate);
    const endDate = moment(edDate);

    if(endDate && startDate) {
      if(startDate.isAfter(endDate)) {
        errorTexts.push("START_BEFORE_END_DATE")
      }
      if(startDate.isSame(endDate)) {
        errorTexts.push("START_END_DATE_MATCH")
      }
      const daysBetween = endDate.diff(startDate, 'days')+1
      if(reportType === 'Quarterly') {
        if(daysBetween < 84 || daysBetween > 93) errorTexts.push("QUARTERLY")
      }
      else if(reportType === 'Monthly') {
        if(daysBetween < 28 || daysBetween > 31) errorTexts.push("MONTHLY")
      }
      else if(reportType === 'Semi-Annual') {
        if(daysBetween < 177 || daysBetween > 183) errorTexts.push("SEMI-ANNUAL")
      }
      else if(reportType === 'Annual' && this.state.finalReport === "No") {
        if(daysBetween < 362 || daysBetween > 368) errorTexts.push("ANNUAL")
      }
    }
    if(startDate && startDate.isAfter(moment())) {
      errorTexts.push("START_AFTER_TODAY")
    }

    return errorTexts
  }

  setReportType = (reportType) => {
    const { state } = this
    this.setState({
      selected: 0,
      reportType: reportType,
      startDate: null,
      endDate: null,
      errorTexts: [],
      files: [],
      fileTags: [],
      limitedDistribution: "",
      finalReport: "",
      label: "",
    })
  }

  matchBundle = (sdDate, edDate) => {
    if(!startDate || !endDate) return
    let found = null

    const startDate = moment(sdDate);
    const endDate = moment(edDate);

    function isSameDay(dateA, dateB) {
      return (
        dateA.isSame(dateB, 'day') &&
        dateA.isSame(dateB, 'date')
      )
    }
    this.props.submittedDocuments.forEach((bundle) => {
      const bundleStart = moment(bundle.startDate)
      const bundleEnd = moment(bundle.endDate)
      isSameDay(bundleStart, startDate)
      if(isSameDay(bundleStart, startDate) && isSameDay(bundleEnd, endDate)) {
        found = bundle
      }
    })
    return found
  }

  setStartDate = (startDate) => {
    const { state } = this
    const matchedBundle = this.matchBundle(startDate, state.endDate)
    if(matchedBundle) {
      this.setState({
        matchedBundle: true,
        label: matchedBundle.label,
        reportType: matchedBundle.type,
        finalReport: matchedBundle.isFinal ? "Yes" : "No",
      })
    }
    else {
      this.setState({ matchedBundle: false })
    }
    if(startDate && !state.endDate && state.reportType) {
      const endDate = moment(startDate)
      if(state.reportType === 'Quarterly') endDate.add(90-1, 'days');
      else if(state.reportType === 'Monthly') endDate.endOf('month');
      else if(state.reportType === 'Semi-Annual') endDate.add(180-1, 'days');
      else if(state.reportType === 'Annual') endDate.add(365-1, 'days');
      if(state.reportType !== 'Addendum') this.setState({ endDate: endDate.toDate() });

      const matchedBundle = this.matchBundle(startDate, endDate)
      if(matchedBundle) {
        this.setState({
          matchedBundle: true,
          label: matchedBundle.label,
          reportType: matchedBundle.type,
          finalReport: matchedBundle.isFinal ? "Yes" : "No",
        })
      }
    }

    this.handleFirstSection({
      startDate: startDate,
      errorTexts: this.validateDates(startDate, state.endDate, state.reportType)
    })
  }

  setEndDate = (endDate) => {
    const { state } = this
    const matchedBundle = this.matchBundle(state.startDate, endDate)
    if(matchedBundle) {
      this.setState({
        matchedBundle: true,
        label: matchedBundle.label,
        reportType: matchedBundle.type,
        finalReport: matchedBundle.isFinal ? "Yes" : "No",
      })
    }
    else {
      this.setState({ matchedBundle: false })
    }
    this.setState({ endDate: endDate, errorTexts: this.validateDates(state.startDate, endDate, state.reportType) })
    if(
      state.reportType !== "" &&
      state.startDate !== null &&
      endDate !== null &&
      state.limitedDistribution !== "" &&
      state.finalReport !== "" &&
      state.selected === 0
    ) {
      this.setState({ selected: 1 })
    }
  }

  render(props, state) {
    if(!props.fileUploaderOpen) {
      return(
        <div class={style['submit-btn']}>
          <NewDocButton
            onClick={() => props.setState({ fileUploaderOpen: true })}
          >Submit New Documents</NewDocButton>
        </div>
      )
    }

    const selIdx = (state.selected === 1 && state.files.length > 0) ? (2) : (state.selected);

    return(
      <div>
      <div className={style['file-upload']}>
        <ModalManager
          open={state.modalOpen}
          type={state.validationType}
          reportType={state.reportType}
          existingReportChoice={state.existingReportChoice}
          setState={this.handleSetState}
          beginUploadProcess={this.beginUploadProcess}
          checkValidation={this.checkValidation}
        />
        <div className={style['header']}>
          <b>Submit Documents</b>
          <div>To download report template, please visit MRDC website: <a target="_blank" href="https://mrdc.amedd.army.mil/index.cfm/resources/researcher_resources/reporting/technical">https://mrdc.amedd.army.mil/index.cfm/resources/researcher_resources/reporting/technical</a></div>
          <Clear
            class={style['cancel-icon']}
            onClick={() => {
              props.setState({ fileUploaderOpen: false })}}
          />
        </div>
        <div className="flex-row">
          <FirstSection
            open={true}
            selIdx={selIdx}
            setState={this.handleFirstSection}
            setStartDate={this.setStartDate}
            setEndDate={this.setEndDate}
            setReportType={this.setReportType}
            labels={props.labels}
            errorTexts={state.errorTexts}
            matchedBundle={state.matchedBundle}
            {...state}
          />
          <SectionSeperator display={state.selected === 1} />
          <SecondSection
            open={state.selected === 1}
            setState={this.handleSetState}
            addFile={this.addFile}
            files={state.files}
          />
          <SectionSeperator display={state.selected === 1 && state.files.length > 0} />
          <ThirdSection
            open={state.selected === 1 && state.files.length > 0}
            files={state.files}
            fileTags={state.fileTags}
            removeFile={this.removeFile}
            setTag={this.setTag}
            cancel={this.cancel}
            validate={this.validate}
            isUploading={state.isUploading}
            fileTagOptions={findTags(state.reportType, props.allFileTags)}
          />
        </div>
        {/*<button onClick={() => this.setState({ selected: state.selected + 1 > 1 ? 0 : state.selected + 1 })} />*/}
      </div>
      {
        (state.isUploading || state.uploadProgress === -1) &&
        <UploadProgress
          files={state.files}
          uploadProgress={state.uploadProgress}
          isUploading={state.isUploading}
        />
      }
      </div>
    )
  }
}
