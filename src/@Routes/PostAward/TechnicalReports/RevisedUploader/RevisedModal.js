import { h, Component } from 'preact'
import { Modal, RadioGroup, Button } from '@Shared'

export default function RevisedModal({ open, fileList, setRevision, onClose, startUploadLoop }) {

  return(
    <Modal
      open={open}
      title={'Revision Reason'}
      content={<Content fileList={fileList} setRevision={setRevision} />}
      confirmText={"Submit"}
      onClose={onClose}
      onConfirm={() => {
        if(fileList.some(f => f.revisedReason === null)) {
          window.alert("You must select revison type for all files.");
          return;
        }
        onClose();
        startUploadLoop();
      }}
      actions={null}
    />
  )
}


function Content({ fileList, setRevision }) {
  return(
    <div>
      <div>Please select revision reason from below for each file and click Submit:</div>
      {
        fileList.map((f) => (
          <div>
            <div><b>{f.tag}</b></div>
            <RadioGroup
              options={["Revised", "Administrative Correction"]}
              value={f.revisedReason}
              onChange={setRevision(f.tag)}
              horizontal
            />
          </div>
        ))
      }
    </div>
  )
}
