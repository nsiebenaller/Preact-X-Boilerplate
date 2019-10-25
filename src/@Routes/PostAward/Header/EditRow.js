import { h, Component } from 'preact'
import { TextField } from '@Shared'
import style from './EditRow.less'
import EmailEditHelper from './EmailEditHelper.js'

export default function EditRow(props) {
  if(props.isEditing) {
    return(
      <div class={style['header']}>
        <b>{props.label}</b>
        <div class="flex-row child-Rbuff-10 vert-align">
          <div>{props.value.name}</div>
          <TextField
            value={props.newEmail}
            onChange={props.onChange}
            disabled={props.isSaving}
          />
          {
            props.isSaving && (<div>Saving...</div>)
          }
          {
            !props.isSaving &&
            (
              <div class="flex-row child-Rbuff-10 vert-align">
                <div
                  class={style['editable']}
                  onClick={props.onSave}
                >Save</div>
                <div
                  class={style['editable']}
                  onClick={props.onCancel}
                >Cancel</div>
              </div>
            )
          }
        </div>
      </div>
    )
  }
  else {
    return(
      <div class={style['header']}>
        <b>{props.label}</b>
        <div class="flex-row child-Rbuff-10 vert-align">
          {
            props.value.name === '' &&
            (
              <div>{props.noneText}</div>
            )
          }
          {
            props.value.name !== '' &&
            <div>{props.value.name}</div>
          }
          {
            props.value.name !== '' &&
            <div>({props.value.emailAddress})</div>
          }
          {
            props.isEditable &&
            (
              <EmailEditHelper>
                <div
                  class={style['editable']}
                  onClick={props.onEdit}
                >Edit</div>
              </EmailEditHelper>
            )
          }
        </div>
      </div>
    )
  }
}
