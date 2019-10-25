import { h, Component } from 'preact'
import {
  Dropdown,
  Multiselect,
  TextField,
  Button,
} from '@Shared'
import {formFiscalYearList} from '@Helpers/index.js'

export default class ActionBar extends Component {
	constructor(props) {
		super(props)

		this.state = {
			years: formFiscalYearList(),
			fy: (new Date()).getFullYear(),
			logno: "",
			programs: ["All"],
			funds: ["All"],
			mechs: ["All"]
		}
	}

  formFilterFn = (e) => {
    const {props, state} = this
    const appsFilter = (e) => {
      const blankLogno = state.logno === ""
      let shouldInclude = false
      shouldInclude = (blankLogno) ? (false) : e.logno.includes(state.logno)
      if(blankLogno && shouldInclude === false) {
        const progPass = (!state.programs.includes('All')) ?
          (state.programs.includes(e.program)) :
          (true)
        const fundPass = (!state.funds.includes('All')) ?
          (state.funds.includes(e.fundingOpportunity)) :
          (true)
        const mechPass = (!state.mechs.includes('All')) ?
          (state.mechs.includes(e.mechanismOption)) :
          (true)
        shouldInclude = (progPass && fundPass && mechPass)
      }
      return shouldInclude
    }
    const foFilter = (e) => {
      let shouldInclude = false
      const progPass =  (!state.programs.includes('All')) ?
        (state.programs.includes(e.program)) :
        (true)
      const fundPass = (!state.funds.includes('All')) ?
        (state.funds.includes(e.fundingOpp)) :
        (true)
      shouldInclude = (progPass && fundPass)
      return shouldInclude
    }
    props.setState({appsFilter: appsFilter, foFilter: foFilter})
    props.toggleFiltering(true)
  }

	render(props, state) {
		return(
			<div class="action-bar-container">
        <div>
  				<div>FY</div>
					<Dropdown
						class="action-dd"
						value={state.fy.toString()}
						options={state.years}
						onChange={(opt) => {
							props.setYear(opt.value)
							this.setState({
								fy: opt.value,
								programs: ["All"],
							})
						}}
					/>
        </div>
        <div>
  				<div>Program *</div>
					<Multiselect
						class="action-dd"
            allValue={"All"}
						value={state.programs}
						options={props.programs}
						onChange={(opt) => { this.setState({programs: opt.parsed}) }}
					/>
        </div>
        <div>
  				<div>Funding Opportunity</div>
					<Multiselect
						class="expander-sample"
            allValue={"All"}
						value={state.funds}
						options={props.fundingOpps}
						onChange={(opt) => { this.setState({funds: opt.parsed}) }}
					/>
        </div>
        <div>
  				<div>Mechanism Option</div>
					<Multiselect
						class="action-dd"
            allValue={"All"}
						value={state.mechs}
						options={props.mechanisms}
						onChange={(opt) => { this.setState({mechs: opt.parsed}) }}
					/>
        </div>
        <div class="text">OR</div>
        <div>
  				<div>Log Number</div>
					<TextField
						placeholder=""
						value={state.logno}
						onChange={(val) => { this.setState({logno: val}) }}
					/>
        </div>
        <div class="action-btn-container">
					<Button
						onClick={(e) => { this.formFilterFn(e) }}
					>Filter</Button>
					<Button
						onClick={(e) => {
							props.setState({
                appsFilter: () => {},
                foFilter: () => {}
              })
							props.toggleFiltering(false)
							this.setState({
								logno: "",
								programs: ["All"],
								funds: ["All"],
								mechs: ["All"]
							})
						}}
					>Clear</Button>
        </div>
			</div>
		)
	}
}
