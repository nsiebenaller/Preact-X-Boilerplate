import { h, Component } from 'preact'
import style from './FileUploader.less';
import {
  Dropdown,
  TextField,
  FileInput,
  Button,
} from '@Shared'
import { formOptions } from '@Helpers/index.js'
import StatusBar from './StatusBar.js';

function getFileExtension(filename) {
  return filename.substr(filename.lastIndexOf('.') + 1);
}

export default function FileUploader(props) {

  const onFileInput = (e) => {
    if(e.target.value === '') {
      props.setState({
        file: '',
        fileData: null,
      })
      document.getElementById("upload").value = ''
      return
    }
    const fileType = getFileExtension(e.target.value).toUpperCase()
    if(fileType !== 'PDF') {
      document.getElementById("upload").value = ''
      window.alert("SF-425 files must be in PDF format.")
      return
    }
    props.setState({
      file: e.target.value,
      fileData: e.target.files[0]
    })
  }

  return(
    <div>
      <b>Upload New File</b>
      <StatusBar
        status={props.status}
        statusColor={props.statusColor}
        onClose={() => props.setState({ status: '' })}
      />
      <div class={style['action-box']}>
        <div class={style['action-field']}>
          <div>Type*:</div>
          <Dropdown
            value={props.type}
            options={formOptions(props.orgFileTypes, 'name')}
            onChange={(e) => { props.setState({type: e.label}) }}
          />
        </div>
        <div class={style['action-field']}>
          <div />
          <div>File Types Allowed are Adobe PDF</div>
        </div>
        <div class={style['action-field']}>
          <div>Description*:</div>
          <TextField
            value={props.description}
            onChange={(e) => { props.setState({description: e}) }}
          />
        </div>
        <div class={style['action-field']}>
          <div>File*:</div>
          <div class={style['flex-row']}>
            <FileInput
              value={props.file}
              onChange={onFileInput}
            />
            <Button
              disabled={!props.isValid}
              class={style['upload-btn']}
              onClick={props.uploadFile}
            >Upload</Button>
          </div>
        </div>
        {/*
          !props.hasPostAward &&
          (
            <div className={style['action-field']}>
              <div />
              <div className={style['no-post-award']}>no post award found</div>
            </div>
          )
        */}
      </div>
    </div>
  )
}
