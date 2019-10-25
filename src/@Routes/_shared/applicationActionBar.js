import { h, Component } from 'preact'
import {
  Dropdown,
  Multiselect,
  TextField,
  Button,
  Groupedselect,
  GroupedMultiselect,
  AutoComplete,
  Icon,
} from '@preact-ui'
import {statusGroups} from '../../staticData/organizationApplications'
import {formFiscalYearList, formOptions} from '../../helpers/index.js'


/* PARAMS
  user              - User Object
  applications      - Array of Applications
  setFilter         - Fn to Set Filter
  toggleFiltering   - Fn to Determine Whether to Filter
*/

const autoMap = {
  "Log Number": 'logno',
  "Award Number": 'awardNumber'
}
export default class ApplicationActionBar extends Component {
  constructor(props) {
    super(props)

    const years = formFiscalYearList()
    years.unshift({value: "All", label: "All"})

    this.state = {
      textfield: "",
      textfieldOption: "Log Number",
      filterOpen: false,
      organization: "",
      orgOpts: [],
      programs: ["All"],
      programOpts: [],
      fy: ["All"],
      fyOpts: years,
      status: ["All"],
    }
  }

  componentWillReceiveProps(nextProps) {
    const {props, state} = this
		if(state.organization === "" && nextProps.user.orgs && nextProps.user.orgs.length > 0) {
      this.setState({
        orgOpts: nextProps.user.orgs.map(org => ({label: org.orgname, value: org.id})),
        organization: nextProps.user.orgs[0].orgname
      })
		}
    if(state.programOpts.length === 0 && nextProps.applications.length !== 0) {
      const uniquePrograms = nextProps.applications
        .map(app => app.program)
        .filter((val, idx, self) => self.indexOf(val) === idx)
        .sort()
        .map(prog => ({value: prog, label: prog}))
      uniquePrograms.unshift({value: "All", label: "All"})
      this.setState({programOpts: uniquePrograms})
    }
	}

  handleSetState = (obj) => this.setState(obj)

  search = () => {
    const {props, state} = this
    const searchFn = (e) => {
      if(state.textfieldOption === "Log Number") {
        return e.logno.includes(state.textfield)
      }
      else if(state.textfieldOption === "Award Number") {
        return e.awardNumber.includes(state.textfield)
      }
    }
    props.setFilter(searchFn)
    props.toggleFiltering(true)
  }

  filter = () => {
    const {props, state} = this
    const filterFn = (e) => {
      const fyPass = (!state.fy.includes("All")) ?
        (state.fy.includes(e.fy)) :
        (true)
      const orgPass = e.org === state.organization
      const progPass = (!state.programs.includes("All")) ?
        (state.programs.includes(e.program)) :
        (true)
      const statusPass = (!state.status.includes("All")) ?
        (
          state.status.includes("PreApp-"+e.preStatus) ||
          state.status.includes("FullApp-"+e.fullStatus) ||
          ((state.status.includes("Funded")) ? (e.awardNumber !== "") : (false))
        ) :
        (true)
      return (fyPass && orgPass && progPass && statusPass)
    }
    props.setFilter(filterFn)
    props.toggleFiltering(true)
    this.setState({textfield: ""})
  }

  clear = () => {
    const {props, state} = this
    props.setFilter(() => {})
    props.toggleFiltering(false)
    this.setState({
      programs: ["All"],
      fy: ["All"],
      status: ["All"]
    })
  }

  render(props, state) {
    return(
      <div>
        <div class="flex-row flex-wrap">
          <DefaultSearch
            textfield={state.textfield}
            textfieldOption={state.textfieldOption}
            applications={props.applications}
            setState={this.handleSetState}
            search={this.search}
          />
          <div class="flex-row vert-align bold buffer-left buffer-right fix-height">OR</div>
          <FilterButton
            filterOpen={state.filterOpen}
            setState={this.handleSetState}
          />
        </div>
        {
          state.filterOpen &&
          <FilterSearch
            setState={this.handleSetState}
            filter={this.filter}
            clear={this.clear}
            organization={state.organization}
            orgOpts={state.orgOpts}
            fy={state.fy}
            fyOpts={state.fyOpts}
            program={state.programs}
            programOpts={state.programOpts}
            status={state.status}
          />
        }
      </div>
    )
  }
}

const DefaultSearch = (props) => {
  return(
    <div className="default-search-bar">
      <Dropdown
        class="action-dd"
        value={props.textfieldOption}
        options={formOptions(["Log Number", "Award Number"])}
        onChange={(opt) => props.setState({textfieldOption: opt.value})}
      />
      <AutoComplete
        options={props.applications.map(app => app[autoMap[props.textfieldOption]])}
        value={props.textfield}
        onChange={(e) => props.setState({textfield: e})}
      />
      <Button
        class="fix-height"
        onClick={props.search}
      >Search</Button>
    </div>
  )
}

const FilterButton = (props) => (
  <div
    class={`filter-btn ${props.filterOpen ? 'filter-btn-open': ''}`}
    onClick={() => props.setState({filterOpen: !props.filterOpen})}
  >
    <Icon
    class="filter-icon"
    icon="filter_list"
    />Filter
  </div>
)

const FilterSearch = (props) => {
  return(
    <div class="flex-row flex-wrap filter-search-bar">
          <Icon
          class="close-btn"
          icon="close"
          onClick={() => props.setState({filterOpen: false})}
          />
        <Dropdown
          label="Organization"
          class="comp-action-dd"
          value={props.organization}
          options={props.orgOpts}
          onChange={(opt) => {
            props.setState({
              organization: opt.label,
              programs: ["All"],
              fy: ["All"],
              status: ["All"]
            })
          }}
        />
        <Multiselect
          label="Fiscal Year"
          class="expander-sample"
          allValue="All"
          value={props.fy}
          options={props.fyOpts}
          onChange={(opt) => {
            props.setState({fy: opt.parsed})
          }}
        />
        <Multiselect
          label="Program"
          class="comp-action-dd"
          allValue="All"
          value={props.program}
          options={props.programOpts}
          onChange={(opt) => {
            props.setState({programs: opt.parsed})
          }}
        />
        <GroupedMultiselect
          label="Status"
          class="comp-action-dd"
          allValue="All"
          value={props.status}
          options={statusGroups}
          onClick={(opt) =>	{
            props.setState({status: opt.selected})
          }}
        />
      <div class="action-btn-container">
        <Button
          onClick={props.filter}
        >Filter</Button>
        <Button
          onClick={props.clear}
        >Clear</Button>
      </div>
    </div>
  )
}
