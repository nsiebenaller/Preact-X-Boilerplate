import { h, Component } from 'preact'
import { Edit, Cancel, Save } from '@Icons'
import style from './style.css'
import {
  Table,
  Button,
  Icon,
  Multiselect,
  TextField,
  Dropdown,
  GroupedMultiselect
} from '@Shared'
import UserRow from './UserRow.js'
import {formOptions} from '@Helpers/index.js'
import {roleOptions} from '@Static/userAdmin.json'

const headers = {
  "Select": "select",
  "User Name": "username",
  "Active?": "active",
  "Locked?": "locked",
  "Name": "firstname",
  "Email": "email",
  "Role": "roles",
  "Action": "action"
}

const binaryOptions = [{value: "Yes", label: "Yes"}, {value: "No", label: "No"}]

const UserTable = (props) => (
  <div>
    <Button
      outlined
      onClick={props.unlockUsers}
    >Unlock Selected Users</Button>
    <Table
      defaultSort={'id'}
      headers={headers}
      data={props.users}
      rowComponent={(p) => (
        <UserRow {...p}
          updateUser={props.updateUser}
          selectedRows={props.selectedRows}
          editingRow={props.editingRow}
          editRowData={props.editRowData}
          setState={props.setState}
          {...props}
        />
      )}
    />
  </div>
)

export default UserTable

function findLOV(label, compRoles, orgRoles, sysRoles) {
  if(compRoles.find(x => x.name === label)) return compRoles.find(x => x.name === label)
  if(orgRoles.find(x => x.name === label)) return orgRoles.find(x => x.name === label)
  if(sysRoles.find(x => x.name === label)) return sysRoles.find(x => x.name === label)
}

function formRoleOptions(compRoles, orgRoles, sysRoles) {
  const options = {
    "Compliance": compRoles.map((opt) => ({value: opt.name, label: opt.name})),
    "Organization": orgRoles.map((opt) => ({value: opt.name, label: opt.name})),
    "System": sysRoles.map((opt) => ({value: opt.name, label: opt.name})),
  }
  return options
}

const IconBtn = (props) => (
  <div
    class={style.icoRow}
    onClick={() => props.onClick()}
  ><Icon title={props.title} icon={props.icon} />{props.title}</div>
)
