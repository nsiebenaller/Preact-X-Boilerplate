import { h, Component } from 'preact';
import { Table } from '@Shared';

import ApplicationActionBar from './ActionBar/actionBar.js';
import TableRow from './Table/TableRow.js';
import { orgAppHeaders } from '@Static/organizationApplications.json';
import style from './OrgAppsList.less';

export default class OrgAppsList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      filter: () => true,
    }
  }

  setFilter = (filterFn) => this.setState({ filter: filterFn })

  render(props, state) {
    return(
      <div>
        <h2>Organization Applications</h2>
        <p>This page allows you to view your applications associated with your organization.</p>
        <hr />
        <p>You can either use the Search option or the Filter option to find the applications</p>
        <ApplicationActionBar
          user={props.user}
          orgOptions={props.orgOptions}
          programOptions={props.programOptions}
          fyOptions={props.fyOptions}
          applications={props.applications}
          setFilter={this.setFilter}
          toggleFiltering={this.toggleFiltering}
        />
        { props.isLoadingApps && <div>Loading Applications...</div> }
        <br />
        <Table
      		group={'fy'}
          defaultSort={'logno'}
      		containerClass={style['table-container']}
      		tableClass={style['compliance-table']}
      		perPage={25}
      		data={props.applications.filter(state.filter)}
      		headers={orgAppHeaders}
      		rowComponent={(params) => (
            <TableRow
              setApp={props.setApp}
              toggleShowApp={props.toggleShowApp}
              selOrg={state.organization}
              user={props.user}
              onChange={this.onCheckboxClick}
              {...params}
            />
          )} />
          { (!props.isLoadingApps && props.applications.length === 0) && <div>No Applications.</div> }
      </div>
    )
  }
}
