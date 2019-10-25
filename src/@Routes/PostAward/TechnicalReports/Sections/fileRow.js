import { h, Component } from 'preact'
import { Cancel, Check } from '@Icons'
import { File, FileName } from './style.js'
import { Dropdown } from '@Shared'
import { formOptions } from '@Helpers/'

const FileRow = (props) => (
  <File
    tagSelected={props.tag !== "Select File Type"}
  >
    <FileName>
      {
        props.tag !== "Select File Type" ?
        <Check class="file-icon" /> :
        ""
      }
      <div className="file-name">{props.file.name}</div>
    </FileName>
    <Dropdown
      value={props.tag}
      error={props.tag === "Select File Type" ? "File must be tagged - Required Field" : null}
      options={formOptions(props.fileTagOptions.map(x => x.name))}
      onChange={(e) => props.setTag(props.idx, e.value)}
    />
    <Cancel
      class={"pointer color-red"}
      onClick={() => props.removeFile(props.idx)}
    />
  </File>
)

export default FileRow
