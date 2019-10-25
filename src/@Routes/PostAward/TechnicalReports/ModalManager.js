import { h, Component } from 'preact'
import { Modal, RadioGroup, Button } from '@Shared'
import style from './ModalManager.less'

const dateRanges = {
  "Quarterly": "3 months",
  "Monthly": "1 month",
  "Semi-Annual": "6 months",
  "Annual": "12 months",
}

const modalMap = {
  "DATE_RANGE_CONFLICT": {
    title: "Date Range & Report Type Conflict",
    content: (reportType) => (
      <div>
      {`The date range entered for the selected Report type seems to be inaccurate.
      For the ${reportType} Report, the expected date range should be ${dateRanges[reportType]} long.
      Are you sure you want to continue with Submission?`}
      <div className={style['hr']} />
    </div>)
  },
  "REPORT_EXISTS": {
    title: "Report Already Exists",
    content: (reportType, value, setState, messages) => (
      <div>
        {`A file with the same report type and date range exists in your uploaded file list.
          If you want to continue with the upload and override the existing file, please select a reason
          from below and click Submit:`}
          {
            messages.map((file, i) => {
              if(i === 0) return ''
              const validationTypes = ['START_BEFORE_END_DATE', "START_AFTER_TODAY", "START_END_DATE_MATCH", 'DATE_RANGE_CONFLICT', 'REPORT_EXISTS', 'DATE_OVERLAP', 'FILE_MISSING']
              if(validationTypes.includes(messages[i])) return ''
              return(
                <div>
                  <div><b>{messages[i]}:</b></div>
                  <RadioGroup
                    options={["Revised", "Administrative Correction"]}
                    value={value[i-1]}
                    onChange={(e) => {
                      const newArr = value.map((x, idx) => {
                        if(idx === i-1) {
                          return e
                        }
                        return x
                      })
                      setState({ existingReportChoice: newArr  })
                    }}
                  />
                </div>

              )
            })
          }
        <div className={style['hr']} />
      </div>)
  },
  "DATE_OVERLAP": {
    title: "Overlapping Report Date Range",
    content: () => (
      <div>
        {`The selected date range overlaps with another report with the
          same report type. Do you want to continue with the submission?`}
        <div className={style['hr']} />
      </div>
    )

  },
  "FILE_MISSING": {
    title: "Report File is Missing",
    content: (reportType) => (
      <div>
        {`None of the files are tagged as ${reportType} Report.
        ${reportType} Report must be attached to continue with the submission.`}
        <div className={style['hr']} />
      </div>
    )

  }
}

const CloseAction = (props) => (
  <div className={style['action-bar']}>
    <Button
      color={"#0275d8"}
      onClick={props.onClose}
    >Close</Button>
  </div>
)

const ModalManager = (props) => {
  if(props.type.length > 0 && !modalMap[props.type[0]]) {
    window.alert(`Error validating bundle ${props.type[0]}`)
    return
  }
  return(props.type.length > 0 && props.type[0] !== "") ? (
    <Modal
      open={props.open}
      title={modalMap[props.type[0]].title}
      content={modalMap[props.type[0]].content(props.reportType, props.existingReportChoice, props.setState, props.type)}
      confirmText={"Submit"}
      onClose={() => props.setState({ modalOpen: false })}
      onConfirm={() => {
        if(props.type[0] === 'REPORT_EXISTS') {
          if(props.existingReportChoice.some(x => x === '')) {
            window.alert("You must select revison type for all files.")
            return
          }
        }
        props.setState({ modalOpen: false })
        props.checkValidation()
        //props.beginUploadProcess()
      }}
      actions={
        props.type[0] === "FILE_MISSING" ?
        <CloseAction
          onClose={() => props.setState({ modalOpen: false })}
        /> :
        null}
    />
  ) : ("")
}

export default ModalManager
