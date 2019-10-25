import { h, Component } from 'preact'
import { FilterList } from '@Icons'
//import { Icons } from '@Shared'
import { Icon } from '@Shared'
import FilterSearch from './filterSearch.js'
import DefaultSearch from './defaultSearch.js'
import { formOptions } from '@Helpers'

export default class ActionBar extends Component {
	constructor(props) {
		super(props)

		this.state = {
      filterOpen: false,
      orgID: -1,
			organization: "All",
			programs: ["All"],
      fy: ["All"],
      status: ["All"],
			statusCodes: ["All"],
			localFYFilter: () => true,
			localProgramFilter: () => true,
      programOptions: [],
      textfieldOption: "Log Number",
      textfield: ""
		}
	}

  handleSetState = (obj) => this.setState(obj)

  search = () => {
    const {props, state} = this
    const searchFn = (e) => {
      if(state.textfieldOption === "Log Number") {
				if(!e.logNo) return false
        return e.logNo.includes(state.textfield)
      }
      else if(state.textfieldOption === "Award Number") {
				if(!e.awardNumber) return false
        return e.awardNumber.includes(state.textfield) || e.awardNumber === state.textfield
      }
    }
    props.setFilter(searchFn)
  }

	appHasOrg = (app, org) => {
		if(app.preAppPerfOrg.includes(org)) return true
		if(app.preAppContractOrg.includes(org)) return true
		if(app.fullAppOrg === org) return true
		return false
	}

  filter = () => {
    const {props, state} = this

    const filterFn = (e) => {
      const fyPass = (!state.fy.includes("All")) ?
        (state.fy.includes(e.fy)) : (true)
      const orgPass = (!(state.orgID === -1)) ?
        (this.appHasOrg(e, state.organization)) : (true)
      const progPass = (!state.programs.includes("All")) ?
        (state.programs.includes(e.programCode)) : (true)
      let statusPass = (!state.status.includes("All")) ?
        (
          state.status.includes("PreApp-"+e.preAppStatus) ||
          state.status.includes("FullApp-"+e.fullAppStatus) ||
          ((state.status.includes("Funded")) ? (e.awardNumber !== "" || e.awardNumber !== null) : (false))
        ) : (true)
			if(state.status.length === 0) statusPass = true
      return (fyPass && orgPass && progPass && statusPass)
    }
    props.setFilter(filterFn)
    this.setState({textfield: ""})
  }

  clear = () => {
    const {props, state} = this
    props.setFilter(() => true)
    this.setState({
      organization: "All",
      orgID: -1,
      programs: ["All"],
      fy: ["All"],
      status: ["All"]
    })
  }

	setLocalFYFilter = (orgName) => {
		const { props } = this
		if(orgName === 'All') return this.setState({ localFYFilter: () => true })
		const selectedApps = props.applications.filter(x => this.appHasOrg(x, orgName))
		const options = selectedApps.map(x => x.fy)
		this.setState({
			localFYFilter: (item) => options.includes(item.value)  || item.value === "All"
		})
	}

	setLocalProgramFilter = (orgName, fys) => {
		const { props } = this
		let selectedApps = props.applications
		if(orgName !== 'All') selectedApps = selectedApps.filter(x => this.appHasOrg(x, orgName))
		if(!fys.includes('All')) selectedApps = selectedApps.filter(x => fys.includes(x.fy) )
		const options = selectedApps.map(x => x.programCode)
		this.setState({
			localProgramFilter: (item) => options.includes(item.value) || item.value === "All"
		})
	}

	setOrganization = (opt) => {
		const { state } = this
		this.setState({
			organization: opt.label,
			orgID: opt.id,
			programs: ["All"],
			fy: ["All"],
			status: ["All"]
		})
		this.setLocalFYFilter(opt.label)
		this.setLocalProgramFilter(opt.label, state.fy)
	}

	setFiscalYear = (opt) => {
		const { state } = this
		this.setState({fy: opt.parsed})
		this.setLocalProgramFilter(state.organization, opt.parsed)
	}

	setPrograms = (opt) => {
		this.setState({programs: opt.parsed})
	}

	setStatus = (opt) => {
		this.setState({ status: opt.selected })
	}

	render(props, state) {
		let fyOptions = props.fyOptions.filter(state.localFYFilter)
		fyOptions.shift()
		fyOptions.sort((a, b) => b.value - a.value)
		fyOptions.unshift({ value: "All", label: "All" })
		let programOptions = props.programOptions.filter(state.localProgramFilter)
		programOptions.shift()
		programOptions.sort((a, b) => {
	    if(a.value < b.value) { return -1; }
	    if(a.value > b.value) { return 1; }
	    return 0;
		})
		programOptions.unshift({ value: "All", label: "All" })
		return(
      <div>
			   <div class="flex-row">
          <DefaultSearch
            textfieldOption={state.textfieldOption}
            applications={props.applications}
            textfield={state.textfield}
            setState={this.handleSetState}
            search={this.search}
          />
          <div class="flex-row vert-align bold buffer-left buffer-right fix-height">OR</div>
          <div
            class={`filter-btn ${state.filterOpen ? 'filter-btn-open': ''}`}
            onClick={() => this.setState({filterOpen: !state.filterOpen})}
          >
						<FilterList
							class={state.filterOpen ? "filter-icon-black" : "filter-icon"}
						/>Filter
          </div>
        </div>
        {state.filterOpen &&
          <FilterSearch
            selectedOrg={state.organization}
            orgOptions={props.orgOptions}
            selectedFY={state.fy}
            fyOptions={fyOptions}
            selectedPrograms={state.programs}
            programOptions={programOptions}
            selectedStatus={state.status}
            setState={this.handleSetState}
            filter={this.filter}
            clear={this.clear}
						setOrganization={this.setOrganization}
						setFiscalYear={this.setFiscalYear}
						setPrograms={this.setPrograms}
						setStatus={this.setStatus}
          />}
			</div>
		)
	}
}
