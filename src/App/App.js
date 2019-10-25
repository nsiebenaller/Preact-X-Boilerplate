import { h, Component } from 'preact';
import * as API from '@Api'
import { BrowserRouter, Route } from "react-router-dom";
import AsyncRoute from './AsyncRoute.js';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      isLoading: false,
      counter: 0
    }
  }

  async componentDidMount() {
    const user = await API.getUser();
    this.setState({ user: user });
  }

  renderHeader = async (p) => {
    const Header = await import("./Header/Header.js").then(mod => mod.default);
    return (p) => (
      <Header {...p} options={this.state.user.menus} setIsLoading={this.setIsLoading} />
    )
  }
  renderSysAdmin = async () => {
    const SysAdmin = await import("@Routes/SysAdmin/SysAdmin.js").then(mod => mod.default);
    return (p) => (
      <SysAdmin
        user={this.state.user}
        selTab={p.match.params.selTab || "sysAdminSummaryTab.htm"}
        router={p}
      />
    )
  }
  renderPostAward = async () => {
    const PostAward = await import("@Routes/PostAward/PostAward.js").then(mod => mod.default);
    return (p) => (
      <PostAward
        user={this.state.user}
        selTab={"TechnicalReports.htm"}
        router={p}
      />
    )
  }
  renderMyOrganization = async () => {
    const MyOrganization = await import("@Routes/MyOrganization/MyOrganization.js").then(mod => mod.default);
    return (p) => (
      <MyOrganization
        user={this.state.user}
        selTab={p.match.params.selTab || "MyOrgApplications.htm"}
        router={p}
      />
    )
  }

  render(props, state) {

    if(state.loading) return(<div>Loading...</div>);

    if(!state.user) {
      return(
        <div id="app">
          <div>Loading App...</div>
        </div>
      )
    }

    return(
      <div id="app">
        <BrowserRouter>

          <AsyncRoute path="/" load={this.renderHeader} />

          {/* SYS ADMIN */}
          <AsyncRoute path="/eBRAP/SysAdmin.htm" load={this.renderSysAdmin} />
          <AsyncRoute path="/eBRAP/SysAdmin/:selTab" load={this.renderSysAdmin} />

          {/* POST AWARD */}
          <AsyncRoute path="/eBRAP/PostAward/TechnicalReports.htm" load={this.renderPostAward} />
          <AsyncRoute path="/eBRAP/Helpdesk/PostAward/TechnicalReports.htm" load={this.renderPostAward} />

          {/* MY ORGANIZATION */}
          <AsyncRoute path="/eBRAP/org/MyOrganizations/:selTab" load={this.renderMyOrganization} />
          <AsyncRoute path="/eBRAP/org/:myOrgPage?/:param?" load={this.renderMyOrganization} />

        </BrowserRouter>
      </div>
    )
  }
}
