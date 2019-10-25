import { h, Component } from 'preact'
import style from './style'
import Header from './parts/header'
import ApplicationTable from './parts/applicationTable'
import ApplicationActionBar from '../_shared/applicationActionBar'
import {getOrgApps} from '../../api/index'


export default class MyApplications extends Component {
  constructor(props) {
    super(props)
    const orgMenu = props.user.menus.find(m => m.label === "My Org")
    this.state = {
      menus: orgMenu.children,
      applications: [],
      fetchedApps: false,
      filter: () => {},
      filtering: false,
    }
  }

  componentDidMount() {
    const { props, state } = this
    if(!state.fetchedApps && props.user) {
      this.fetchApplications()
    }
  }

  componentWillReceiveProps(nextProps) {
    const { props, state } = this
    if(!state.fetchedApps && props.user) {
      this.fetchApplications()
    }
  }

  handleSetState = (obj) => this.setState(obj)

  fetchApplications = () => {
    getOrgApps(null, null, this.props.user.id)
      .then((data) => {
        this.setState({
          applications: data,
          fetchedApps: true
        })
      })
  }

  setFilter = (filterFn) => this.setState({filter: filterFn})

  toggleFiltering = (val) => this.setState({filtering: val})

  render(props, state) {
    const applications = (state.filtering) ?
      (state.applications.filter(state.filter)) :
      (state.applications)
    return(
      <div class={style.main}>
        <Header />
        <div class={style.infoText}>* Pre-applications that are not submitted by the deadline and can no longer be edited or submitted.
        We recommend that you delete pre-applications that are past due date in order to keep your list of
        active pre-applications manageable.</div>
        <ApplicationActionBar
          user={props.user}
          applications={state.applications}
          setFilter={this.setFilter}
          toggleFiltering={this.toggleFiltering}
        />
        <br />
        <ApplicationTable
          user={props.user}
          applications={applications}
          setState={this.handleSetState}
        />
      </div>
    )
  }
}
