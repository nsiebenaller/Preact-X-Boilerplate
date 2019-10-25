import { h, Component } from 'preact';
import { Delete } from '@Icons';
import style from './FileRow.less';
import { downloadOrgFile } from '@Api';



export default function FileRow({data, deleteFile}) {
  return(
    <tr class={style['file-row']}>
      <td>
        <div
          class={style['link-text']}
          onClick={() => {downloadOrgFile(data.fileName, data.id)}}
        >{data.fileName}</div>
      </td>
      <td>{data.fileType}</td>
      <td>{parseInt(data.fileSize)}</td>
      <td>{data.uploadedBy}</td>
      <td>{new Date(data.uploadedOn).toLocaleDateString()}</td>
      <td>
        <Delete
          class={style['icon-btn']}
          title={"Delete"}
          onClick={() => {
            if(window.confirm(`Are you sure you want to delete ${data.fileName}?`)) {
              deleteFile(data.id)
            }
          }}
        />
      </td>
    </tr>
  )
}
