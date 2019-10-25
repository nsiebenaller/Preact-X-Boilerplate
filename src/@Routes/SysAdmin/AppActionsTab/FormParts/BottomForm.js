import { h, Component } from 'preact'
import { Edit, Save, Clear } from '@Icons'
import style from '../style.css'
import {
  Button,
  Dropdown,
  Icon,
  AutoComplete,
} from '@Shared'

function getPI(app) {
  if(!app.contacts) {
    return {}
  }
  if(app.contacts.find(x => x.appInfoContactType === 'FULLAPP_PI')) {
    return app.contacts.find(x => x.appInfoContactType === 'FULLAPP_PI')
  }
  if(app.contacts.find(x => x.appInfoContactType === 'PREAPP_PI')) {
    return app.contacts.find(x => x.appInfoContactType === 'PREAPP_PI')
  }
  return {}
}

function getOrganization(app, type) {
  if(!app.organizations) {
    return {
      id: null,
      name: ''
    }
  }
  if(app.organizations.find(x => x.appInfoOrgType === type)) {
    const org = app.organizations.find(x => x.appInfoOrgType === type)
    if(!org.name) {
      org.name = ''
    }
    if(!org.id) {
      org.id = -1
    }
    return org
  }
  return {
    id: null,
    name: ''
  }
}

function isOrgValid(orgName, organizations, app) {
  if(!app) return true
  if(app.organizations && app.organizations.find(x => x.name === orgName)) return true
  if(orgName === "") return true
  if(organizations.find(x => x.orgname === orgName)) return true
  return false
}

const BottomForm = (props) => {
  const performingOrgValid = isOrgValid(props.botForm.perfOrg, props.organizations, props.selectedApp)
  const contractingOrgValid = isOrgValid(props.botForm.contractOrg, props.organizations, props.selectedApp)
  const fullAppOrgValid = isOrgValid(props.botForm.fullAppOrg, props.organizations, props.selectedApp)

  const buttonDisabled = !(performingOrgValid && contractingOrgValid && fullAppOrgValid)

  // SWAPNA - (7/22/2019)
  //   Sys admin can change status to Withdrawn from any other status
  //   If app status (full or pre) is  WITHDRAWN then Only Sys admin  ​can chose revert back the application to any status available .
  //   If the Status of an application  (pre app or an Intramural Full App) is Draft then sys admin should be able to change it to "Submitted"
  //   -- Swapna knows that there is a loop hole in this logic that allows sys admin to change the status to anything (7/25/2019 2:57pm EST)
  let preAppStatusOptions = props.preAppStatuses.filter(x => x.sysCode === 'WITHDRAWN' || x.sysCode === props.selectedApp.preAppStatusCode)
  if(props.selectedApp.preAppStatusCode === 'WITHDRAWN') {
    preAppStatusOptions = props.preAppStatuses
  }
  else if(props.selectedApp.preAppStatusCode === 'DRAFT') {
    preAppStatusOptions = preAppStatusOptions.concat(props.preAppStatuses.filter(x => x.sysCode === 'SUBMITTED'))
  }

  let fullAppStatusOptions = props.fullAppStatuses.filter(x => x.sysCode === 'WITHDRAWN' || x.sysCode === props.selectedApp.fullAppStatusCode)
  if(props.selectedApp.fullAppStatusCode === 'WITHDRAWN') {
    fullAppStatusOptions = props.fullAppStatuses
  }
  else if(props.selectedApp.fullAppStatusCode === 'DRAFT' && props.selectedApp.submissionType === 'INTRAMURAL') {
    fullAppStatusOptions = fullAppStatusOptions.concat(props.fullAppStatuses.filter(x => x.sysCode === 'BO_APPROVAL_PENDING'))
  }

  return(
    <div>
      <div class={style.infoRow}>
        <div>Log Number:</div>
        <div>{props.selectedApp.logNo}</div>
      </div>
      <div class={style.infoRow}>
        <div>Principal Investigator:</div>
        <div>{getPI(props.selectedApp).name}</div>
      </div>
      <div class={style.infoRow}>
        <div>Pre App Status:</div>
        <EditField
          editing={props.isEditing}
          value={props.isEditing ? props.botForm.preAppStatus : props.selectedApp.preAppStatusCode}
          options={preAppStatusOptions}
          setState={props.handlePreAppStatusChange}
        />
      </div>
      <div class={style.infoRow}>
        <div>Full App Status:</div>
        <EditField
          editing={props.isEditing}
          value={props.isEditing ? props.botForm.fullAppStatus : props.selectedApp.fullAppStatusCode}
          options={fullAppStatusOptions}
          setState={props.handleFullAppStatusChange}
        />
      </div>
      <TypeAhead
        class={style.infoRow}
        label={'Pre App Performing Organization:'}
        displayValue={getOrganization(props.selectedApp, 'PERFORMING_ORG').name}
        isEditing={props.isEditing}
        value={props.botForm.perfOrg}
        options={props.orgNames}
        onChange={(e) => {
          props.handleOrgChange(e, 'perfOrg')
        }}
        isError={performingOrgValid}
      />
      <TypeAhead
        class={style.infoRow}
        label={'Pre App Contracting Organization:'}
        displayValue={getOrganization(props.selectedApp, 'CONTRACTING_ORG').name}
        isEditing={props.isEditing}
        value={props.botForm.contractOrg}
        options={props.orgNames}
        onChange={(e) => {
          props.handleOrgChange(e, 'contractOrg')
        }}
        isError={contractingOrgValid}
      />
      <TypeAhead
        class={style.infoRow}
        label={'Full App Organization:'}
        displayValue={getOrganization(props.selectedApp, 'FULLAPP_ORG').name}
        isEditing={props.isEditing}
        value={props.botForm.fullAppOrg}
        options={props.orgNames}
        onChange={(e) => {
          props.handleOrgChange(e, 'fullAppOrg')
        }}
        isError={fullAppOrgValid}
      />
      {
        props.botForm.saving &&
        (
          <div class={style.editRow}>Saving...</div>
        )
      }
      {
        props.botStatus && !props.botForm.saving &&
        <div
          class={style.statusBar}
          onClick={() => props.setState({ botStatus: false })}
          >Your updates have been saved successfully.<Clear class={style.smIcon} />
        </div>
      }
      {
        props.isEditing && !props.botForm.saving &&
        (
          <div class={style.editRow}>
            <Button
              outlined
              color={"#2196f3"}
              onClick={() => props.handleSave("botStatus")}
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
        !props.isEditing &&
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

export default BottomForm

const EditField = (props) => {
  if(props.editing) {
    if(props.options) {
      return(
        <Dropdown
          class={style.inlineDD}
          options={props.options}
          value={props.value}
          onChange={(e) => { props.setState(e) }}
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
      <div class={props.class}>
        <div>{props.label}</div>
        <div>{props.displayValue}</div>
      </div>

    )
  }
  return(
    <div class={props.class}>
      <div>{props.label}</div>
      <AutoComplete
        value={props.value}
        options={props.options}
        onChange={props.onChange}
      />
      <div>{props.isError ? '' : 'Invalid!'}</div>
    </div>
  )
}
