import { h, Component } from 'preact';
import * as Api from '@Api';
import style from './ComplianceTab.less';
import ActionBar from './ActionBar.js';
import AppTable from './AppTable.js';
import ComplianceSection from './ComplianceSection.js';

export default class ComplianceTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      applications: [],
      text: '',
      loading: false,
      error: false,
      searchComplete: false,
      lastSearchedText: '',
      running: null,
      selectedApp: null,
      message: null
    }
  }

  doSearch = async () => {
    this.setState({ loading: true, error: false });
    const { state } = this;
    if(!state.text || state.text.length < 3) {
      window.alert("Log number must be at least 3 characters to search");
      return;
    }
    try {
      const apps = await Api.getComplianceApplications(state.text);
      this.setState({ applications: apps, searchComplete: true, lastSearchedText: state.text, loading: false });
    }
    catch(e) {
      window.alert("Error fetching applications");
      this.setState({ loading: false, error: true });
    }
  }

  onTextChange = (text) => this.setState({ text: text });
  onSelectApp = (app) => this.setState({ selectedApp: app });
  onRunCompliance = (stage) => {
    const { state } = this;
    console.log("run compliance on ", stage, state.selectedApp.id);
    this.setState({ running: stage })
  }
  onDeleteCompliance = async (stage) => {
    const { state } = this;
    const text = `Are you sure you'd like to delete compliance data AND files for ${state.selectedApp.logNo} for the ${stage === "DEL-PRE" ? "Pre App" : "Full App"} stage?`
    if(window.confirm(text)) {
      this.setState({ running: stage });
      try {
        let promise;
        if(stage === "DEL-PRE") {
          promise = Api.deletePreAppCompliance(state.selectedApp.id);
        }
        else if(stage === "DEL-FULL") {
          promise = Api.deleteFullAppCompliance(state.selectedApp.id);
        }
        const resp = await promise;
        if(resp.success) {
          const newApp = { ...state.selectedApp }
          if(stage === "DEL-PRE") {
            newApp.preApp.status = null;
          }
          else if(stage === "DEL-FULL") {
            newApp.fullApp.status = null;
          }
          this.setState({ running: null, message: "Successfully deleted compliance!", selectedApp: newApp })
        }
        else {
          this.setState({ running: null, message: "Error deleting compliance" });
        }
      }
      catch(e) {
        window.alert("Error deleting compliance");
        this.setState({ running: null, message: "Error deleting compliance" });
      }
      setTimeout(() => this.setState({ message: null }), 5000);
    }
  }


  render(props, state) {
    return(
      <div className={style['compliance-tab']}>
        <ActionBar text={state.text} onTextChange={this.onTextChange} doSearch={this.doSearch} />
        {
          state.searchComplete &&
          <div className={style['main']}>
            <AppTable
              applications={state.applications}
              searchComplete={state.searchComplete}
              lastSearchedText={state.lastSearchedText}
              onSelectApp={this.onSelectApp}
              selectedApp={state.selectedApp}
            />
            <ComplianceSection
              selectedApp={state.selectedApp}
              running={state.running}
              message={state.message}
              onRunCompliance={this.onRunCompliance}
              onDeleteCompliance={this.onDeleteCompliance}
            />
            {
              !state.selectedApp &&
              <div className={style['prompt']}><div>Select an application from the table</div></div>
            }
          </div>
        }
        {
          state.loading &&
          <div>Searching for applications...</div>
        }
        {
          state.error &&
          <div>Error occurred when searching applications.</div>
        }
      </div>
    )
  }
}
