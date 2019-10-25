import { h, Component } from 'preact'
import style from './style.css'
import {getLovList} from '@Api'
import SearchUser from './searchUser.js'
import AddUser from './AddUser.js'

export default class UserAdmin extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedLink: "add",
      countries: [],
      states: [],
      compRoles: [],
      sysRoles: [],
      orgRoles: []
    }
  }

  componentDidMount() {
    this.getLists()
  }

  getLists = async () => {
    const countries = await getLovList("COUNTRY", false)
    const states = await getLovList("STATE", false)
    const compRoles = await getLovList("COMPLIANCE_ROLE", false)
    const sysRoles = await getLovList("SYSTEM_ROLE", false)
    const orgRoles = await getLovList("ORGANIZATION_ROLE", false)
    this.setState({
      countries,
      states,
      compRoles,
      sysRoles,
      orgRoles
    })
  }

  handleSetState = (obj) => this.setState(obj)

  render(props, state) {
    return(
      <div>
        <LinkRow selectedLink={state.selectedLink} setState={this.handleSetState} />
        {state.selectedLink === "search" && <SearchUser {...state} />}
        {state.selectedLink === "add" && <AddUser {...state} />}
      </div>
    )
  }
}


const LinkRow = (props) => (
  <div class={`flex-row ${style.linkRow}`}>
    <div
      class={(props.selectedLink === "search") ? (style.selectedLink) : (style.link)}
      onClick={() => props.setState({selectedLink: "search"})}
    >Search for an Existing User</div>
    <div>|</div>
    <div
      class={(props.selectedLink === "add") ? (style.selectedLink) : (style.link)}
      onClick={() => props.setState({selectedLink: "add"})}
    >Add New User</div>
  </div>
)
