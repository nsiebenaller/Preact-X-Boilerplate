import { h, Component } from 'preact'
import style from './style.css'
import {Dropdown, Button, TextField, GroupedMultiselect} from '@Shared'
import {activeOptions, lockOptions, roleOptions} from '@Static/userAdmin.json'

const ActionBar = (props) => (
  <div class={style.actionBar}>

    <div>
      <div>Locked Status</div>
      <Dropdown
        class={style.actionDD}
        options={lockOptions}
        value={props.lockedStatus}
        onChange={(e) => props.setState({lockedStatus: e.value})}
      />
    </div>

    <div>
      <div>Active Status</div>
      <Dropdown
        class={style.actionDD}
        options={activeOptions}
        value={props.activeStatus}
        onChange={(e) => props.setState({activeStatus: e.value})}
      />
    </div>

    <div>
      <div>First Name</div>
      <TextField
        class={style.actionDD}
        value={props.firstname}
        onChange={(e) => {props.setState({firstname: e})}}
      />
    </div>

    <div>
      <div>Last Name</div>
      <TextField
        class={style.actionDD}
        value={props.lastname}
        onChange={(e) => {props.setState({lastname: e})}}
      />
    </div>

    <div>
      <div>User Name</div>
      <TextField
        class={style.actionDD}
        value={props.username}
        onChange={(e) => {props.setState({username: e})}}
      />
    </div>

    <div>
      <div>Email</div>
      <TextField
        class={style.actionDD}
        value={props.email}
        onChange={(e) => {props.setState({email: e})}}
      />
    </div>

    <div>
      <div>Role</div>
      <GroupedMultiselect
        class={style.expandedDD}
        options={formRoleOptions(props.compRoles, props.orgRoles, props.sysRoles)}
        value={props.role}
        onClick={(e) => {
          props.setState({role: e.selected})
        }}
      />
    </div>

    <div class={style.actionBtn}>
      <Button
        onClick={props.searchUsers}
      >Search</Button>
    </div>

  </div>
)

function formRoleOptions(compRoles, orgRoles, sysRoles) {
  const options = {
    "Compliance": compRoles.map((opt) => ({value: opt.name, label: opt.name})),
    "Organization": orgRoles.map((opt) => ({value: opt.name, label: opt.name})),
    "System": sysRoles.map((opt) => ({value: opt.name, label: opt.name})),
  }
  return options
}

export default ActionBar
