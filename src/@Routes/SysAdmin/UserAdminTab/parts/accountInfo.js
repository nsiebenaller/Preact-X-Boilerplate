import { h, Component } from 'preact'
import { CheckCircleOutline, Cancel } from '@Icons'
import style from './style.css'
import {
  TextField,
  Dropdown,
  Icon,
  Multiselect,
} from '@Shared'
import PasswordValid from './passwordValid.js'
import {roleOptions} from '@Static/userAdmin.json'


const securityQuestions = [
  {
    value: 'In what city were you born?',
    label: 'In what city were you born?'
  },
  {
    value: 'What is the name of your favorite pet?',
    label: 'What is the name of your favorite pet?'
  },
  {
    value: 'What is the name of your highschool?',
    label: 'What is the name of your highschool?'
  }
]

const AccountInfo = (props) => (
  <div class={style.infoContainer}>
    <div class={style.header}>Account Info</div>
    <TextField
      label={'First Name'}
      value={props.firstname}
      onChange={(e) => props.setState({firstname: e})}
      fullWidth
    />
    <TextField
      label={'Last Name'}
      value={props.lastname}
      onChange={(e) => props.setState({lastname: e})}
      fullWidth
    />
    <TextField
      label={'User Name'}
      value={props.username}
      onChange={(e) => props.setState({username: e})}
    />
    <TextField
      label={'Password'}
      value={props.password}
      onChange={(e) => props.setState({password: e})}
      password
    />
    <PasswordValid text={props.password} />
    <TextField
      label={'Confirm Password'}
      value={props.confirmPassword}
      onChange={(e) => props.setState({confirmPassword: e})}
      password
    />
    <div class={style.passValid}>
      <div>
        {
          (props.password === props.confirmPassword && props.password.length) ?
          (
            <CheckCircleOutline
              class={(props.password === props.confirmPassword) ? style.tinyIco : style.tinyIcoErr}
            />
          ) :
          (
            <Cancel
              class={(props.password === props.confirmPassword) ? style.tinyIco : style.tinyIcoErr}
            />
          )
        }Passwords must match
      </div>
    </div>
    <Dropdown
      label={'Security Question'}
      class={style.secQuesDD}
      value={props.securityQuestion}
      onChange={(e) => props.setState({securityQuestion: e.value})}
      options={securityQuestions}
    />
    <TextField
      label={'Security Answer'}
      value={props.securityAnswer}
      onChange={(e) => props.setState({securityAnswer: e})}
    />
    <Dropdown
      label={'Organization Role'}
      value={props.orgRole}
      options={props.orgRoles.map(x => ({...x, value: x.name, label: x.name}))}
      onChange={(e) => props.setState({ orgRole: e.value })}
    />
    <Dropdown
      label={'Compliance Role'}
      value={props.compRole}
      options={[{ value: 'None', label: 'None' }].concat(props.compRoles.map(x => ({...x, value: x.name, label: x.name})))}
      onChange={(e) => props.setState({ compRole: e.value })}
    />
    <Multiselect
      label={'System Role(s)'}
      options={props.sysRoles.map(x => ({...x, value: x.name, label: x.name}))}
      value={props.systemRoles}
      onChange={(e) => {
        let arr = props.systemRoles
        if(props.systemRoles.includes(e.value)) {
          arr = arr.filter(x => x !== e.value)
        }
        else {
          arr = arr.concat([e.value])
        }
        props.setState({
          systemRoles: arr
        })
      }}
    />
  </div>
)

export default AccountInfo
