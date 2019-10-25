import { h, Component } from 'preact';
import style from '../Section.less';
import LimitedDistroModal from './LimitedDistroModal.js';
import LabelModal from './LabelModal.js';

export default function FirstSection({ bundle }) {

  const startDate = (convertDate(bundle.startDate)).toLocaleDateString();
  const endDate = (convertDate(bundle.endDate)).toLocaleDateString();
  const limitedDistribution = bundle.documents.length > 0 ?
    (bundle.documents.find(d => d.type.includes("Report")).limitedDistribution ? ("YES") : ("NO") ) : ("NO");
  const finalReport = bundle.isFinal ? ("YES") : ("NO");

  return(
    <div className={style['section']}>
      <div className={style['section-header']}><span>Report Info</span></div>
      <div className={`${style['section-body']} ${style['report-info']}`}>
        <div><span>Report Type:</span><span>{bundle.type}</span></div>
        <div><span>Label: <LabelModal /></span><span>{bundle.label}</span></div>
        <div><span>Report Start Date:</span><span>{startDate}</span></div>
        <div><span>Report End Date:</span><span>{endDate}</span></div>
        <div><span>Limited Distribution?: <LimitedDistroModal /></span><span>{limitedDistribution}</span></div>
        <div><span>Final Report?:</span><span>{finalReport}</span></div>
      </div>
    </div>
  )
}

function convertDate(dateStr) {
  const dateArr = dateStr.split("-")
  const date = new Date()
  date.setFullYear(parseInt(dateArr[0]))
  date.setMonth(parseInt(dateArr[1])-1)
  date.setDate(parseInt(dateArr[2]))
  return date
}
