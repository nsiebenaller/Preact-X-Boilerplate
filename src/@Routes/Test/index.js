import { h, Component } from 'preact'
import * as Shared from '@preact-ui'

const groupedMultiselectOptions = {
	"Pre-App Status": [
		{"value": "PreApp-Draft", "label": "Draft"},
		{"value": "PreApp-Submitted", "label": "Submitted"},
		{"value": "PreApp-Deleted", "label": "Deleted"},
		{"value": "PreApp-Withdrawn", "label": "Withdrawn"}],
	"Full-App Status": [
		{"value": "FullApp-Draft", "label": "Draft"},
		{"value": "FullApp-Verified", "label": "Verified"},
		{"value": "FullApp-Withdrawn", "label": "Withdrawn"},
		{"value": "FullApp-Business Official Approval Pending", "label": "Business Official Approval Pending"},
		{"value": "FullApp-Business Official Return to PI", "label": "Business Official Return to PI"},
		{"value": "FullApp-Business Official Approved", "label": "Business Official Approved"},
		{"value": "FullApp-Business Official Not Approved", "label": "Business Official Not Approved"}],
	"Funding Status": [
		{"value": "Funded", "label": "Funded"}
	]
}


export default class Test extends Component {
	constructor(props) {
		super(props)
		this.state = {
      alertOpened: false,
      autocompleteValue: "",
      dropdownValue: "",
			fileinputValue: "",
			fileinputData: null,
			gmultiValue: [],
			gValue: ""
		}
	}

  render(props, state) {

    return(
      <div>

        <h3>Alert</h3>
        <Shared.Alert
          text={'I am an Alert!'}
          opened={state.alertOpened}
          onClose={() => this.setState({alertOpened: !state.alertOpened})}
          vertical={'bottom'}
          horizontal={'left'}
        />
        <button onClick={() => this.setState({alertOpened: true})}>open alert</button>

        <hr />

        <h3>AutoComplete</h3>
        <Shared.AutoComplete
          options={["Alpha", "Beta", "Gamma", "Zeta"]}
          value={state.autocompleteValue}
          onChange={(e) => this.setState({autocompleteValue: e})}
        />

        <hr />

        <h3>Button</h3>
        <Shared.Button>Button</Shared.Button>

        <hr />

        <h3>Dropdown</h3>
        <Shared.Dropdown
          options={[{label: "Alpha", value: "Alpha"}, {label: "Beta", value: "Beta"}, {label: "Gamma", value: "Gamma"}]}
          value={state.dropdownValue}
          onChange={(e) => this.setState({dropdownValue: e.value})}
        />

				<hr />

				<h3>File Input</h3>
				<Shared.FileInput
					value={state.fileinputValue}
					onChange={(e) => {
						const fileName = e.target.value.substring(e.target.value.lastIndexOf("\\")+1)
						this.setState({fileinputValue: fileName, fileinputData: e.target.files[0]})
					}}
				/>

				<hr />

				<h3>Grouped Multiselect</h3>
				<Shared.GroupedMultiselect
					value={state.gmultiValue}
					options={groupedMultiselectOptions}
					onClick={(e) => {
						this.setState({gmultiValue: e.selected})
					}}
				/>

				<hr />

				<h3>Grouped Select</h3>
				<Shared.Groupedselect
					value={state.gValue}
					options={groupedMultiselectOptions}
					onClick={(e) => {
						console.log(e)
					}}
				/>

				<br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />

      </div>
    )
  }
}
