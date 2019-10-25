import { h, Component } from 'preact'
import Section from './section.js'
import { SectionBody, ErrorText, SectionHeader } from './style.js'
import style from './FirstSection.less'
import { TextField, Dropdown, Button, RadioGroup, AutoComplete, DatePicker } from '@Shared'
import { formOptions } from '@Helpers/'
import HelpModal from './HelpModal.js'
import LabelHelpModal from './LabelHelpModal.js';

const FirstSection = (props) => {
  return(
    <Section open={props.open} header={"Step 1 : Enter Report Info"}>
      <SectionBody column firstSection selected={props.selIdx}>
        <div>
          <Dropdown
            class={style['report-type']}
            label={"* Report Type"}
            options={formOptions(props.reportTypes)}
            value={props.reportType}
            onChange={(e) => { props.setReportType( e.value ) }}
          />
          <AutoComplete
            class={style['label']}
            label={(() => (
              <div class="flex-row vert-align">
              Label<LabelHelpModal/>
              </div>
            ))()}
            placeholder={"e.g. 2018 Quarterly"}
            onChange={(e) => props.setState({ label: e })}
            options={props.labels}
            value={props.label}
          />
        </div>
        <div>
          <div>
            <div>* Report Start Date</div>
            <DatePicker
              className={style['date-picker']}
              value={props.startDate}
      				onChange={props.setStartDate}
      			/>
            {
              props.errorTexts.includes("START_AFTER_TODAY") &&
              <ErrorText>*Start Date should be before today</ErrorText>
            }
            {
              props.errorTexts.includes("START_BEFORE_END_DATE") &&
              <ErrorText>*Start Date should be before End Date</ErrorText>
            }
            {
              props.errorTexts.includes("START_END_DATE_MATCH") &&
              <ErrorText>*Start Date and End Date should not be the same</ErrorText>
            }
            {/*
              props.errorTexts.includes("QUARTERLY") &&
              <ErrorText>*Quarterly reports should be ~90 days</ErrorText>
            */}
            {/*
              props.errorTexts.includes("MONTHLY") &&
              <ErrorText>*Monthly reports should be between 28 and 31 days</ErrorText>
            */}
            {/*
              props.errorTexts.includes("SEMI-ANNUAL") &&
              <ErrorText>*Semi-Annual reports should be ~180 days</ErrorText>
            */}
            {/*
              props.errorTexts.includes("ANNUAL") &&
              <ErrorText>*Annual reports should be ~365 days</ErrorText>
            */}
          </div>
          <div>
            <div>* Report End Date</div>
            <DatePicker
              className={style['date-picker']}
              value={props.endDate}
      				onChange={props.setEndDate}
      			/>
          </div>
        </div>
        <div className={style['radio-btn-row']}>
          <RadioGroup
            label={<LimitedDistributionLabel limitedDistribution={props.limitedDistribution} reportType={props.reportType} open={props.helpModalOpen} setState={props.setState}/>}
            options={["Yes", "No"]}
            value={props.limitedDistribution}
            onChange={(e) => props.setState({ limitedDistribution: e })}
            className={style['radio-group']}
            horizontal
            footer={<LimitedDistributionFooter limitedDistribution={props.limitedDistribution} reportType={props.reportType} />}
          />
          <RadioGroup
            label={"* Final Report?"}
            options={["Yes", "No"]}
            value={props.finalReport}
            onChange={(e) => props.setState({ finalReport: e })}
            className={style['radio-group']}
            horizontal
          />
        </div>
      </SectionBody>
    </Section>
  )
}

export default FirstSection

function LimitedDistributionLabel({ reportType, limitedDistribution, open, setState }) {
  return(
    <div>
      <div class="flex-row vert-align">
      * Limited Distribution?<HelpModal open={open} setState={setState}/>
      </div>
      { reportType === "Annual" && limitedDistribution !== '' && <div className={style['ld-label']}>(Note: Limited distribution selection must match your cover page.)</div> }
    </div>
  )
}

function LimitedDistributionFooter({ reportType, limitedDistribution }) {
  if(reportType === "Annual" && limitedDistribution === "No") {
    return(
      <div className={style['ld-footer']}>
        Your report will be publically available with unlimited distribution
      </div>
    )
  }
  return null;
}
