import { h, Component } from 'preact';
import { BrowserRouter, Route } from "react-router-dom";


export default class AsyncRoute extends Component {
  state = {
    component: null
  }
  async componentDidMount() {
    this.setState({ component: await this.props.load() })
  }

  renderLoading = () => <div>Loading...</div>;
  renderComponent = (p) => this.state.component(p);

  render(props, state) {
    return (<Route path={this.props.path} render={state.component ? this.renderComponent : this.renderLoading} />)
  }
}
