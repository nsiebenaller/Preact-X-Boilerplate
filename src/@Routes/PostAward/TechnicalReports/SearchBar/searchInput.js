import { h, Component } from 'preact'
import { Search } from '@Icons'
import moment from 'moment'
import { SearchRow, SearchLabel } from './style.js'
import style from './style.css'
import { TextField, Dropdown, Button, DatePicker } from '@Shared'
import { formOptions } from '@Helpers/'


const inputMap = {
  "Document Name": {
    render: (props) => (
      <TextField
        icon={(() => <Search class={style.searchIco} />)()}
        value={props.searchText}
        onChange={(e) => props.setState({ searchText: e })}
        onEnter={props.onSearch}
      />
    )
  },
  "Report Start Date": {
    render: (props) => (
      <DatePicker
        onChange={date => props.setState({ date1: date })}
        rightAlign
      />
    )
  },
  "Label": {
    render: (props) => (
      <Dropdown
        class={style.searchBarDropdown}
        value={props.label}
        options={formOptions(props.labels)}
        onChange={(e) => props.setState({ label: e.value })}
      />
    )
  },
  "Submitted On": {
    render: (props) => (
      <DatePicker
        onChange={date => props.setState({ date2: date })}
        rightAlign
      />
    )
  },
  "Limited Distribution": {
    render: (props) => (
      <Dropdown
        value={props.limitedDistribution}
        options={formOptions(["Yes", "No"])}
        onChange={(e) => props.setState({ limitedDistribution: e.value })}
      />
    )
  },
  "Document Type": {
    render: (props) => (
      <Dropdown
        class={style.searchBarDropdown}
        value={props.documentType}
        options={formOptions(props.docTypes)}
        onChange={(e) => props.setState({ documentType: e.value })}
      />
    )
  }
}


const SearchInput = (props) => (
  <div class={style.searchInput}>
    {inputMap[props.type].render({ ...props })}
  </div>
)

export default SearchInput
