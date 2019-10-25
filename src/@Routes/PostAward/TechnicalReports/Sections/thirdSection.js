import { h, Component } from 'preact'
import Section from './section.js'
import FileRow from './fileRow.js'
import { SectionBody, ActionButtons, Spacer, FileUploadDupes, CancelButton } from './style.js'
import { Button } from '@Shared'
import { getUnique } from '@Helpers/index.js'

function findDuplicates(fileTags) {

}

const ThirdSection = (props) => {

  const fileTagNames = props.fileTagOptions.map(x => x.name)
  const dupes = getUnique( props.fileTags.filter( (a) => (props.fileTags.indexOf(a) !== props.fileTags.lastIndexOf(a)) && (fileTagNames.includes(a)) ) )

  return(
    <Section open={props.open} header={"Step 3 : Tag Each File"} closedHeader={<div>Step 3<br />Tag Files</div>}>
      <SectionBody column scroll>
        {
          props.files.map((file, idx) => (
            <FileRow
              file={file}
              tag={props.fileTags[idx]}
              idx={idx}
              removeFile={props.removeFile}
              setTag={props.setTag}
              fileTagOptions={props.fileTagOptions}
            />
          ))
        }
        <Spacer height={"100px"} />
          {
            props.isUploading &&
            (
              <ActionButtons>
                <div>Uploading...</div>
              </ActionButtons>
            )
          }
          {
            !props.isUploading &&
            (
              <ActionButtons>
                <FileUploadDupes>
                  {
                    dupes.map(dupe => (
                      <div>More than one file tagged as '{dupe}'</div>
                    ))
                  }
                </FileUploadDupes>
                <div className="button-container">
                <Button
                  onClick={props.validate}
                  disabled={(props.fileTags.filter(tag => tag === "Select File Type").length > 0) || (dupes.length > 0)}
                >Submit</Button>
                  <CancelButton
                    onClick={props.cancel}
                  >Cancel</CancelButton>

                </div>
              </ActionButtons>
            )
          }
      </SectionBody>
    </Section>
  )
}

export default ThirdSection
