import { h, Component } from 'preact'
import style from './style.css'
import { CheckCircleOutline, Cancel } from '@Icons'
import {
  TextField,
  Dropdown,
  Icon,
} from '@Shared'
import {addressTypeOptions} from '@Static/userAdmin.json'
import {countries} from '@Static/countries.json'
import {states} from '@Static/states.json'
import {formOptions} from '@Helpers'

const ContactInfo = (props) => (
  <div class={style.infoContainer}>
    <div class={style.header}>Contact Info</div>
    <div>
      <div>Address Type</div>
      <Dropdown
        class={style.minDD}
        options={addressTypeOptions}
        value={props.addressType}
        onChange={(e) => props.setState({addressType: e.value})}
      />
    </div>
    <TextField
      class={style.largeDD}
      label={'Address Line 1'}
      value={props.addressLine1}
      onChange={(e) => props.setState({addressLine1: e})}
    />
    <TextField
      class={style.largeDD}
      label={'Address Line 2 (Optional)'}
      value={props.addressLine2}
      onChange={(e) => props.setState({addressLine2: e})}
    />
    <div class={style.subContainer}>
      <Dropdown
        class={style.expandedDD}
        label={'Country'}
        value={props.country}
        options={formOptions(props.countries, 'name')}
        onChange={(e) => props.setState({country: e.label})}
      />
      <Dropdown
        class={style.mediumDD}
        label={'State'}
        value={props.state}
        options={formOptions(props.states, 'name')}
        onChange={(e) => props.setState({state: e.label})}
      />
      <TextField
        label={'City'}
        value={props.city}
        onChange={(e) => props.setState({city: e})}
      />
      <TextField
        label={'Zip'}
        value={props.zip}
        onChange={(e) => props.setState({zip: e.replace(/\D/g,'')})}
      />
    </div>

    <TextField
      label={'Phone'}
      value={props.phone}
      onChange={(e) => props.setState({phone: e})}
    />
    <TextField
      label={'Email'}
      value={props.email}
      onChange={(e) => props.setState({email: e})}
    />
    <TextField
      label={'Confirm Email'}
      value={props.confirmEmail}
      onChange={(e) => props.setState({confirmEmail: e})}
    />
    <div class={style.passValid}>
      <div>
        {
          (props.email === props.confirmEmail && props.email.length) ?
          (
            <CheckCircleOutline
              class={(props.email === props.confirmEmail) ? style.tinyIco : style.tinyIcoErr}
            />
          ) :
          (
            <Cancel
              class={(props.email === props.confirmEmail) ? style.tinyIco : style.tinyIcoErr}
            />
          )
        }Emails must match
      </div>
    </div>
  </div>
)

export default ContactInfo
