import { h, Component } from 'preact'
import style from '../style.css'
import { formOptions, getUnique } from '@Helpers/index.js'
import { AutoComplete, Dropdown, Button, Icon } from '@Shared'
import { Edit, Save, Clear } from '@Icons'

const TopForm = (props) => {

  const fundingOpportunity = props.isEditing ? props.topForm.fo : props.selectedApp.fundingOpportunity.name
  const submissionType = props.isEditing ? props.topForm.subType : props.selectedApp.submissionType
  const mechanism = props.isEditing ? props.topForm.mech : props.selectedApp.mechanism.name
  const program = props.isEditing ? props.topForm.program : props.selectedApp.program.code

  const mechanismOptions = props.mechanisms
    .filter(x => x.submissionType === props.topForm.subType)
    .map(x => ({ ...x, value: x.mechanism, label: x.mechanism }) )
  const mechanismDisabled = props.topForm.mech === 'Invalid Funding Opportunity' || props.topForm.subType === 'Select a Submission Type'
  const submissionDisabled = props.topForm.mech === 'Invalid Funding Opportunity'
  const buttonDisabled = mechanismDisabled || submissionDisabled || props.topForm.mech === '' || props.topForm.subType === ''

  return(
    <div>
      <div class={style.infoRow}>
        <div>Funding Opportunity:</div>
        <TypeAhead
          isEditing={props.isEditing}
          value={fundingOpportunity}
          options={props.fundingOpps.map(x => x.fundingOpp)}
          onChange={props.handleFundingOppChange}
        />
      </div>
      <div class={style.infoRow}>
        <div>Submission Type:</div>
        <EditField
          editing={props.isEditing}
          value={submissionType}
          options={formOptions(getUnique(props.mechanisms, 'submissionType'))}
          setState={props.handleSubTypeChange}
          disabled={submissionDisabled}
        />
      </div>
      <div class={style.infoRow}>
        <div>Mechanism:</div>
        <EditField
          editing={props.isEditing}
          value={mechanism}
          options={mechanismOptions}
          setState={props.handleMechChange}
          disabled={mechanismDisabled}
        />
      </div>
      <div class={style.infoRow}>
        <div>Program:</div><div>{program}</div>
      </div>
      <div class={style.infoRow}>
        <div>Fiscal Year:</div><div>{props.selectedApp.fy}</div>
      </div>
      {
        props.topStatus &&
        <div
          class={style.statusBar}
          onClick={() => props.setState({ topStatus: false })}
          >Your updates have been saved successfully.<Clear class={style.smIcon} />
        </div>
      }
      {
        props.topForm.saving &&
        (
          <div class={style.editRow}>Saving...</div>
        )
      }
      {
        (props.isEditing && !props.topForm.saving) &&
        (
          <div class={style.editRow}>
            <Button
              outlined
              color={"#2196f3"}
              onClick={() => props.handleSave("topStatus")}
              disabled={buttonDisabled}
            ><Save class={style.smIcon} /><span>Save</span></Button>
            <Button
              outlined
              color={"#2196f3"}
              onClick={() => props.handleEdit(false)}
            ><Clear class={style.smIcon} /><span>Cancel</span></Button>
          </div>
        )
      }
      {
        (!props.isEditing  && !props.topForm.saving) &&
        (
          <div class={style.editRow}>
            <Button
              outlined
              color={"#2196f3"}
              onClick={props.handleEdit}
            ><Edit class={style.smIcon} /><span>Edit</span></Button>
          </div>
        )
      }
    </div>
  )
}

export default TopForm

const EditField = (props) => {
  if(props.editing) {
    if(props.options) {
      return(
        <Dropdown
          class={style.inlineDD}
          options={props.options}
          value={props.value}
          onChange={(e) => { props.setState(e) }}
          disabled={props.disabled}
        />
      )
    }
    else {
      return(
        <div>Editing...</div>
      )
    }

  }
  else {
    return(
      <div>{props.value}</div>
    )
  }
}

const TypeAhead = (props) => {
  if(!props.isEditing) {
    return(
      <div>{props.value}</div>
    )
  }
  return(
    <AutoComplete
      value={props.value}
      options={props.options}
      onChange={props.onChange}
    />
  )
}
