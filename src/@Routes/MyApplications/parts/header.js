import { h, Component } from 'preact'
import style from './style.css'
import { Button } from '@Shared'

const Header = (props) => (
  <div class={style.header}>
    <h1>My Applications</h1>
    <div>This page allows you to manage your applications.</div>
    <div>For programs currently accepting pre-application submissions, please start a new pre-application.</div>
    <div class={style.startBtn}>
    <Button
      onClick={() => location.href = 'eBRAP/application/newPreAppFromFundingOpp.htm'}
    >Start New Pre-Application</Button>
    </div>
  </div>
)

export default Header
