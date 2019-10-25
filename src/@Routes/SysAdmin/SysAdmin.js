import { h, Component } from 'preact'
import * as Shared from '@Shared' //Top Level Chunks need imports
import { Tabs } from '@Shared'
import { getSystemReport } from '@Api'
import Summary from './SummaryTab/index'
import Compliance from './ComplianceTab/compliance'
import ComplianceTab from './ComplianceTab2/ComplianceTab.js'
import LOVs from './LOVTab/lovs'
import Reports from './ReportsTab/reports'
import AppActions from './AppActionsTab/appActions'
import UserAdmin from './UserAdminTab/userAdmin'
import QueryRunner from './QueryRunnerTab'
import style from './SysAdmin.less'

const headerMap = {
	'sysAdminSummaryTab.htm': {
		label: 'Summary',
		component: (props) => <Summary {...props} />
	},
	'LOVs.htm': {
		label: 'LOV Maintenance',
		component: (props) => <LOVs />
	},
	'AppActions.htm': {
		label: 'Application Actions',
		component: (state, props) => <AppActions {...props} />
	},
	'Compliance.htm': {
		label: 'Compliance',
		component: (props) => <ComplianceTab {...props} />
	},
	'UserAdmin.htm': {
		label: 'User Administration',
		component: (props) => <UserAdmin />
	},
	'Reports.htm': {
		label: 'Reports',
		component: (props) => <QueryRunner />
	}
}

export default class SysAdmin extends Component {
	constructor(props) {
		super(props)

		const sysMenu = props.user.menus.find(m => m.label === "Sys Admin")
		this.state = {
			menus: sysMenu.children.sort((a, b) => { return a.order - b.order }),
			sysReport: {
				freeSpaceMB: null,
	      totalSpaceMB: null,
	      authUsers: null,
	      activeSessions: null
			}
		}
	}
	async componentDidMount() {
		const resp = await getSystemReport()
		this.setState({sysReport: resp.data})
	}

	render(props, state) {
		return(
			<div class={style.home}>
				<Header selTab={props.selTab} />
				<Tabs options={state.menus} selected={props.selTab} />
				{headerMap[props.selTab].component(state, props)}
				{/*props.selTab === 'Compliance.htm' && <Compliance />*/}
				{/*props.selTab === 'Reports.htm' && <Reports />*/}
			</div>
		)
	}
}


const Header = (props) => {
	return(
		<div class={style.header} >{headerMap[props.selTab].label}</div>
	)
}
