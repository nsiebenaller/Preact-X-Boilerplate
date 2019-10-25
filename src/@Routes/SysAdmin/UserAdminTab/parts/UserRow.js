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

export default class UserRow extends Component {

  constructor(props) {
    super(props)
    this.state = {
      errors: {}
    }
  }

  handleRoleChange = (e) => {
    const { props } = this;
    const removeCompRoles = (role) => (!props.compRoles.some(r => r.name === role.name))
    const removeOrgRoles = (role) => (!props.orgRoles.some(r => r.name === role.name))
    const roleExists = props.editRowData.roles.some(r => r.name === e.label);
    const isCompRole = props.compRoles.some(r => r.name === e.label);
    const isOrgRole = props.orgRoles.some(r => r.name === e.label);
    let selectedRoles = props.editRowData.roles;

    // Single select roles for compliance & organization
    if(isCompRole) {
      selectedRoles = selectedRoles.filter(removeCompRoles)
      //console.log("remove comp role", selectedRoles)
    }
    else if(isOrgRole) {
      selectedRoles = selectedRoles.filter(removeOrgRoles)
    }

    const newRole = findLOV(e.label, props.compRoles, props.orgRoles, props.sysRoles)
    selectedRoles = (roleExists) ? selectedRoles.filter(r => r.name !== e.label) : selectedRoles.concat(newRole)

    const editRowObj = {
      ...props.editRowData,
      roles: selectedRoles
    }
    props.setState({editRowData: editRowObj})
  }

  onChange = (property) => (e) => {
    const { props, state } = this;

    props.editRowData[property] = e;
    const ele = document.getElementsByClassName(property + "-field")[0];
    //console.log(ele);
    if(e === '') ele.classList.add(style.inputErr);
    else ele.classList.remove(style.inputErr);

    this.setState({
      errors: { ...state.errors, property: (e === '') }
    })
  }

  resetEdit = () => {
    const elements = document.getElementsByClassName(style.inputErr);

    for( let i = 0; i < elements.length; i++) {
      elements[i].classList.remove(style.inputErr);
    }
  }

  render(props, state) {
    const { data } = props
    const isEditing = (props.editingRow === data.id)
    const binaryOptions = [{value: "Yes", label: "Yes"}, {value: "No", label: "No"}]


    return(
      <tr class={`std-row ${style.userRow}`}>
        <td onClick={() => {
          props.setState({ selectedRows: ( props.selectedRows.includes(data.id) ) ?
            ( props.selectedRows.filter(x => x !== data.id) ) :
            ( props.selectedRows.concat(data.id) )
          })
        }}>
          <div><input type="checkbox" checked={props.selectedRows.includes(data.id)} /></div>
        </td>
        <td>
          {(isEditing) ?
            (<TextField
              value={props.editRowData.username}
              onChange={this.onChange('username')}
              class={'username-field'}
            />) :
            (data.username)}
        </td>
        <td>
        {(isEditing) ?
          (<Dropdown
            class={style.smDD}
            value={props.editRowData.active}
            options={binaryOptions}
            onChange={(e) =>  props.setState({editRowData: {...props.editRowData, active: e.value}})}
          />) :
          (data.active)}
        </td>
        <td>
          { (isEditing) ?
          (
            <Dropdown
            class={style.smDD}
            value={props.editRowData.locked}
            options={binaryOptions}
            onChange={(e) => {
              props.setState({editRowData: {...props.editRowData, locked: e.value}})
            }}
          />
        ) :
          (data.locked)}
        </td>
        <td>
          {(isEditing) ?
          (
            <div>
              <TextField
                value={props.editRowData.firstname}
                onChange={this.onChange('firstname')}
                class={'firstname-field'}
              />
              <TextField
                value={props.editRowData.lastname}
                onChange={this.onChange('lastname')}
                class={'lastname-field'}
              />
            </div>
          ) :
          (data.firstname +" "+ data.lastname)}
        </td>
        <td>
          {(isEditing) ?
          (<TextField
            value={props.editRowData.email}
            onChange={(e) => props.editRowData["email"] = e}
          />) :
          (data.email)}
        </td>
        <td>
          {(isEditing) ?
          (<GroupedMultiselect
            class={style.userDD}
            rolloverLimit={99}
            value={props.editRowData.roles ? props.editRowData.roles.map(x => x.name) : []}
            options={formRoleOptions(props.compRoles, props.orgRoles, props.sysRoles)}
            onClick={ this.handleRoleChange }
            noAllValue
          />) :
          data.roles.map(x => x.name).join(", ")}
        </td>
        <td>
          <div class={style.actionCell}>
          {props.editingRow !== data.id &&
            <Edit
              class={style.icoRow}
              onClick={() => {
                props.setState({ editingRow: data.id, editRowData: { ...data } })
              }}
              title={"Edit"}
               />}
          {isEditing &&
            <Save
              class={style.icoRow}
              onClick={ () => {
                props.updateUser(data.username != props.editRowData.username)}
              }
              title={"Save"}
               />}
          {isEditing &&
            <Cancel
              class={style.icoRow}
              onClick={() => {
                this.resetEdit();
                props.setState({ editingRow: -1, editRowData: {} });
              }}
              title={"Cancel"}
               />}
               </div>
        </td>
      </tr>
    )
  }
}

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
