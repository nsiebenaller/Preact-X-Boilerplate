import { h, Component } from 'preact'
import moment from 'moment';
import style from './style.css'
import Header from './headerRow.js'
import Child from './childRow.js'
import ParentRow from './ParentRow.js'
import ModalManager from '../ModalManager.js'
import { GroupTable } from '@Shared'
import { updateSubmittedDocuments, downloadOrgFile } from '@Api'

export default class Table extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editIdx: -1,
      editParentIdx: -1,
      label: "",
      isFinal: null,
      limitedDistribution: null,
      isSaving: false,
      editDateRangeIdx: -1,
      sdDate: null,
      edDate: null,
      isSavingDates: false,
      sortingKey: null,
      ascending: true,
      sortingFn: () => true,
      validationType: [],
      modalOpen: false,
      reportType: '',
      bundleID: -1,
      firstElement: null
    }
  }

  handleSetState = (obj) => this.setState(obj)

  setEditFile = (childID, parentID) => {
    const child = getChild(childID, this.props.submittedDocuments)
    const parent = this.props.submittedDocuments.find(x => x.id === parentID)
    this.setState({
      editIdx: childID,
      editParentIdx: parentID,
      label: parent ? parent.label : "",
      isFinal: parent ? parent.isFinal : null,
      limitedDistribution: child.limitedDistribution
    })
  }

  handleSaveFile = async (documentID, bundleID) => {
    const { state, props } = this
    this.setState({ isSaving: true })
    const name = document.getElementsByClassName("document-name")[0].value
    const { label, isFinal, limitedDistribution } = state
    const request = {
      bundleId: bundleID,
      documentId: documentID,
      startDate: null,
      endDate: null,
      name: name,
      label: label,
      isFinal: isFinal,
      limitedDistribution: limitedDistribution,
      userId: parseInt(window.userID)
    }
    console.log("REQ", request)
    const resp = await updateSubmittedDocuments(request)
    console.log("RESP", resp)
    this.setState({ isSaving: false, editingIdx: -1 })
    if(resp.success) {
      this.setState({
        editIdx: -1,
        label: "",
        isFinal: null,
        limitedDistribution: null
      })
      props.getSubmittedDocuments()
      props.getTechReportLabels()
    }
    else {
      console.log("error saving doc: ", resp)
    }
  }

  getDateFromElement = (className) => {
    try {
      const ele = document.getElementsByClassName(className)[0];
      const month = ele.childNodes[0].value;
      const day = ele.childNodes[2].value;
      const year = ele.childNodes[4].value;
      return new Date(month+"/"+day+"/"+year);
    }
    catch(e) {
      return null;
    }
  }

  handleSaveBundle = async (bundleID) => {
    const { state, props } = this
    this.setState({ isSavingDates: true });

    const stDate = this.getDateFromElement('edit-start-date');
    const edDate = this.getDateFromElement('edit-end-date');

    if(stDate === null || edDate === null) {
      window.alert("Invalid date selected!");
      return;
    }

    const startDate = moment(stDate);
    const endDate = moment(edDate);

    const selectedBundle = props.submittedDocuments.find(x => x.id === bundleID)
    if(selectedBundle) {
      const validationError = []

      const daysBetween = endDate.diff(startDate, 'days')+1
      if(selectedBundle.type === 'Quarterly') {
        if(daysBetween < 84 || daysBetween > 93) validationError.push("QUARTERLY")
      }
      else if(selectedBundle.type === 'Monthly') {
        if(daysBetween < 28 || daysBetween > 31) validationError.push("MONTHLY")
      }
      else if(selectedBundle.type === 'Semi-Annual') {
        if(daysBetween < 177 || daysBetween > 183) validationError.push("SEMI-ANNUAL")
      }
      else if(selectedBundle.type === 'Annual') {
        if(daysBetween < 362 || daysBetween > 368) validationError.push("ANNUAL")
      }
      if(validationError.length > 0) {
        this.setState({
          validationType: ['DATE_RANGE_CONFLICT'],
          modalOpen: true,
          reportType: selectedBundle.type,
          bundleID: bundleID
        })
        return
      }
    }

    const request = {
      bundleId: bundleID,
      documentId: null,
      startDate: stDate.getTime(),
      endDate: edDate.getTime(),
      name: null,
      label: null,
      isFinal: null,
      limitedDistribution: null,
      userId: parseInt(window.userID)
    }
    console.log("REQ", request)
    try {
      const resp = await updateSubmittedDocuments(request)
      console.log("RESP", resp)
      this.setState({ isSavingDates: false, editDateRangeIdx: -1 })
      props.getSubmittedDocuments()
      props.getTechReportLabels()
    }
    catch(e) {
      window.alert("Error updating bundle dates")
    }
  }

  updateBundle = async () => {
    const { bundleID, sdDate, edDate } = this.state;

    if(sdDate === null || edDate === null) {
      window.alert("Invalid date selected!");
      return;
    }

    this.setState({
      validationType: [],
      modalOpen: false,
      reportType: '',
    })
    const request = {
      bundleId: bundleID,
      documentId: null,
      startDate: sdDate.getTime(),
      endDate: edDate.getTime(),
      name: null,
      label: null,
      isFinal: null,
      limitedDistribution: null,
      userId: parseInt(window.userID)
    }
    console.log("REQ", request)
    try {
      const resp = await updateSubmittedDocuments(request)
      console.log("RESP", resp)
      this.setState({ isSavingDates: false, editDateRangeIdx: -1 })
      this.props.getSubmittedDocuments()
    }
    catch(e) {
      window.alert("Error updating bundle dates")
    }
  }

  downloadFile = (row) => {
    downloadOrgFile(row.name, row.fileAttributeId)
  }

  handleSetState = (obj) => this.setState(obj)

  setFilter = (key) => {
    if(this.state.sortingKey === key) {
      if(this.state.ascending) {
        const sortingFn = this.getSortingFn(key, false)
        this.setState({ ascending: false, sortingFn: sortingFn })
      }
      else {
        this.setState({ sortingKey: null, ascending: true, sortingFn: () => true })
      }
    }
    else {
      const sortingFn = this.getSortingFn(key, true)
      this.setState({ sortingKey: key, ascending: true, sortingFn: sortingFn })
    }
  }

  getSortingFn = (sortingKey, ascending) => {
    if(ascending) {
      return (a, b) => {
        if(a[sortingKey] > b[sortingKey]) { return -1; }
        if(a[sortingKey] < b[sortingKey]) { return 1; }
        return 0;
      }
    }
    else {
      return (a, b) => {
        if(a[sortingKey] < b[sortingKey]) { return -1; }
        if(a[sortingKey] > b[sortingKey]) { return 1; }
        return 0;
      }
    }
  }

  render(props, state) {
    function formatDate(dateString) {
      const dateArr = dateString.split("-")
      const date = new Date()
      date.setFullYear(parseInt(dateArr[0]))
      date.setMonth(parseInt(dateArr[1])-1)
      date.setDate(parseInt(dateArr[2]))
      return date
    }

    const reportSort = (a, b) => {
      if(a.type.includes("Report")) return -1;
      if(a.type.includes("Report")) return 1;
      return 0;
    }
    const data = props.submittedDocuments
      .map( bundle => ({ ...bundle, documents: bundle.documents.sort(state.sortingFn) }) )
      .sort( (a, b) => formatDate(b.startDate) - formatDate(a.startDate) )
      .map( bundle => ({ ...bundle, documents: bundle.documents.sort(reportSort) }) )

    //.filter( bundle => bundle.documents.length !== 0 )

    if(!state.firstElement && data.length > 0) {
      this.setState({ firstElement: data[0].id })
    }

    return(
      <div>
      <ModalManager
        open={state.modalOpen}
        type={state.validationType}
        reportType={state.reportType}
        existingReportChoice={[]}
        setState={(obj) => {
            this.handleSetState(obj)
            this.setState({ isSavingDates: false })
        }}
        beginUploadProcess={() => {}}
        checkValidation={this.updateBundle}
      />
      <GroupTable
        class={style.customTable}
        data={data}
        selected={state.firstElement}
        header={(params) =>
          <Header
            sortingKey={state.sortingKey}
            ascending={state.ascending}
            setFilter={this.setFilter}
          />}
        parent={(params) =>
          <ParentRow
            editDateRangeIdx={state.editDateRangeIdx}
            selectedBundleID={props.selectedBundleID}
            setState={this.handleSetState}
            sdDate={state.sdDate}
            edDate={state.edDate}
            isSavingDates={state.isSavingDates}
            saveBundle={this.handleSaveBundle}
            openRevisedUploader={props.openRevisedUploader}
            {...params}
          />}
        child={(params) =>
          <Child
            onEdit={(childID, parentID) => this.setEditFile(childID, parentID)}
            onView={(row) => this.downloadFile(row)}
            onSave={this.handleSaveFile}
            setState={this.handleSetState}
            editIdx={state.editIdx}
            editParentIdx={state.editParentIdx}
            editFile={state.editFile}
            labels={props.labels}
            isSaving={state.isSaving}
            {...params}
            {...state}
          />
        }
        childProperty={"documents"}
      />
      </div>
    )
  }
}

function getChild(childID, submittedDocuments) {
  let child = {
    label: "",
    limitedDistribution: null
  }
  if(childID !== -1) {
    submittedDocuments.forEach((bundle) => {
      bundle.documents.forEach((doc) => {
        if(doc.id === childID) {
          child = doc
        }
      })
    })
  }
  return child
}
