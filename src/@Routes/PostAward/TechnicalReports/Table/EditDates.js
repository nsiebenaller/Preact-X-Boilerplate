import { h, Component } from 'preact';
import { KeyboardArrowDown, ChevronRight } from '@Icons';
import { DatePicker } from '@Shared';
import { Link, Buffer } from './style.js'

//onChange={date => props.setState({ sdDate: date })}
////onChange={date => props.setState({ edDate: date })}

export default function EditDates(props) {
  return(
    <div class="flex-row vert-align">
      {
        props.selected ?
        (
          <KeyboardArrowDown />
        ) :
        (
          <ChevronRight />
        )
      }
      Report Date Range:
      <Buffer />

      <DatePicker
        className={'edit-start-date'}
        value={props.sdDate}
      />

      <Buffer> - </Buffer>

      <DatePicker
        className={'edit-end-date'}
        value={props.edDate}
      />

      <Buffer />
      {
        !props.isSavingDates &&
        (
          <div class="flex-row vert-align">
            <Link
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                props.saveBundle(props.row.id)
              }}
            >Save</Link>
            <Buffer />
            <Link
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                props.setState({ editDateRangeIdx: -1 })
              }}
            >Cancel</Link>
          </div>
        )
      }
      {
        props.isSavingDates &&
        (
          <div>Saving...</div>
        )
      }
    </div>
  )
}
