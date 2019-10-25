import { h, Component } from 'preact'
import style from '../style.css'
import {
  Icon,
  Dropdown,
  FileInput,
  Button
} from '@Shared'
import { formOptions } from '@Helpers/'

function formAppTypes(app) {
  const appTypes = []
  if(!app.preAppFileTypes) {
    return appTypes
  }
  if(app.preAppFileTypes.length > 0) {
    appTypes.push("Pre App")
  }
  if(app.fullAppFileTypes.length > 0) {
    appTypes.push("Full App")
  }
  return formOptions(appTypes)
}

function getComponent(app) {
  if(!app.fullAppFileGroups) {
    return []
  }
  return app.fullAppFileGroups.filter(x => x.parentId === null).map(x => { return({ ...x, value: x.name, label: x.name }) })
}

function getAttachments(appType, fileGroup, app) {
  if(!app.preAppFileTypes) {
    return []
  }
  if(appType === "Pre App") {
    return app.preAppFileTypes.map(x => { return({ ...x, value: x.name, label: x.name }) })
  }
  if(appType === "Full App") {
    const group = app.fullAppFileGroups.find(x => x.name === fileGroup)
    if(!group) {
      return []
    }
    return app.fullAppFileTypes.filter(x => x.groupId === group.id).map(x => { return({ ...x, value: x.name, label: x.name }) })
  }
}

function getSubgroups(app, fileGroup) {
  if(!app.fullAppFileGroups) {
    return []
  }
  const group = app.fullAppFileGroups.find(x => x.name === fileGroup)
  return app.fullAppFileGroups.filter(x => x.parentId === group.id).map(x => { return({ ...x, value: x.name, label: x.name }) })
}

const FileUploadForm = (props) => {
  //console.log(props.selectedApp)
  return(
    <div>
      <h2>Upload File</h2>
      <div class={style.infoRow}>
        <div>Application Type*:</div>
        <Dropdown
          class={style.inlineDD}
          value={props.appType}
          options={formAppTypes(props.selectedApp)}
          onChange={(e) => {
            props.setState({
              appType: e.value,
              appComp: "select",
              attachment: "select",
              subGroup: "select",
              hasSubgroups: false
            })
          }}
        />
      </div>
      <div class={style.infoRow}>
        <div>Application Component*:</div>
        {
          props.appType !== "Pre App" &&
          <Dropdown
            class={style.inlineDD}
            value={props.appComp}
            options={getComponent(props.selectedApp)}
            disabled={props.appType === "select" || props.appType === "Pre App"}
            onChange={(e) => {
              const group = props.selectedApp.fullAppFileGroups.find(x => x.name === e.value)
              const hasChildren = props.selectedApp.fullAppFileGroups.some(x => x.parentId === group.id)
              props.setState({
                appComp: e.value,
                attachment: "select",
                subGroup: "select",
                hasSubgroups: hasChildren
              })
            }}
          />
        }
      </div>
      {
        props.hasSubgroups &&
        (
          <div class={style.infoRow}>
            <div>Component Sub-Group*:</div>
            <Dropdown
              class={style.inlineDD}
              value={props.subGroup}
              options={getSubgroups(props.selectedApp, props.appComp)}
              onChange={(e) => {
                props.setState({
                  subGroup: e.value,
                  attachment: "select"
                })
              }}
            />
          </div>
        )
      }
      <div class={style.infoRow}>
        <div>Attachment*:</div>
        <Dropdown
          class={style.inlineDD}
          value={props.attachment}
          options={getAttachments(props.appType, props.appComp, props.selectedApp)}
          disabled={props.appType === "select" || (props.appType === "Full App" && props.appComp === "select") || (props.appType === "Full App" && props.hasSubgroups && props.subGroup === "select")}
          onChange={(e) => {props.setState({attachment: e.value})}}
        />
      </div>
      <div class={style.actionRow}>
        <FileInput
          class={style.rPanelFileInput}
          value={props.file}
          onChange={(e) => {
            props.setState({
              file: e.target.value,
              fileData: e.target.value ? e.target.files[0] : null
            })
          }}
        />
        <Button
          class={style.uploadBtn}
          onClick={props.handleUpload}
          disabled={!props.isValid}
        >Upload</Button>
      </div>
      {
        props.fileUploadStatus &&
        <div
          class={style.statusBar}
          onClick={() => props.setState({ fileUploadStatus: false })}
          >Your file has been uploaded successfully.<Icon class={style.smIcon} icon={'clear'} />
        </div>
      }
    </div>
  )
}

export default FileUploadForm
