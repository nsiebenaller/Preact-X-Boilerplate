import { h, Component } from 'preact'
import EditRow from './EditRow.js'
import Row from './Row.js'

export default function Header(props) {

  const setEditing = (type) => () => props.setState({ isEditing: type, newEmail: props[type].emailAddress });
  const setEmail = (e) => props.setState({ newEmail: e });
  const onCancel = () => props.setState({ isEditing: false, newEmail: '' });
  const isHelpdesk = isHelpdeskUser(props.user);

  return(
    <div>
      <EditRow
        label={"PI: "}
        noneText={'No post award principal investigator found'}
        value={props.principalInvestigator}
        newEmail={props.newEmail}
        isEditable={parseInt(props.userID) === parseInt(props.principalInvestigator.userId) || isHelpdesk}
        isEditing={props.isEditing === 'principalInvestigator'}
        isSaving={props.isSaving}
        onEdit={setEditing('principalInvestigator')}
        onChange={setEmail}
        onSave={props.onSave}
        onCancel={onCancel}
      />
      <EditRow
        label={"BO: "}
        noneText={'No post award business official found'}
        value={props.businessOfficial}
        newEmail={props.newEmail}
        isEditable={parseInt(props.userID) === parseInt(props.businessOfficial.userId) || isHelpdesk}
        isEditing={props.isEditing === 'businessOfficial'}
        isSaving={props.isSaving}
        onEdit={setEditing('businessOfficial')}
        onChange={setEmail}
        onSave={props.onSave}
        onCancel={onCancel}
      />
      <EditRow
        label={"Alternate Submitter: "}
        noneText={'No post award alternate submitter found'}
        value={props.alternateSubmitter}
        newEmail={props.newEmail}
        isEditable={parseInt(props.userID) === parseInt(props.alternateSubmitter.userId) || isHelpdesk}
        isEditing={props.isEditing === 'alternateSubmitter'}
        isSaving={props.isSaving}
        onEdit={setEditing('alternateSubmitter')}
        onChange={setEmail}
        onSave={props.onSave}
        onCancel={onCancel}
      />
      <Row
        label={"Log Number: "}
        value={props.logNumber}
      />
      <Row
        label={"Award Number: "}
        value={props.awardNumber}
      />
    </div>
  )
}

function isHelpdeskUser(user){
  return user.roles.some(role => role.sysCode === "HELPDESK");
}
