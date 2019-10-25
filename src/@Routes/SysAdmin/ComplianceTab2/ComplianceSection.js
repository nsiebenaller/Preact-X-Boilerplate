import { h, Component } from 'preact';
import style from './ComplianceSection.less';
import { Button } from '@Shared';

export default function ComplianceSection({ selectedApp, running, message, onRunCompliance, onDeleteCompliance }) {
  if(!selectedApp) return(null);

  const handleRunCompliance = (stage) => (e) => onRunCompliance(stage);
  const handleDeleteCompliance = (stage) => (e) => onDeleteCompliance(stage);
  const preAppStatus = (selectedApp.preApp.status ? selectedApp.preApp.status.replace("_", " ") : '~none~');
  const fullAppStatus = (selectedApp.fullApp.status ? selectedApp.fullApp.status.replace("_", " ") : '~none~');
  const disabled = (!!running);
  const runPreAppText = (running === "RUN-PRE" ? ("Running...") : ("Run Compliance"));
  const runFullAppText = (running === "RUN-FULL" ? ("Running...") : ("Run Compliance"));
  const delPreAppText = (running === "DEL-PRE" ? ("Deleting...") : ("Delete Data & Files"));
  const delFullAppText = (running === "DEL-FULL" ? ("Deleting...") : ("Delete Data & Files"));
  let statusText = null;
  switch(running) {
    case "RUN-PRE":
      statusText = "Running Pre App Compliance...";
      break;
    case "RUN-FULL":
      statusText = "Running Full App Compliance...";
      break;
    case "DEL-PRE":
      statusText = "Deleting Pre App Compliance...";
      break;
    case "DEL-FULL":
      statusText = "Deleting Full App Compliance...";
      break;
    default:
      break;
  }

  return(
    <div>
      <div className={style['compliance-section']}>
        <div className={style['header-row']}>
          <div className={style['header']}>Application: {selectedApp.logNo}</div>

        </div>

        <div className={style['table-header']}>
          <div>App Stage</div>
          <div className={style['text-center']}>Status</div>
          <div>Actions</div>
        </div>
        {
          selectedApp.preApp.exists &&
          <div className={style['action-row']}>
            <div>Pre App</div>
            <div className={style['text-center']}>{preAppStatus}</div>
            <div className={style['action-btns']}>
              {/*<Button disabled={disabled} onClick={handleRunCompliance("RUN-PRE")} color={'#354c61'}>{runPreAppText}</Button>*/}
              <Button disabled={disabled || preAppStatus === '~none~'} onClick={handleDeleteCompliance("DEL-PRE")} outlined color={'#354c61'}>{delPreAppText}</Button>
            </div>
          </div>
        }
        {
          !selectedApp.preApp.exists &&
          <div className={style['no-app-row']}>~ no pre application ~</div>
        }
        {
          selectedApp.fullApp.exists &&
          <div className={style['action-row']}>
            <div>Full App</div>
            <div className={style['text-center']}>{fullAppStatus}</div>
            <div className={style['action-btns']}>
              {/*<Button disabled={disabled} onClick={handleRunCompliance("RUN-FULL")} color={'#354c61'}>{runFullAppText}</Button>*/}
              <Button disabled={disabled || fullAppStatus === '~none~'} onClick={handleDeleteCompliance("DEL-FULL")} outlined color={'#354c61'}>{delFullAppText}</Button>
            </div>
          </div>
        }
        {
          !selectedApp.fullApp.exists &&
          <div className={style['no-app-row']}>~ no full application ~</div>
        }
        { statusText && <div className={style['header-status']}>{statusText}</div> }
        { message && <div className={style['header-status']}>{message}</div> }
      </div>
    </div>
  )
}
