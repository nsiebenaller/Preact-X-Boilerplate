import { h, Component } from 'preact'
import { Parent, Chunk, Label } from './style.js'

function determineLabel(total, count, isUploading) {
  if(isUploading) {
    if(count === 0) {
      return "0%"
    }
    return Math.round((count / total) * 100)+"%"
  }
  else {
    if(count === -1) {
      return "File(s) Submitted Successfully!!!"
    }
    return "Waiting to Upload Files..."
  }

}

const UploadProgress = (props) => (
  <div>
    <Parent>
      {
        props.files.map((e, i) => (
          <Chunk
            filled={(props.uploadProgress > i || props.uploadProgress === -1)}
          >
            <div></div>
          </Chunk>
        ))
      }
      <Label>
        {determineLabel(props.files.length, props.uploadProgress, props.isUploading)}
      </Label>
    </Parent>
    {
      props.uploadProgress === -1 ?
      <div>{props.files.length} of {props.files.length} files completed</div> :
      <div>{`${props.uploadProgress} of ${props.files.length} files completed`}</div>
    }

  </div>
)

export default UploadProgress
