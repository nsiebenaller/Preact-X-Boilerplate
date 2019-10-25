import { h, Component } from 'preact'
import { Table, Icon } from '@Shared'
import { myAppHeaders } from '../../../staticData/organizationApplications.json'
import { Expanded, MyAppRow } from './style.js'
import { getAppInfo } from '@Api'

export default class ApplicationTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedApplication: -1,
    }
  }

  handleSetState = (obj) => this.setState(obj)

  handleRowClick = async (obj) => {
    if(!obj.FETCHED) {
      const apps = this.props.applications.filter(app => app.id != obj.id)
      const appInfo = await getAppInfo(obj.id)
      if(appInfo) {
        appInfo.FETCHED = true
        apps.push({...appInfo, ...obj})
        this.props.setState({applications: apps})
      }
    }
    this.setState({selectedApplication: obj.id === this.state.selectedApplication ? -1 : obj.id})
  }

  render(props, state) {
    return(
      <div>

        <Table
          group={'fy'}
          defaultSort={'logno'}
          containerClass={'table-container'}
          tableClass={'compliance-table'}
          perPage={25}
          data={props.applications}
          headers={myAppHeaders}
          rowComponent={(p) => (
            <TableRow
              user={props.user}
              selected={state.selectedApplication === p.data.id}
              onClick={this.handleRowClick}
              {...p}
            />
          )}
          expandedRow={(p) =>
            <ExpandedRow
              selected={state.selectedApplication === p.data.id}
              {...p}
            />
          }
        />
      </div>
    )
  }
}

const TableRow = (props) => {
	const {data} = props
	if(!data.logno && data.group) {
    return(<OrgGroup data={data}/>)
	}
	return(
    <OrgRow {...props} />
	)
}
const OrgGroup = ({data}) => {
  return(
    <tr class="comp-row comp-group">
      <td colspan="7">
        <div>
          <b>Fiscal Year: {data.value}</b>({data.items.length})
        </div>
      </td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
  )
}
const OrgRow = (props) => {
  const {data} = props
  return(
      <MyAppRow
        selected={props.selected}
        onClick={() => props.onClick(data)}
      >
        <td>
          <div class="link">
            <Icon class="flex-row" icon={props.selected ? 'keyboard_arrow_down' : 'keyboard_arrow_right'} />
            <div>{data.logno}</div>
          </div>
        </td>
        <td><div>{data.title}</div></td>
        <td>{data.preDueDate.toLocaleDateString()}</td>
        <td>{data.preStatus}</td>
        <td>{data.fullDueDate.toLocaleDateString()}</td>
        <td>{data.fullStatus}</td>
        <td>{data.awardNumber}</td>
      </MyAppRow>
  )
}
const ExpandedRow = (props) => {
  const {data} = props
  return(
    <Expanded
      selected={props.selected}
    >
      <td class="section" colspan="9">
        <div class="header">
          <div>Application Summary</div>
          <div>Actions</div>
        </div>
        <div class="data-section">
          <div class="data-table">
            <div class="data"><div>Principal Investigator: </div><div>{data.pi}</div></div>
            <div class="data"><div>Business Official: </div><div>{data.primaryBO}</div></div>
            <div class="data"><div>Performing Organization: </div><div>{data.preAppPerfOrg}</div></div>
            <div class="data"><div>Contracting Organization: </div><div>{data.preAppContractOrg}</div></div>
            <div class="data"><div>Program: </div><div>{data.program}</div></div>
            <div class="data"><div>Award Mechanism: </div><div>{data.mechanism}</div></div>
            <div class="data"><div>Funding Status: </div><div>{data.awardNumber ? "Funded" : "Not Funded"}</div></div>
            <div class="data"><div>Award Number: </div><div>{data.awardNumber}</div></div>
          </div>
          <div>
            {
              data.links && data.links.map((link) =>
                <a href={link.url}>{link.label}</a>
              )
            }
          </div>
        </div>

      </td>
    </Expanded>
  )
}
