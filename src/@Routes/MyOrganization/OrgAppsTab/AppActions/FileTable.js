import { h, Component } from 'preact'
import { Table } from '@Shared'
import { singleAppHeaders } from '@Static/organizationApplications.json'
import FileRow from './FileRow.js';

export default function FileTable(props) {
  return(
    <div>
      <b>Uploaded Files:</b>
      <Table
        defaultSort={'filename'}
        containerClass={'table-container'}
        tableClass={'file-table'}
        perPage={5}
        data={props.fileList}
        headers={singleAppHeaders}
        hidePerPage
        rowComponent={(p) => (
          <FileRow
            deleteFile={props.deleteFile}
            {...p}
          />
        )}
      />
    </div>
  )
}
