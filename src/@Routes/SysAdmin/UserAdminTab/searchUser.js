import { h, Component } from 'preact'
import style from './style.css'
import ActionBar from './parts/actionBar.js'
import UserTable from './parts/userTable.js'
import {findUsers, editUser, unlockUsers} from '@Api'

export default class SearchUser extends Component {
  constructor(props) {
    super(props)

    this.state = {
      lockedStatus: "Any",
      activeStatus: "Any",
      firstname: "",
      lastname: "",
      username: "",
      email: "",
      role: ["All"],
      editingRow: -1,
      selectedRows: [],
      editRowData: {},
      users: []
    }
  }

  handleSetState = (obj) => this.setState(obj)

  determineRoles = () => {
    const {props, state} = this
    const roleIDs = []
    state.role.forEach((role) => {
      const compRole = props.compRoles.find(r => r.name === role)
      const orgRole = props.orgRoles.find(r => r.name === role)
      const sysRole = props.sysRoles.find(r => r.name === role)
      if(compRole) {
        roleIDs.push(compRole.id)
      }
      else if(orgRole) {
        roleIDs.push(orgRole.id)
      }
      else if(sysRole) {
        roleIDs.push(sysRole.id)
      }
      else {
        console.log("role not found")
      }
    })
    return roleIDs
  }

  searchUsers = async () => {
    const {state} = this
    const requestObj = {
      locked: state.lockedStatus !== "Any" ? state.lockedStatus === "Locked" : null,
      active: state.activeStatus !== "Any" ? state.activeStatus === "Active" : null,
      firstname: state.firstname !== "" ? state.firstname : "",
      lastname: state.lastname !== "" ? state.lastname : "",
      username: state.username !== "" ? state.username : "",
      email: state.email !== "" ? state.email : "",
      roles: !state.role.includes("All") ? this.determineRoles() : null,
    }

    const users = await findUsers(requestObj)

    this.setState({users: users})
    // console.log("Searching...", requestObj)
  }

  doesUsernameExist = async () => {
    const requestObj = {
      locked: null,
      active: null,
      firstname: "",
      lastname: "",
      username: this.state.editRowData.username,
      email: "",
      roles: null,
    }

    const users = await findUsers(requestObj);
    console.log(users);
    return users.length > 0;
  }

  validateRow = async (request, usernameChanged) => {
    const errors = [];
    if(!request.username || request.username === "") {
      errors.push("\n Username cannot be left blank.")
    }
    if(!request.firstname || request.firstname === ""){
      errors.push("\n First name cannot be left blank.")
    }
    if(!request.lastname || request.lastname === ""){
      errors.push("\n Last name cannot be left blank.")
    }

    console.log('Namechanged', usernameChanged);
    if(usernameChanged){
      const usernameExists = await this.doesUsernameExist();
      if (usernameExists){
        errors.push('\n The username already exisits: ' + request.username)
      }
    }

    return errors;
  }

  updateUser = async (usernameChanged) => {
    if(window.confirm("Are you sure you want to save?")) {
      const {state} = this
      const request = {
        id: state.editRowData.id,
        username: state.editRowData.username,
        active: state.editRowData.active,
        locked: state.editRowData.locked,
        firstname: state.editRowData.firstname,
        lastname: state.editRowData.lastname,
        email: state.editRowData.email,
        roles: state.editRowData.roles.map(x => x.id)
      }
      console.log("req", request);

      const errors = await this.validateRow(request, usernameChanged);
      console.log('errors', errors);

      if (errors.length === 0) {
        //console.log("EDIT USER REQUEST:: ",request)
        const resp = await editUser(request)
        //console.log("EDIT USER RESPONSE:: ", resp)
        if(resp.success) {
          this.setState({editingRow: -1, editRowData: {}})
          this.searchUsers()
        }
        else {
          window.alert("Error Saving User!")
        }
      } else {
        window.alert("The following issues are present: " + errors.join());
      }
    }
  }

  unlockUsers = async () => {
    if(this.state.selectedRows.length === 0) {
      window.alert("Please Select Users to Unlock!")
    }
    else {
      const resp = await unlockUsers(this.state.selectedRows)
      if(resp.success) {
        this.setState({selectedRows: []})
        this.searchUsers()
      }
      else {
        window.alert("Error Unlocking Users!")
      }
    }
  }

  render(props, state) {
    return(
      <div>
        <div>Use the below filters to search for a existing user</div>
        <ActionBar
          setState={this.handleSetState}
          searchUsers={this.searchUsers}
          {...state}
          {...props}
        />
        <hr />
        <UserTable
          users={state.users}
          updateUser={this.updateUser}
          unlockUsers={this.unlockUsers}
          setState={this.handleSetState}
          editingRow={state.editingRow}
          editRowData={state.editRowData}
          selectedRows={state.selectedRows}
          {...props}
        />
      </div>
    )
  }
}
