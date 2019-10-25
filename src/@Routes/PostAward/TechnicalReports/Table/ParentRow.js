import { h, Component } from 'preact'
import { KeyboardArrowDown, ChevronRight } from '@Icons'
import { DatePicker } from '@Shared';
import moment from 'moment'
import { Row } from './style.js'
import { Link, Buffer } from './style.js'
import DisplayDates from './DisplayDates.js';
import EditDates from './EditDates.js';

export default function ParentRow(props) {

  const { row, editDateRangeIdx, selectedBundleID } = props;

  const isRowAvail = (row.id !== editDateRangeIdx);
  const onExpand = () => (isRowAvail) ? (props.onClick(row.id)) : (null);

  return(
    <Row
      overflow
      leftAlign
      clickable={isRowAvail}
      onClick={onExpand}
      selected={selectedBundleID === props.row.id}
    >
      {
        isRowAvail &&
        (
          <DisplayDates
            selected={props.selected}
            row={props.row}
            setState={props.setState}
            openRevisedUploader={props.openRevisedUploader}
          />
        )
      }
      {
        !isRowAvail &&
        (
          <EditDates
            selected={props.selected}
            row={props.row}
            setState={props.setState}
            sdDate={props.sdDate}
            edDate={props.edDate}
            isSavingDates={props.isSavingDates}
            saveBundle={props.saveBundle}
          />
        )
      }
    </Row>
  )
}
