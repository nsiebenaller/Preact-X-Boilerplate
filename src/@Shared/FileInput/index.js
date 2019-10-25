import { h, Component } from 'preact'
import style from './style.css'

/*
	PROPS
	@param: onChange - required
  @param: value - required
	@param: class - optional
*/

const FileInput = (props) => {
  return(
    <div class={`${style.cContainer} ${(props.class) ? props.class : ""}`}>
      <label class={style.cFileBtn} for="upload">
        {(props.value === "") ? ("Choose a file...") : (getFileFromPath(props.value))}
      </label>
      <input
        class={style.cFileInput}
        type="file"
        name="upload-controller"
        id="upload"
        onChange={(e) => props.onChange(e)}
      />
    </div>
  )
}

export default FileInput

function getFileFromPath(path) {
  return path.replace(/^.*[\\\/]/, '')
}
