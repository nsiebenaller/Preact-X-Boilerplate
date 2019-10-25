import { h, Component } from 'preact'
import Section from './section.js'
import {
  SectionBody,
  FileInput,
  FileLabel,
  OutlineButton,
  UploadIcon,
  UploadLabel,
  FileSubText
} from './style.js'
import FileUploader from './FileInput.js'


const SecondSection = (props) => {
  return(
    <Section open={props.open} header={"Step 2 : Upload Files"} closedHeader={<div>Step 2<br />Upload Files</div>}>
      <SectionBody column maxWidth={"550px"} secondSection>
        <FileLabel>Attach Files (Maximum 6 files at a time)</FileLabel>
        <FileUploader
          addFile={props.addFile}
          files={props.files}
        />
        <FileSubText>Maximum File Size: 90 MB</FileSubText>
      </SectionBody>
    </Section>
  )
}

export default SecondSection
