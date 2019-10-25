import { h, Component } from 'preact'
import style from './style.css'
import {
  Multiselect,
  TextField,
  Button,
  AutoComplete
} from '@Shared'
import {
  lovStatuses,
  lovTypes
} from '@Static/LOV.json'

const ActionBar = (props) => {
  return(
    <div class={style.lovActionBar}>
      <Multiselect
        label={'LOV Type*'}
        class={style.lovOption}
        value={props.lovs}
        options={[{value: "All Types", label: "All Types"}].concat(props.types)}
        allValue={'All Types'}
        onChange={(opt) => { props.setState({lovs: opt.parsed}) }}
      />
      <Multiselect
        label={'Status'}
        class={style.lovOption}
        value={props.status}
        options={lovStatuses}
        allValue={'All Statuses'}
        onChange={(opt) => { props.setState({status: opt.parsed}) }}
      />
      <div class={style.lovText}>OR</div>
      <AutoComplete
        label={'Name Contains'}
        value={props.name}
        options={props.nameOptions}
        onChange={(val) => { props.setState({name: val}) }}
      />
      <div class={style.lovActions}>
        {
          /*
          <Button
            onClick={(e) => {
              props.setState({
                filter: null,
                filtering: false,
                lovs: ["All Types"],
                status: ["All Statuses"],
                name: "",
              })
            }}
          >Clear</Button>
          */
        }
        <Button
          onClick={(e) => { props.formFilterFn() }}
        >Search</Button>

      </div>
    </div>
  )
}

export default ActionBar
