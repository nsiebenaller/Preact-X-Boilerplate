import { h, Component } from 'preact';
import style from './ActionBar.less';
import { TextField, Button } from '@Shared';

export default function ActionBar(props) {
  return(
    <div className={style['action-bar']}>
      <div>Search for an application by Log # to perform compliance actions.</div>
      <div className={style['search-bar']}>
        <div>Log Number:</div>
        <TextField
          class={style['action-field']}
          value={props.text}
          onEnter={props.doSearch}
          onChange={props.onTextChange}
        />
        <Button
          color={'#1976d2'}
          onClick={props.doSearch}
        >Search</Button>
      </div>
    </div>
  )
}
