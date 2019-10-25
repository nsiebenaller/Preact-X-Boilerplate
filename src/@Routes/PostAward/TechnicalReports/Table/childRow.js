import { h, Component } from 'preact'
import { Cancel, Save, Edit } from '@Icons'
import style from './style.css'
import { Row, Link } from './style.js'
import { Icon, TextField, Dropdown, AutoComplete } from '@Shared'

const ChildRow = (props) => (
  <Row leftAlignFirst>
    <div className={style.docTypeCell}>{props.row.type}</div>
    <EditTextField
      class={`document-name`}
      linkClass={style.docNameCell}
      value={props.row.name}
      onView={() => props.onView(props.row)}
      isEditing={(props.row.id === props.editIdx) && (props.parent.id === props.editParentIdx)}
    />
    <div>{new Date(props.row.submittedOn).toLocaleString()}</div>
    <div>{props.row.isRevised ? "REVISED" : "NEW"}</div>
    {
      props.row.type && props.row.type.includes('Report') ?
      (
        <EditAutocomplete
          class={`${"document-label"} ${style.dropdown}`}
          value={props.parent.label}
          editValue={props.label}
          options={props.labels}
          isEditing={(props.row.id === props.editIdx) && (props.parent.id === props.editParentIdx)}
          onChange={(e) => props.setState({label: e})}
        />
      ) : ( <div /> )
    }
    {
      props.row.type && props.row.type.includes('Report') ?
      (
        <div class="flex-row">
          <EditDropdown
            class={`${"document-isFinal text-center"} ${style.dropdownSm}`}
            value={props.parent.isFinal ? "YES" : "NO"}
            editValue={props.isFinal ? "YES" : "NO"}
            options={[{label: "YES", value: "YES"}, {label: "NO", value: "NO"}]}
            isEditing={(props.row.id === props.editIdx) && (props.parent.id === props.editParentIdx)}
            onChange={(e) => props.setState({isFinal: e.value === "YES"})}
          />
        </div>
      ) : (<div class="flex-row">-</div>)
    }
    <div class="flex-row">
      <EditDropdown
        class={`${"document-limitedDistribution text-center"} ${style.dropdownSm}`}
        value={props.row.limitedDistribution ? "YES" : "NO"}
        editValue={props.limitedDistribution ? "YES" : "NO"}
        options={[{label: "YES", value: "YES"}, {label: "NO", value: "NO"}]}
        isEditing={(props.row.id === props.editIdx) && (props.parent.id === props.editParentIdx)}
        onChange={(e) => props.setState({limitedDistribution: e.value === "YES"})}
      />
    </div>
    <EditIcons
      id={props.row.id}
      bundleId={props.parent.id}
      onEdit={() => props.onEdit(props.row.id, props.parent.id)}
      onSave={props.onSave}
      cancel={() => props.onEdit(-1, -1)}
      isEditing={(props.row.id === props.editIdx) && (props.parent.id === props.editParentIdx)}
      isSaving={props.isSaving}
    />
  </Row>
)

export default ChildRow

const EditTextField = (props) => {
  return(
    (props.isEditing) ?
    (
      <TextField
        class={`${props.class} ${style.textfield}`}
        value={props.value}
      />
    ) :
    (
      <Link
        className={props.linkClass ? props.linkClass : ''}
        onClick={props.onView}
      >{props.value}</Link>
    )
  )
}

const EditDropdown = (props) => {
  return(
    (props.isEditing) ?
    (
      <Dropdown
        class={props.class}
        value={props.editValue}
        options={props.options}
        onChange={props.onChange}
      />
    ) :
    (
      <div>{props.value}</div>
    )
  )
}


class EditAutocomplete extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editValue: props.editValue,
      options: props.options
    }
  }

  render(props, state) {
    return(
      (props.isEditing) ?
      (
        <AutoComplete
          class={props.class}
          value={state.editValue}
          options={state.options}
          onChange={(e) => this.setState({ editValue: e })}
          onBlur={(e) => props.onChange(state.editValue)}
        />
      ) :
      (
        <div>{props.value}</div>
      )
    )
  }
}

const EditIcons = (props) => {
  if(props.isSaving) {
    return(
      <div>Saving...</div>
    )
  }
  if(props.isEditing && !props.isSaving) {
    return(
      <div class="flex-row">
        <Save
          icon={"save"}
          class={style.editIcon}
          onClick={() => props.onSave(props.id, props.bundleId)}
        />
        <Cancel
          class={style.editIcon}
          onClick={props.cancel}
        />
      </div>
    )
  }
  if(!props.isEditing && !props.isSaving) {
    return(
      <div>
        <Edit
          class={style.editIcon}
          onClick={props.onEdit}
        />
      </div>
    )
  }
}
