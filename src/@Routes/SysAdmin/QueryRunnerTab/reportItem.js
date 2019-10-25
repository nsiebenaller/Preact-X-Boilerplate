import { h, Component } from 'preact'
import {
  Item,
  Label,
  Prompt,
  TextArea,
  Button
} from './style.js'

function autoResize(e, selectedID) {
  const ref = document.getElementById(selectedID)
  ref.style.height = 'auto';
  ref.style.height = (ref.scrollHeight) + 'px';
}

const ReportItem = ({report, runReport}) => (
  <Item>
    <Label>{report.reportLabel}</Label>
    <Prompt>{report.paramPrompt}<br/>{report.paramNote}</Prompt>
    <TextArea
      id={report.reportName}
      onInput={(e) => autoResize(e, report.reportName)}
    />
    <Button
      onClick={(e) => runReport(report)}
    >DOWNLOAD</Button>
  </Item>
)

export default ReportItem
