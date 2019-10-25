import { h, Component } from 'preact'
import style from './style.css'
import {
  Button,
  TextField,
  Dropdown,
} from '@Shared'
import { createLOV } from '@Api'

export default class LovAdder extends Component {
  constructor(props) {
    super(props)
    this.state = {
      opened: false,
      type: "select",
      sortOrder: "",
      sysCode: "",
      name: "",
      description: "",
      isSaving: false
    }
  }

  handleSetState = (obj) => this.setState(obj)

  handleCreateLOV = () => {
    const {props, state} = this
    const valid = (
      state.type !== 'select' &&
      state.sortOrder !== "" &&
      state.sysCode !== "" &&
      state.name !== "" &&
      state.description !== "")
    if(valid) { this.createLOV() }
    else { window.alert("You must fill in all fields!") }
  }

  createLOV = async () => {
    const { state } = this
    const { opened } = this.state

    let isError = false
    if(state.type === "select") isError = true
    if(state.sortOrder === "") isError = true
    if(state.sysCode === "") isError = true
    if(state.name === "") isError = true
    if(state.description === "") isError = true

    if(isError) {
      window.alert("Please fill in all fields!")
      return
    }

    this.setState({ isSaving: true })

    const request = {
      type: state.type,
      sortOrder: state.sortOrder,
      sysCode: state.sysCode,
      name: state.name,
      description: state.description
    }
    const resp = await createLOV(request)
    // MOCK API CALL
    // const promise = new Promise((resolve, reject) => {
    //   setTimeout(() => resolve({success: false}), 2000)
    // })
    // const resp = await promise
    if(resp.success) {
      this.setState({
        opened: false,
        type: "select",
        sortOrder: "",
        sysCode: "",
        name: "",
        description: ""
      })
      this.props.getLovs()
      this.props.setState({ newLOVName: state.name })
    }
    else {
      window.alert("Error Creating LOV")
    }
    this.setState({ isSaving: false })
  }

  render(props, state) {
    return(
      <div class={style.lovPadding}>
        <div class={style.btnHolder}>
          <Button
            outlined
            class={style.addBtn}
            onClick={() => this.setState({opened: !state.opened})}
          >{state.opened ? "Close" : "Add New LOV"}</Button>
        </div>
        {
          state.opened &&
          <NewLov
            types={props.types}
            lovType={state.type}
            sortOrder={state.sortOrder}
            sysCode={state.sysCode}
            name={state.name}
            desc={state.description}
            setState={this.handleSetState}
            createLOV={this.handleCreateLOV}
            isSaving={state.isSaving}
          />
        }
      </div>
    )
  }

}

const NewLov = (props) => {
  return(
    <div class={style.newLov}>
      <div class={style.newLovHeader}>Add New LOV</div>
      <div class={style.newLovBody}>
        <Dropdown
          label={'LOV Type*'}
          value={props.lovType}
          options={props.types}
          onChange={(e) => {props.setState({ type: e.value })}}
          leftAlign
        />
        <TextField
          label={'Sort Order'}
          value={props.sortOrder}
          onChange={(e) => {props.setState({ sortOrder: e.replace(/\D/g,'') })}}
        />
        <TextField
          label={'System Code*'}
          value={props.sysCode}
          onChange={(e) => {props.setState({ sysCode: e })}}
        />
        <TextField
          label={'Name*'}
          value={props.name}
          onChange={(e) => {props.setState({ name: e })}}
        />
        <TextField
          label={'Description*'}
          value={props.desc}
          onChange={(e) => {props.setState({ description: e })}}
        />
      </div>
      <div class={style.newLovActions}>
      {
        !props.isSaving &&
        (
          <div>
            <Button
              outlined
              onClick={() => props.setState({opened: false})}
            >Cancel</Button>
            <Button
              outlined
              class={style.lovBtn}
              onClick={() => props.createLOV()}
            >Add LOV</Button>
          </div>
        )
      }
      {
        props.isSaving &&
        (
          <div>Saving...</div>
        )
      }

      </div>
    </div>
  )
}
