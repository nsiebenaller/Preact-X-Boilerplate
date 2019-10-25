import { h, Component } from 'preact'
import style from './style.css'
import ActionBar from './actionBar.js'
import LovAdder from './lovAdder.js'
import LovTable from './lovTable.js'
import {Table} from '@Shared'
import {getLovList} from '@Api'
import {formOptions} from '@Helpers'

export default class LOV extends Component {
  constructor(props) {
    super(props)
    this.state = {
      lovs: ["All Types"],
      status: ["All Statuses"],
      name: "",
      nameOptions: [],
      lovList: [],
      types: [],
      filter: () => {},
      filtering: false,
      newLOVName: ''
    }
  }

  componentDidMount() {
    this.getLovs()
  }

  handleSetState = (obj) => this.setState(obj)

  getLovs = async () => {
    const resp = await getLovList()
    this.setState({
      lovList: resp,
      types: formOptions(resp, 'type'),
      nameOptions: resp.map(x => x.name)
    })
  }

  formFilterFn = () => {
    const {props, state} = this
    const filterFn = (e) => {
      if(state.name === "") {
        const lovPass = (!state.lovs.includes('All Types')) ?
          (state.lovs.includes(e.type)) :
          (true)
        let statusPass = (state.status.includes('All Statuses'))
        if(state.status.includes("Active") && !state.status.includes("Deleted")) {
          statusPass = (e.isDeleted === false)
        }
        else if(!state.status.includes("Active") && state.status.includes("Deleted")) {
          statusPass = (e.isDeleted === true)
        }
        else if(state.status.includes("Active") && state.status.includes("Deleted")) {
          statusPass = true
        }

        return (lovPass && statusPass)
      }
      else {
        return e.name.includes(state.name)
      }
    }
    this.setState({
      filtering: true,
      filter: filterFn
    })
  }

  removeLOV = (id) => {
    this.setState({ lovList: this.state.lovList.filter(l => l.id !== id) })
  }

  updateLOV = (obj) => {
    this.setState({ lovList: this.state.lovList.filter(l => l.id !== obj.id).concat(obj) })
  }

  render(props, state) {
    return(
      <div>
        <h2>List of Values (LOVs)</h2>
        <ActionBar
          formFilterFn={this.formFilterFn}
          setState={this.handleSetState}
          types={state.types}
          lovs={state.lovs}
          status={state.status}
          name={state.name}
          nameOptions={state.nameOptions}
        />
        <LovAdder getLovs={this.getLovs} types={state.types} setState={this.handleSetState} />
        <LovTable
          lovList={state.filtering ? state.lovList.filter(state.filter) : state.lovList}
          types={state.types}
          setState={this.handleSetState}
          updateLOV={this.updateLOV}
          removeLOV={this.removeLOV}
          newLOVName={state.newLOVName}
        />
      </div>
    )
  }
}
