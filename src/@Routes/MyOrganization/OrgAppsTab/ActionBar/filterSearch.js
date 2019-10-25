import { h, Component } from 'preact'
import {
  Dropdown,
  Multiselect,
  Button,
  GroupedMultiselect,
  Icon,
} from '@Shared'
import { Clear } from '@Icons'
import {statusGroups} from '@Static/organizationApplications.json'
import {formOptions} from '@Helpers/index.js'
import style from './style.css'

const FilterSearch = ({selectedOrg, orgOptions, selectedFY, fyOptions, selectedPrograms, programOptions, selectedStatus, setState, filter, clear, ...props}) => {
  return(
    <div class={style.filterSearchbar}>
        <Clear
          class={style.closeBtn}
          onClick={() => setState({filterOpen: false})}
        />
        <Dropdown
          label="Organization"
          value={selectedOrg}
          options={orgOptions}
          onChange={props.setOrganization}
        />
        <Multiselect
          label="Fiscal Year"
          allValue="All"
          value={selectedFY}
          options={fyOptions}
          onChange={props.setFiscalYear}
        />
        <Multiselect
          label="Program"
          allValue="All"
          value={selectedPrograms}
          options={programOptions}
          onChange={props.setPrograms}
        />
        <GroupedMultiselect
          class={`${style.expandedWidth}`}
          label="Status"
          value={selectedStatus}
          options={statusGroups}
          onClick={props.setStatus}
        />
      <div class={style.actions}>
        <Button
          onClick={filter}
        >Filter</Button>
        <Button
          onClick={clear}
        >Clear</Button>
      </div>
    </div>
  )
}

export default FilterSearch
