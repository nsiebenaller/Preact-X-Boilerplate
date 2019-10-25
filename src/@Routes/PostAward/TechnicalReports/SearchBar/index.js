import { h, Component } from 'preact'
import { SearchRow, SearchLabel, ClearButton } from './style.js'
import style from './style.css'
import { TextField, Dropdown, Button } from '@Shared'
import { formOptions } from '@Helpers/'
import SearchInput from './searchInput.js'

const options = ["Document Name", "Report Start Date", "Label", "Submitted On", "Limited Distribution", "Document Type"]

function formatDoctTypes(docMap){
  let docTypes = []
  Object.keys(docMap).forEach((key) => {
    docTypes = docTypes.concat(docMap[key])
  })
  return docTypes.map((doc) => doc.name).sort()
}

function isEqual(dateObjA, dateObjB) {
  return(
    dateObjA.getFullYear() === dateObjB.getFullYear() &&
    dateObjA.getMonth() === dateObjB.getMonth() &&
    dateObjA.getDate() === dateObjB.getDate()
  )
}

function formatDate(dateString) {
  const dateArr = dateString.split("-")
  const date = new Date()
  date.setFullYear(parseInt(dateArr[0]))
  date.setMonth(parseInt(dateArr[1])-1)
  date.setDate(parseInt(dateArr[2]))
  return date
}

export default class SearchBar extends Component {
  constructor(props) {
    super(props)

     this.state = {
      selected: "Document Name",
      searchText: "",
      date1: null,
      date2: null,
      label: "",
      limitedDistribution: "",
      documentType: ""
    }
  }

  handleSetState = (obj) => this.setState(obj)

  onSearch = () => {
    const { state, props } = this
    if(state.selected === "Document Name") {
      const docFilter = (doc) => (doc.name.toLowerCase().includes(state.searchText.toLowerCase()))
      props.setState({ filterFn: docFilter, isDoc: true })
    }
    else if(state.selected === "Report Start Date") {
      if(!state.date1) {
        props.setState({ filterFn: (x) => true })
        return
      }
      const startDateFilter = (bundle) => {
        const startDate = formatDate(bundle.startDate)
        return isEqual(startDate, state.date1)
      }
      props.setState({ filterFn: startDateFilter, isDoc: false })
    }
    else if(state.selected === "Label") {
      const labelFilter = (bundle) => bundle.label === state.label
      props.setState({ filterFn: labelFilter, isDoc: false })
    }
    else if(state.selected === "Submitted On") {
      if(!state.date2) {
        props.setState({ filterFn: (x) => true })
        return
      }
      const submittedFilter = (doc) => isEqual(new Date(doc.submittedOn), state.date2)
      props.setState({ filterFn: submittedFilter, isDoc: true })
    }
    else if(state.selected === "Limited Distribution") {
      const distributionFilter = (doc) => (doc.limitedDistribution === (state.limitedDistribution === "Yes"))
      props.setState({ filterFn: distributionFilter, isDoc: true })
    }
    else if (state.selected === "Document Type") {
      const documentTypeFilter = (doc) =>  (doc.type === state.documentType)
      props.setState({ filterFn: documentTypeFilter, isDoc: true })
    }
  }

  onClear = () => {
    this.setState({ selected: "Document Name" })
    this.props.setState({ filterFn: () => true , isDoc: false })
  }

  render(props, state) {

    return(
      <SearchRow>
        <div><b>Submitted Documents</b></div>
        <div class="flex-row vert-align">
          <SearchLabel>Search by</SearchLabel>
          <Dropdown
            class={style.searchBarDropdown}
            value={state.selected}
            options={formOptions(options)}
            onChange={(e) => this.setState({ selected: e.value })}
          />
          <SearchInput
            type={state.selected}
            setState={this.handleSetState}
            labels={props.labels}
            docTypes={formatDoctTypes(props.allFileTags)}
            onSearch={this.onSearch}
            {...state}
          />
          <Button
            color={'#757575'}
            onClick={this.onSearch}
          >Search</Button>
          <ClearButton onClick={this.onClear}>Clear</ClearButton>
        </div>
      </SearchRow>
    )
  }
}
