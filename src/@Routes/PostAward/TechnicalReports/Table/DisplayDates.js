import { h, Component } from 'preact';
import { KeyboardArrowDown, ChevronRight } from '@Icons'
import { Link, Buffer } from './style.js'
import IconDropdown from './IconDropdown.js'

export default function DisplayDates({ row, selected, setState, openRevisedUploader }) {

  const onEditRow = (e) => {
    e.preventDefault()
    e.stopPropagation()

    const startDate = formatDate(row.startDate)
    const endDate = formatDate(row.endDate)

    setState({
      editDateRangeIdx: row.id,
      sdDate: startDate,
      edDate: endDate
    })
  }

  const addReviseBundle = () => openRevisedUploader(row.id);

  return(
    <div class="flex-row vert-align">
      {
        selected ?
        (<KeyboardArrowDown />) :
        (<ChevronRight />)
      }
      {row.type} Report:
      <Buffer />
      {/*https://www.freeformatter.com/epoch-timestamp-to-date-converter.html*/}
      {formatDate(row.startDate).toLocaleDateString()}
      {" - "}
      {formatDate(row.endDate).toLocaleDateString()}
      {" "}
      {"("+row.documents.length+")"}
      <Buffer />
      <IconDropdown
        editDateRange={onEditRow}
        addReviseBundle={addReviseBundle}
      />
    </div>
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
