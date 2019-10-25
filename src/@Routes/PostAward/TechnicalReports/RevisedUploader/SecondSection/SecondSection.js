import { h, Component } from 'preact';
import style from '../Section.less';
import FileUploader from './FileUploader.js'

export default function FirstSection({ addFile }) {
  return(
    <div className={style['section']}>
      <div className={style['section-header']}><span>Upload Files</span></div>
      <div className={`${style['section-body']} ${style['upload-files']}`}>
        <div>Attach Files (Maximum 6 files at a time)</div>
        <FileUploader
          addFile={addFile}
        />
        <div>Maximum File Size: 90 MB</div>
      </div>
    </div>
  )
}
