import { h, Component } from 'preact'
import { CheckCircleOutline, Cancel } from '@Icons'
import style from './style.css'
import {Icon} from '@Shared'

const PasswordValid = (props) => {
  const charLimitPass = props.text.length >= 15
  const noSpacesPass = !props.text.includes(" ") && props.text.length
  const uppercasePass = (props.text.match(/[A-Z]/g) || []).length >= 2
  const lowercasePass = (props.text.match(/[a-z]/g) || []).length >= 2
  const numPass = (props.text.match(/\d/g) || []).length >= 2
  const specialPass = (props.text.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g) || []).length >= 2
  const minimumPass = (uppercasePass && lowercasePass && numPass && specialPass)

  return(
    <div class={style.passValid}>
      <div>
      {
        (charLimitPass) ?
        (
          <CheckCircleOutline
            class={charLimitPass || !props.text.length ? style.tinyIco : style.tinyIcoErr}
          />
        ) :
        (
          <Cancel
            class={charLimitPass || !props.text.length ? style.tinyIco : style.tinyIcoErr}
          />
        )
      } Must be at least 15 characters
      </div>
      <div>
      {
        (noSpacesPass) ?
        (
          <CheckCircleOutline
            class={noSpacesPass || !props.text.length ? style.tinyIco : style.tinyIcoErr}
          />
        ) :
        (
          <Cancel
            class={noSpacesPass || !props.text.length ? style.tinyIco : style.tinyIcoErr}
          />
        )
      } Must be have no spaces
      </div>
      <div>
      {
        (minimumPass) ?
        (
          <CheckCircleOutline
            class={minimumPass || !props.text.length ? style.tinyIco : style.tinyIcoErr}
          />
        ) :
        (
          <Cancel
            class={minimumPass || !props.text.length ? style.tinyIco : style.tinyIcoErr}
          />
        )
      } Must contain at least two of the following:
      </div>
      <div class={uppercasePass || !props.text.length ? style.indent : style.indentErr}>&#9702; uppercase letters</div>
      <div class={lowercasePass || !props.text.length ? style.indent : style.indentErr}>&#9702; lowercase letters</div>
      <div class={numPass || !props.text.length ? style.indent : style.indentErr}>&#9702; numbers (0-9)</div>
      <div class={specialPass || !props.text.length ? style.indent : style.indentErr}>&#9702; special characters</div>
    </div>
  )
}

export default PasswordValid
