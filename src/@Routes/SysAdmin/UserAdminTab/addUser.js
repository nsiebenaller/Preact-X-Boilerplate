import { h, Component } from 'preact'
import style from './style.css'
import {Button} from '@Shared'
import { Clear } from '@Icons'
import AccountInfo from './parts/accountInfo.js'
import ContactInfo from './parts/contactInfo.js'
import { createUser } from '@Api'

const isPasswordValid = (pass) => {
  const charLimitPass = pass.length >= 15
  const noSpacesPass = !pass.includes(" ") && pass.length
  const uppercasePass = (pass.match(/[A-Z]/g) || []).length >= 2
  const lowercasePass = (pass.match(/[a-z]/g) || []).length >= 2
  const numPass = (pass.match(/\d/g) || []).length >= 2
  const specialPass = (pass.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g) || []).length >= 2
  return (uppercasePass && lowercasePass && numPass && specialPass)
}

const validatePasses = (passes) => {
  const response = {
    valid: true,
    texts: []
  }
  passes.forEach((e) => {
    if(e !== '') {
      response.valid = false
      response.texts.push(e)
    }
  })
  return response
}

export default class AddUser extends Component {
  constructor(props) {
    super(props)

    this.state = {
      firstname: '',
      lastname: '',
      username: '',
      password: '',
      confirmPassword: '',
      securityQuestion: '',
      securityAnswer: '',
      orgRole: '',
      compRole: 'None',
      systemRoles: [],
      addressType: '',
      addressLine1: '',
      addressLine2: '',
      country: 'United States of America',
      state: '',
      city: '',
      zip: '',
      phone: '',
      email: '',
      confirmEmail: '',
      showErrorDialog: false,
      errorTexts: []
    }
  }

  determineRoles = () => {
    const { props, state } = this
    const roleIDs = []

    const orgRole = props.orgRoles.find(r => r.name === state.orgRole)
    const compRole = props.compRoles.find(r => r.name === state.compRole)
    const sysRoleIDs = state.systemRoles.map(r => props.sysRoles.find(x => x.name === r).id)

    if(orgRole) roleIDs.push(orgRole.id)
    if(compRole) roleIDs.push(compRole.id)

    return sysRoleIDs.concat(roleIDs)
  }

  determineCountry = () => {
    const {props, state} = this
    const country = props.countries.find(x => x.name === state.country)
    return country.id
  }

  determineState = () => {
    const {props, state} = this
    const sel = props.states.find(x => x.name === state.state)
    return sel.id
  }

  handleSetState = (obj) => this.setState(obj)

  handleSave = async () => {
    const {state} = this
    //Validation
    const passes = []
    passes.push( state.firstname !== '' ? '' : 'You must enter a first name' )
    passes.push( state.lastname !== '' ? '' : 'You must enter a last name' )
    passes.push( state.username !== '' ? '' : 'You must enter a username' )
    passes.push( !state.username.includes(' ') ? '' : 'Username must not include spaces' )
    passes.push( isPasswordValid(state.password) ? '' : 'Password does not meet minimum criteria' )
    passes.push( state.password === state.confirmPassword ? '' : 'Password do not match' )
    passes.push( state.securityQuestion !== '' ? '' : 'Please select a security question' )
    passes.push( state.securityAnswer !== '' ? '' : 'You must enter a security answer' )
    passes.push( state.addressType !== '' ? '' : 'You must enter an address type' )
    passes.push( state.addressLine1 !== '' ? '' : 'You must enter an address line 1' )
    passes.push( state.state !== '' ? '' : 'Please select a state' )
    passes.push( state.city !== '' ? '' : 'You must enter a city' )
    passes.push( state.zip !== '' ? '' : 'You must enter a zip' )
    passes.push( state.phone !== '' ? '' : 'You must enter a phone' )
    passes.push( state.email !== '' ? '' : 'You must enter an email' )
    passes.push( state.confirmEmail === state.email ? '' : 'Emails do not match' )
    passes.push( state.orgRole !== '' ? '' : 'You must select an Organization Role' )
    passes.push( state.systemRoles.length > 0 ? '' : 'You must select at least one System Role' )
    const validity = validatePasses(passes)
    document.getElementById('app').scrollTop = 0
    if(validity.valid) {
      this.setState({showErrorDialog: false})
      const {showErrorDialog, errorTexts, ...props} = this.state

      const roleIDs = this.determineRoles()
      const countryID = this.determineCountry()
      const stateID = this.determineState()

      const request = {
        id: null,
        addressLine1: state.addressLine1,
        addressLine2: state.addressLine2,
        addressType: state.addressType,
        city: state.city,
        confirmEmail: state.confirmEmail,
        confirmPassword: state.confirmPassword,
        country: countryID,
        email: state.email,
        firstname: state.firstname,
        lastname: state.lastname,
        password: state.password,
        phone: state.phone,
        roles: roleIDs,
        securityAnswer: state.securityAnswer,
        securityQuestion: state.securityQuestion,
        state: stateID,
        username: state.username,
        zip: state.zip
      }
      console.log("REQUEST:: ", request)
      let resp = {success: false}
      try {
        resp = await createUser(request)
      }
      catch(e) {
        console.log("ERR")
        this.setState({showErrorDialog: true, errorTexts: ['Error Saving User (this username may be in use already)']})
        return
      }

      if(!resp.success) {
        console.log("ERR RESPONSE: ",resp)
        this.setState({showErrorDialog: true, errorTexts: ['Error Saving User']})
        return
      }
      else {
        window.alert("User Created!")
        this.setState({
          firstname: '',
          lastname: '',
          username: '',
          password: '',
          confirmPassword: '',
          securityQuestion: '',
          securityAnswer: '',
          role: [],
          addressType: '',
          addressLine1: '',
          addressLine2: '',
          country: 'United States',
          state: '',
          city: '',
          zip: '',
          phone: '',
          email: '',
          confirmEmail: '',
          showErrorDialog: false,
          errorTexts: []
        })
      }
    }
    else {
      this.setState({showErrorDialog: true, errorTexts: validity.texts})
    }


  }

  render(props, state) {
    return(
      <div>
        <ValidityHeader
          show={state.showErrorDialog}
          texts={state.errorTexts}
          setState={this.handleSetState}
        />
        <div class={style.redText}>All fields are required unless marked "Optional"</div>
        <div class={style.addUser}>
          <AccountInfo setState={this.handleSetState} {...state} {...props} />
          <ContactInfo setState={this.handleSetState} {...state} {...props} />
        </div>
        <div class={style.actionRow}>
          <Button
            onClick={this.handleSave}
          >Save</Button>
        </div>
      </div>
    )
  }
}

const ValidityHeader = (props) => {
  return(
    <div class={`${style.validHead} ${props.show ? '' : style.hide}`}>
      <Clear
        class={style.errClose}
        icon={'clear'}
        onClick={() => props.setState({showErrorDialog: false})}
      />
      <ul>
      {
        props.texts.map((text) => (<li>{text}</li>))
      }
      </ul>
    </div>
  )
}
