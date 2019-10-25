import { h, Component } from 'preact'
import { CloudUpload } from '@Icons'
import style from './FileUploader.less'

export default function FileUploader(props) {

  const preventDefault = (isHovered) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    const ele = document.getElementById("file-upload-label");
    if(isHovered) ele.classList.add("file-upload-hover");
    else ele.classList.remove("file-upload-hover");
  }

  const handleAddFile = (e) => {
    e.preventDefault();
    e.stopPropagation();
    props.addFile(e);
  }

  return(
    <div className={style['file-input']}>
      <input
        class="box__file"
        type="file"
        name="files[]"
        id="file"
        data-multiple-caption="{count} files selected"
        multiple
        onChange={props.addFile}
      />
        <label
          className={style['upload-label']}
          for="file"
          id="file-upload-label"
          onDrop={handleAddFile}
          onDragOver={preventDefault(true)}
          onDragEnter={preventDefault(true)}
          onDragLeave={preventDefault(false)}
        >
          <div className={style['outline-btn']}>Browse Files</div>
          <div class="bold">OR</div>
          <div className={style['upload-icon']}>
            <CloudUpload />
            <div>Drag & Drop Files</div>
          </div>
        </label>
      </div>
  )
}
