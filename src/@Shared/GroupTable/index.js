import { h, Component } from 'preact'

export default class GroupTable extends Component {

  constructor(props) {
    super(props)

    this.state = {
      selected: props.selected ? props.selected : -1
    }
  }

  componentWillReceiveProps(nextProps, nextState) {
    if(nextProps.selected !== this.state.selected && this.state.selected === -1) {
      this.setState({ selected: nextProps.selected })
    }
  }

  handleClick = (id) => {
    this.setState({ selected: this.state.selected === id ? -2 : id })
  }

  renderBody = () => {
    const Parent = this.props.parent
    const body = this.props.data.map((parent, idx) =>
      (this.state.selected === parent.id) ?
        (this.renderChildren(parent)) :
        (<Parent key={`parent-${idx}`} row={parent} onClick={this.handleClick} />))
    return body
  }

  renderChildren = (parent) => {
    if(parent === null || parent === undefined) return null
    const Child = this.props.child
    const Parent = this.props.parent
    const rows = [<Parent row={parent} selected onClick={this.handleClick} />]
    parent[this.props.childProperty].forEach((child, idx) => rows.push(<Child key={`child-${idx}`} row={child} parent={parent} />))
    return rows
  }

  render(props, state) {
    return(
      <div>
        <div class={(props.class ? props.class : "")}>
          {this.props.header()}
          {this.renderBody()}
        </div>
      </div>
    )
  }
}
