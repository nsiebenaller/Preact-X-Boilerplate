import { h, Component } from 'preact'


const apps = [
  {
    fy: -1,
    title: "My App Title"
  },
  {
    fy: -1,
    title: "My App Title"
  },
  {
    fy: -1,
    title: "My App Title"
  },
  {
    fy: -1,
    title: "My App Title"
  },
  {
    fy: -1,
    title: "My App Title"
  },
  {
    fy: -1,
    title: "My App Title"
  },
]

function fetchApps(year) {
  return new Promise((res, rej) => {
    setTimeout(() => res({data: apps}), 1000)
  })
}


export default class MyApplications extends Component {
  constructor(props) {
    super(props)
    this.state = {
      applications: [],
      yearBuffer: 3,
      yearStop: 2020
    }
  }

  componentDidMount() {
    this.fetchApplications()
  }

  fetchApplications = async () => {
    const { state } = this
    const today = new Date()
    const thisYear = today.getFullYear()
    const fetchYear = thisYear + state.yearBuffer
    this.fetchNextApps(fetchYear)
  }

  fetchNextApps = async (year) => {
    const { state } = this
    const resp = await fetchApps(year)
    console.log(state.applications)
    state.applications.push( resp.data.map(x => ({ ...x, fy: year })) )
    this.setState({ applications: state.applications })
    if( year > state.yearStop ) this.fetchNextApps(year-1)
  }


  render(props, state) {

    return(
      <div>
        <div>All Apps</div>
        {
          state.applications.map(appYear => {
            const yearTitle = [<div>{appYear[0].fy}</div>]
            const apps = appYear.map(app => <div>{app.fy}, {app.title}</div> )
            const rows = yearTitle.concat(apps)
            return rows
          })
        }
      </div>
    )
  }

}
