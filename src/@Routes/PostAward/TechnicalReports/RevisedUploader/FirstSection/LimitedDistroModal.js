import { h, Component } from 'preact'
import { HelpOutline } from '@Icons'
import { Modal, Button } from '@Shared'
import style from './LimitedDistroModal.less'

export default class HelpModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    }
  }

  toggle = (open) => (e) => this.setState({ open: open });

  render(props, state) {
    return(
      <div>
        <HelpOutline
          class="pointer"
          onClick={this.toggle(true)}
        />
        <Modal
          modalClass={style['modal-LD']}
          open={state.open}
          title={'Limited Distribution'}
          content={(<Content />)}
          actions={(<Button class={style['modal-close']} onClick={this.toggle(false)}>Close</Button>)}
          onClose={this.toggle(false)}
        />
      </div>
    )
  }
}

function Content() {
  return(
    <div>
      <ol>
        <li><b>DISTRIBUTION STATEMENT A:</b> Approved for public release; distribution is unlimited</li>
        <ul>
          <li><b>a.</b> This statement may be used only on unclassified technical documents that have been cleared for public release by competent authority in accordance with DoD directive 5230.9. Technical documents resulting from contracted fundamental research efforts will normally be assign Distribution Statement A, except for those rare and exceptional circumstances where there is a high likelihood of disclosing performance characteristics of military systems, or of manufacturing technologies that are unique and critical to Defense, and agreement on this situation has been recorded in the contract or grant.</li>
          <li>b. Technical documents with this statement may be made available or sold to the public and foreign nationals, companies, and governments, including adversary governments, and may be exported.</li>
        </ul>
        <br />
        <li><b>DISTRIBUTION STATEMENT B:</b> Distribution authorized to U.S. Government agencies only (fill in reason) (date of determination). Other requests for this document shall be referred to (insert controlling DoD office)</li>
        <ul>
          <li><b>a.</b> This statment may be used on unclassified technical documents.</li>
          <li><b>b.</b> Reasons for assigning distribution statement B include: Foreign Government Information - To protect and limit distribution in accordance with the desired of the foreign government that furnished the technical information. Information of this type normally is classified at the CONFIDENTIAL level or higher in accordance with DoD 5200.1-R. Proprietary Information - To protect information not owned by the U.S. Government and protected by a contractors "limited rights" statement, or recieved with the understanding that it not be routinely transmitted outside the U.S. Government.</li>
        </ul>
        <br />
        <li><b>DISTRIBUTION STATEMENT for SBIR-STTR:</b> Distribution authorized to U.S. Government Agencies only, Proprietary Information. The data delivered to the Government is marked with the DBIR Data Rights Notice; the Government may use the data for government purposes only, and cannot disclose the data outside the Government (except for use by support contractors) for a specified period of time.</li>
        <br />
        <li><b>DISTRIBUTION STATEMENT for Military Interdepartmental Purchase Request(MIPR):</b> use the cover for either A or B depending on the material in the report. Cover pages and Report Documentation Page (SF298) for each of those can be found at: <a href="https://mrdc.amedd.army.mil/index.cfm/resources/researcher_resources/reporting/technical">https://mrdc.amedd.army.mil/index.cfm/resources/researcher_resources/reporting/technical</a></li>
      </ol>

    </div>
  )
}
