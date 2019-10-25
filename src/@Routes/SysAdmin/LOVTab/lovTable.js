import { h, Component } from 'preact'
import { Edit, Delete, Save, Clear } from '@Icons'
import style from './style.css'
import { lovHeaders } from '@Static/LOV.json'
import {
  Table,
  TextField,
  Dropdown,
  Icon,
} from '@Shared'
import { updateLOV, deleteLOV, } from '@Api'

export default class LovTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editingRow: -1,
      editingData: {},
      savingRow: -1
    }
  }

  handleSetState = (obj) => {
    this.setState(obj)
  }

  handleUpdateLOV = async () => {
    const {props, state} = this
    const { editingData } = state

    let isError = false
    if(editingData.type === "select") isError = true
    if(editingData.sortOrder === "") isError = true
    if(editingData.sysCode === "") isError = true
    if(editingData.name === "") isError = true
    if(editingData.description === "") isError = true

    if(isError) {
      window.alert("Please fill in all fields!")
      return
    }

    this.setState({ savingRow: state.editingRow })

    const request = {
      id: state.editingData.id,
      type: state.editingData.type,
      sortOrder: state.editingData.sortOrder,
      sysCode: state.editingData.sysCode,
      name: state.editingData.name,
      description: state.editingData.description
    }
    console.log("REQ", request)
    const resp = await updateLOV(request)
    console.log("RESP", resp)

    // MOCK API CALL
    // const promise = new Promise((resolve, reject) => {
    //   setTimeout(() => resolve({success: false}), 2000)
    // })
    // const resp = await promise
    if(resp.success) {
      this.setState({editingRow: -1, editingData: {} })
      props.updateLOV(state.editingData)
    }
    else { window.alert("An error has occurred saving the LOV") }
    this.setState({ savingRow: -1 })
  }

  handleDeleteLOV = async (id) => {
    const {props, state} = this
    const resp = await deleteLOV(id)
    if(resp.success) {
      this.setState({editingRow: -1, editingData: {} })
      props.removeLOV(id)
    }
    else { console.log("an error has occurred") }
  }

  render(props, state) {
    const newItem = props.lovList.find(x => x.name === props.newLOVName)

    return(
      <div class={style.lovTableContainer}>
        <Table
          defaultSort={'id'}
          containerClass={style.lovTableContainer}
          tableClass={style.lovTable}
          headers={lovHeaders}
          data={props.lovList}
          firstItem={newItem}
          rowComponent={(p) => (
            <TableRow
              types={props.types}
              editingData={state.editingData}
              editingRow={state.editingRow}
              savingRow={state.savingRow}
              setState={this.handleSetState}
              updateLOV={this.handleUpdateLOV}
              deleteLOV={this.handleDeleteLOV}
              newLOVName={props.newLOVName}
              {...p}
            />
          )}
        />
      </div>
    )
  }
}

const TableRow = (props) => {
  const {data} = props
  const isEditing = (data.id === props.editingRow)
  const isSaving = (data.id === props.savingRow)
  const isNew = (props.newLOVName === data.name)
  return(
    <tr class={`${style.lovRow} ${isEditing ? style.lovRowEdit : ""} ${isNew ? style.newRow : ""}`}>
      <td>
        <EditableDropdown
          isEditing={isEditing}
          isNew={isNew}
          showValue={data.type}
          editValue={props.editingData.type}
          options={props.types}
          onChange={(e) => {
            props.setState({
              editingData: { ...props.editingData, type: e.value }
            })
          }}
        />
      </td>
      <td>
        {data.isDeleted ? "Deleted" : "Active"}
      </td>
      <td class={style.lovRowShort}>
        <EditableTextField
          isEditing={isEditing}
          showValue={data.sortOrder}
          editValue={props.editingData.sortOrder}
          numbersOnly
          onChange={(e) => {
            props.editingData["sortOrder"] = e.replace(/\D/g,'')
          }}
        />
      </td>
      <td>
        <EditableTextField
          isEditing={isEditing}
          showValue={data.sysCode}
          editValue={props.editingData.sysCode}
          onChange={(e) => {
            props.editingData["sysCode"] = e
          }}
        />
      </td>
      <td>
        <EditableTextField
          isEditing={isEditing}
          showValue={data.name}
          editValue={props.editingData.name}
          onChange={(e) => {
            props.editingData["name"] = e
          }}
        />
      </td>
      <td>
        <EditableTextField
          isEditing={isEditing}
          showValue={data.description}
          editValue={props.editingData.description}
          onChange={(e) => {
            props.editingData["description"] = e
          }}
        />
      </td>
      <td>
        {
          isSaving &&
          (
            <div>Saving...</div>
          )
        }
        {
          (!isEditing && !isSaving) &&
          (
            <div class={style.lovRowActions}>
              <Edit
                class={style.lovRowIcon}
                title={"Edit"}
                onClick={() => {
                  props.setState({editingRow: data.id, editingData: data})
                }}
              />
              <Delete
                class={style.lovRowIcon}
                title={"Delete"}
                onClick={() => {
                  if(window.confirm(`Are you sure you want to delete ${data.sysCode}?`)) {
                    props.deleteLOV(data.id)
                  }
                }}
              />
            </div>
          )
        }
        {
          (isEditing && !isSaving) &&
          (
            <div class={style.lovRowActions}>
              <Save
                class={style.lovRowIcon}
                title={"Save"}
                onClick={() => {
                  props.updateLOV()
                }}
              />
              <Clear
                class={style.lovRowIcon}
                title={"Cancel"}
                onClick={() => props.setState({editingRow: -1, editingData: {}, savingRow: -1 })}
              />
            </div>
          )
        }
      </td>
    </tr>
  )
}

const EditableDropdown = (props) => {
  return (!props.isEditing) ?
    (
      <div class={style.newCell}>
        <div>{props.showValue}</div>
        {props.isNew && <div>New!</div>}
      </div>
    ) :
    (
      <Dropdown
        value={props.editValue}
        options={props.options}
        onChange={(e) => { props.onChange(e) }}
      />
    )
}

const EditableTextField = (props) => {
  return (!props.isEditing) ?
    (props.showValue) :
    (
      <TextField
        fullWidth
        value={props.editValue}
        onChange={(e) => { props.onChange(e) }}
        numbersOnly={props.numbersOnly}
      />
    )
}
