import { h, Component } from 'preact'
import { CloudUpload } from '@Icons'
import style from './FileInput.less';

export default function FileUploader(props) {

  const preventDefault = (isHovered) => (e) => {
    e.preventDefault();
    e.stopPropagation();

    const ele = document.getElementsByClassName(style['file-input'])[0];
    if(ele && isHovered) ele.classList.add("file-upload-hover");
    else if(ele) ele.classList.remove("file-upload-hover");
  }

  const handleAddFile = (e) => {
    //console.log("ADD FILE", e);
    e.preventDefault();
    e.stopPropagation();

    props.addFile(e, ele);

    const ele = document.getElementsByClassName(style['file-input'])[0];
    if(ele) ele.classList.remove("file-upload-hover");
  }

  return(
    <div className={style['file-input']}>
      <input
        class="box__file"
        type="file"
        name="files[]"
        id={style['file-input-field']}
        data-multiple-caption="{count} files selected"
        multiple
        onChange={handleAddFile}
      />
      <label
        className={style['upload-label']}
        for={style['file-input-field']}
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
