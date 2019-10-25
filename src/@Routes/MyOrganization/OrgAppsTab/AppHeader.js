import { h, Component } from 'preact';
import { Modal } from '@Shared';
import { ArrowBack } from '@Icons';
import { downloadOrgFile } from '@Api'
import style from './AppHeader.less';

export default function AppHeader(props) {

  const downloadGuide = () => downloadOrgFile("Guide.pdf", window.eBRAP.guideID)

  return(
    <div className={style['container']}>
      <div
        class={style['back-btn']}
        onClick={() => props.toggleShowApp(false)}
      >
        <ArrowBack />
        <div>Back</div>
      </div>
      <div class={style['app-detail']}><b>Log Number: {props.app.logNo}</b></div>
      <div class={style['app-detail']}>Award Number: {props.appInfo.awardNbr}</div>
      <div class={style['app-detail']}>Principal Investigator: {getPrincipalInvestigator(props.app)}</div>
      <div class={style['app-detail']}>Primary Business Official: {getPrimaryBO(props.appInfo.contacts)}</div>
      <div
        class={style['guide-btn']}
        onClick={downloadGuide}
      >Guide for Funded Investigators</div>
      <hr />
      <h2>Organization Application Files</h2>
      <div><b>NOTE:</b> All files must NOT be password protected.</div>
    </div>
  )
}

function getPrincipalInvestigator(data) {
  let pi = data.principalInvestigators.find((pi) => pi.type === 'POSTAWARD_PI')
  if(pi) return pi.firstName+" "+pi.lastName
  pi = data.principalInvestigators.find((pi) => pi.type === 'FULLAPP_PI')
  if(pi) return pi.firstName+" "+pi.lastName
  pi = data.principalInvestigators.find((pi) => pi.type === 'PREAPP_PI')
  if(pi) return pi.firstName+" "+pi.lastName
  return ''
}

function getPrimaryBO(contacts) {
  if(!contacts) return ''
  let bo = contacts.find(x => x.appInfoContactType === 'FULLAPP_BO')
  if(bo) return bo.name
  bo = contacts.find(x => x.appInfoContactType === 'PREAPP_BO')
  if(bo) return bo.name
  return ''
}
