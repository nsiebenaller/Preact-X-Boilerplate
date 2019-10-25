import { h, Component } from 'preact';
import { Button } from '@Shared';
import style from '../Section.less';
import FileRow from './FileRow.js';

export default function ThirdSection({ files, removeFile, setTag, tags, onUpload, onCancel, isUploading }) {

  const handleRemoveFile = (idx) => (e) => removeFile(idx);
  const handleSetTag = (idx) => (e) => setTag(idx, e.value);
  const duplicateTags = findDuplicates(files);
  const filesNotTagged = files.filter(f => f.tag === "Select File Type").length > 0;

  return(
    <div className={style['section']}>
      <div className={style['section-header']}><span>Tag Each File</span></div>
      <div className={`${style['section-body']} ${style['tag-files']}`}>
        <div className={style['file-rows']}>
          {
            files.map((file, idx) => (
              <FileRow fileData={file} removeFile={handleRemoveFile(idx)} setTag={handleSetTag(idx)} tags={tags} isUploading={isUploading} />
            ))
          }
          <div className={style['spacer']} />
          <div className={style['dupes']}>
            {
              duplicateTags.map(dupe => (
                <div>More than one file tagged as '{dupe}'</div>
              ))
            }
          </div>
        </div>
        <div className={style['actions-container']}>
          <Button
            outlined
            onClick={onCancel}
            disabled={isUploading}
          >Cancel</Button>
          <Button
            onClick={onUpload}
            disabled={isUploading || files.length === 0 || duplicateTags.length > 0 || filesNotTagged}
          >Submit</Button>
        </div>
      </div>
    </div>
  )
}

function findDuplicates(files) {
  const tags = [];
  const duplicates = [];
  files.forEach((f) => {
    if(f.tag === "Select File Type") return;
    else if(tags.includes(f.tag)) duplicates.push(f.tag);
    else tags.push(f.tag);
  })
  return duplicates;
}
