import { h, Component } from 'preact';
import { Cancel } from '@Icons';
import { Dropdown } from '@Shared';
import style from './FileRow.less';
import { formOptions } from '@Helpers';

export default function FileRow({ fileData, removeFile, setTag, tags, isUploading }) {

  const errorMsg = fileData.tag === "Select File Type" ? "File must be tagged - Required Field" : null;
  const tagOptions = formOptions(tags.map(t => t.name));

  return(
    <div className={style['file-row']}>
      <div className={style['file-name']}><span>{fileData.file.name}</span></div>
      <Dropdown
        class={style['file-dropdown']}
        value={fileData.tag}
        error={errorMsg}
        options={tagOptions}
        onChange={setTag}
        disabled={isUploading}
      />
      { !isUploading && <Cancel class={style['cancel-icon']} onClick={removeFile} /> }
    </div>
  )
}
