import { h, Component } from 'preact'
import style from './style.css'
import Icon from '../Icon'

function formGroupRowData(apps, group) {
  const uniqueTop = apps.map(a => a[group]).filter((val, idx, self) => self.indexOf(val) === idx)
  const groupTop = uniqueTop.map(e => ({value: e, apps: apps.filter(a => a[group] === e) }))
  return groupTop
}

export default class TreeTable extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selGroups: props.groups.reduce((acc, curr) => ({...acc, [curr]: ""}),{}),
    }
  }

  setVal = (obj) => {this.setState(obj)}

  renderHeaders = () => {
    const {props, state} = this
    return(
      <div class={`${style.headerRow}`}>
        {
          props.headers.map((head) => (
            <div>{head}</div>
          ))
        }
      </div>
    )
  }

  renderBody = () => {
    const {props, state} = this
    const groupData = formGroupRowData(props.data, props.groups[0])
    const keys = Object.keys(props.customTree)
    return(
      groupData.map((e) => {
        return(
          <GroupRow
            indent={0}
            setState={this.setVal}
            selGroups={state.selGroups}
            groupOrder={(keys.includes(e.value)) ? (props.customTree[e.value]) : props.groups.slice(1)}
            data={e}
            group={props.groups[0]}
            colFn={props.colFn}
          />
        )
      })
    )
  }

  render(props, state) {
    return(
      <div>
        {this.renderHeaders()}
        {this.renderBody()}
      </div>
    )
  }
}

const GroupRow = (props) => {
  const {group, groupOrder, data, indent, selGroups, setState, colFn} = props
  const groupData = formGroupRowData(data.apps, groupOrder[0])
  const indentVal = indent + 40
  const isGroupSelected = selGroups[group] === data.value
  const styleCell = {"paddingLeft": indentVal+"px"}
  const styleRow = isGroupSelected ? {color: "#03a9f4"} : {}
  return(
    <div>
      <div
        class={`${style.bodyRow}`}
        style={styleRow}
        onClick={() => {
          setState({selGroups: {
            ...selGroups,
            ...groupOrder.reduce((acc, curr) => ({...acc, [curr]: ""}), {}),
            ...{[group]: (selGroups[group] === data.value) ? "" : data.value}} })
        }}
      >
        <div style={styleCell}>
          {data.value}
          {groupOrder.length > 0 && <Icon icon={(isGroupSelected) ? 'arrow_drop_down' : 'arrow_right'}/>}
        </div>
        {
          colFn.map((fn) => (<div>{fn(data.apps)}</div>))
        }
      </div>
      {
        groupOrder.length > 0 && isGroupSelected && groupData.map((e) => (
          <GroupRow
            indent={indentVal}
            setState={setState}
            selGroups={selGroups}
            groupOrder={groupOrder.slice(1)}
            data={e}
            group={groupOrder[0]}
            colFn={colFn}
          />
        ))
      }
    </div>
  )
}
