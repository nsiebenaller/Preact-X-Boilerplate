import { h, Component } from 'preact';
import style from './style.css'
import {
	Modal,
	Table,
	Groupedselect,
	Checkbox
} from '@Shared'
import ActionBar from './actionBar'
import Option from './option.js'
import ApplicationTable from './applicationTable.js'
import FundOppTable from './fundOppTable.js'
import {
	getOrgApps,
	runCompliance,
	concatFiles,
	deleteCompliance,
	getFundingOpportunities,
	getPrograms,
	getMechanisms
} from '@Api'
import {compAppHeaders, compFundingOppHeaders, complianceActions} from '@Static/compliance.json'
import {formOptions, getUnique} from '@Helpers/index.js'

export default class Compliance extends Component {
	constructor(props) {
		super(props)
		this.state = {
			selectedOption: "View by Funding Opportunities",
			fy: (new Date()).getFullYear(),
			fundingOpportunities: [],
			orgApps: [],
			checked: [],
			appsFilter: () => {},
			foFilter: () => {},
			filtering: false,
			status: "",
			loading: true,
			uPrograms: [],
			uFundingOpp: [],
			uMechOpts: [],
			complianceModelOpen: false,
			complianceOpts: [],
			complianceAction: ""
		}
	}
	componentDidMount() {
		this.setYear(this.state.fy)
	}

	onCheckboxClick = (obj) => {
		const { checked } = this.state
		this.setState({
			checked: checked.includes(obj) ? checked.filter(x => x !== obj) : checked.concat(obj)
		})
	}

	handleSetState = (obj) => this.setState(obj)

	setFilter = (filterFn) => this.setState({filter: filterFn})

	toggleFiltering = (val) => this.setState({filtering: val, status: ""})

	setYear = (fiscalYear) => {
		this.getAppsForYear(fiscalYear)
		this.getProgramsForYear(fiscalYear)
		this.getFundOppsForYear(fiscalYear)
		this.getMechanismsForYear(fiscalYear)
	}

	getAppsForYear = (fiscalYear) => {
		this.setState({loading: true, fy: fiscalYear})

		getOrgApps(fiscalYear)
			.then((data) => {
				this.setState({
					orgApps: data,
					loading: false,
				})
			})
	}
	getFundOppsForYear = (fiscalYear) => {
		this.setState({loading: true, fy: fiscalYear})
		getFundingOpportunities(fiscalYear)
			.then((data) => {
				this.setState({
					fundingOpportunities: data,
					loading: false,
					uFundingOpp: formOptions(data, 'fundingOpp', true),
				})
			})
	}
	getProgramsForYear = (fiscalYear) => {
		getPrograms(fiscalYear)
			.then((data) => {
				this.setState({uPrograms: formOptions(data, 'program', true)})
			})
	}
	getMechanismsForYear = (fiscalYear) => {
		getMechanisms(fiscalYear)
			.then((data) => {
				this.setState({uMechOpts: formOptions(data, 'mechanism', true)})
			})
	}

	performAction = async (opt) => {
    if (!this.state.checked.length) {
      window.alert("Please select at least one application to perform an action")
    } else {
      if (["Run Compliance Pre App", "Run Compliance Full App"].includes(opt.value)) {
        // handle compliance runs
        console.log("run compliance")
        this.setState({
          complianceModelOpen: true,
          complianceAction: opt.value
        })
      } else {
        // handle concatenate files
        console.log("concat files")
        this.handleConcatFiles(opt)
      }
    }
  }

	handleConcatFiles = async (opt) => {
		const {state} = this
		if (window.confirm(`Are you sure you want to ${opt.value}?`)) {
			let resp
			switch (opt.value) {
				case ("Concatenate Files Pre App"):
					resp = await concatFiles({
	          action: 'preapp',
	          ...(state.selectedOption === 'View by Funding Opportunities' && {
	            fundingOpportunities: state.checked
	          }),
	          ...(state.selectedOption === 'View by Applications' && {
	            lognos: state.checked
	          }),
	        })
					break
				case ("Concatenate Files Full App"):
					resp = await concatFiles({
	          action: 'preapp',
	          ...(state.selectedOption === 'View by Funding Opportunities' && {
	            fundingOpportunities: state.checked
	          }),
	          ...(state.selectedOption === 'View by Applications' && {
	            lognos: state.checked
	          }),
	        })
					break
				default:
					break
			}
			if (resp.success) {
				//console.log("success!")
				this.setState({
					checked: [],
					status: "Successfully Completed Action"
				})
			} else {
				//console.log("failure", resp)
				this.setState({
					status: "Failure to Complete Action"
				})
			}
		}
	}

  handleComplianceRun = async (action) => {
    const {state} = this
    let resp
    switch (state.complianceAction) {
      case ("Run Compliance Pre App"):
        resp = await runCompliance({
          action: 'preapp',
          ...(state.selectedOption === 'View by Funding Opportunities' && {
            fundingOpportunities: state.checked
          }),
          ...(state.selectedOption === 'View by Applications' && {
            lognos: state.checked
          }),
          override: state.complianceOpts
        })
        break
      case ("Run Compliance Full App"):
        resp = await runCompliance({
          action: 'fullapp',
          ...(state.selectedOption === 'View by Funding Opportunities' && {
            fundingOpportunities: state.checked
          }),
          ...(state.selectedOption === 'View by Applications' && {
            lognos: state.checked
          }),
          override: state.complianceOpts
        })
        break
      default:
        break
    }
		if (resp.success) {
			//console.log("success!")
			this.setState({
				checked: [],
				status: "Successfully Completed Action"
			})
		} else {
			//console.log("failure", resp)
			this.setState({
				status: "Failure to Complete Action"
			})
		}
  }


	render(props, state) {
		return(
			<div class={style.tabContainer}>
				<ComplianceConfirmation
					open={state.complianceModelOpen}
					complianceOpts={state.complianceOpts}
					setState={this.handleSetState}
					onClose={(e) => this.setState({complianceModelOpen: false, complianceOpts: [], complianceAction: ""})}
					onConfirm={this.handleComplianceRun}
				/>
				<ActionBar
					setState={this.handleSetState}
					toggleFiltering={this.toggleFiltering}
					setYear={this.setYear}
					programs={state.uPrograms}
					fundingOpps={state.uFundingOpp}
					mechanisms={state.uMechOpts}
				/>
				<Option
          selectedOption={state.selectedOption}
          options={["View by Funding Opportunities", "View by Applications"]}
          onChange={(e) => this.setState({selectedOption: e, checked: []})}
        />
				<p class={style.compMsg}>Select application by clicking the check box next to the Log # to perform compliance actions.</p>
				{state.status !== "" && <b>{state.status}</b>}
				{state.filtering && <b>*results filtered*</b>}
				{
					state.selectedOption === "View by Applications" &&
					<ApplicationTable
						data={(state.filtering) ? (state.orgApps.filter(state.appsFilter)) : (state.orgApps)}
						checked={state.checked}
						onChange={this.onCheckboxClick}
						performAction={this.performAction}
					/>
				}
				{
					state.selectedOption === "View by Funding Opportunities" &&
					<FundOppTable
						data={(state.filtering) ? (state.fundingOpportunities.filter(state.foFilter)) : (state.fundingOpportunities)}
						checked={state.checked}
						onChange={this.onCheckboxClick}
						performAction={this.performAction}
					/>
				}
				<Status
					loading={state.loading}
					noData={(state.selectedOption === "View by Funding Opportunities") ?
						state.fundingOpportunities.length === 0 :
						state.orgApps.length === 0}
					fiscalYear={state.fy}
				/>
			</div>
		)
	}
}

const Status = (props) => (
	<div>
		{props.loading &&
			<div class={style.statusText}>loading...</div>}
		{!props.loading && props.noData &&
			<div class={style.statusText}>No Data for {props.fiscalYear} Fiscal Year</div>}
	</div>
)

const ComplianceConfirmation = (props) => (
	<Modal
		open={props.open}
		onClose={props.onClose}
		onConfirm={props.onConfirm}
		title={"Compliance Run Confirmation"}
		confirmText={'Run Compliance'}
		content={
			<div>
				<div>
					 The Application(s) for the selected funding opportunities could have existing compliance data.
					 If you would like to override any of the following compliance data elements,
					 please select the corresponding check box(s) otherwise leave it blank and continue
					 with Run Compliance.
			 </div>
			 <br />
			 <div>
			 		<Checkbox
						onClick={(e) => {
							props.setState({complianceOpts:
								props.complianceOpts.includes('notes') ?
								props.complianceOpts.filter(x => x !== 'notes') :
								props.complianceOpts.concat('notes')
							})
						}}
						checked={props.complianceOpts.includes('notes')}
						label={'notes'}
					/>
					<Checkbox
						onClick={(e) => {
							props.setState({complianceOpts:
								props.complianceOpts.includes('files') ?
								props.complianceOpts.filter(x => x !== 'files') :
								props.complianceOpts.concat('files')
							})
						}}
						checked={props.complianceOpts.includes('files')}
						label={'files'}
					/>
					<Checkbox
						onClick={(e) => {
							props.setState({complianceOpts:
								props.complianceOpts.includes('data') ?
								props.complianceOpts.filter(x => x !== 'data') :
								props.complianceOpts.concat('data')
							})
						}}
						checked={props.complianceOpts.includes('data')}
						label={'data'}
					/>
			 </div>
		 </div>
	 }
	/>
)
