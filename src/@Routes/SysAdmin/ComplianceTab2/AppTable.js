import { h, Component } from 'preact';
import { TableX } from '@Shared';
import style from './AppTable.less';
import { Check } from '@Icons';

export default function AppTable(props) {

  const selectedID = (props.selectedApp) ? (props.selectedApp.id) : (-1);

  const getHeaders = () => {
    return({
      "Log Number": {
        render: (app) => <div>{app.logNo}</div>
      },
      "Pre App?": {
        render: (app) => <div className={`${style['icon']}`}>{(app.preApp.exists) ? (<Check />) : ('-')}</div>,
        class: style['max-width']
      },
      "Pre App Status": {
        render: (app) => <div className={`${style['small-text']}`}>{(app.preApp.exists) ? ((app.preApp.status) ? (app.preApp.status.replace("_", " ")) : ('~none~')) : ('-')}</div>
      },
      "Full App?": {
        render: (app) => <div className={`${style['icon']}`}>{(app.fullApp.exists) ? (<Check />) : ('-')}</div>,
        class: style['max-width']
      },
      "Full App Status": {
        render: (app) => <div className={`${style['small-text']}`}>{(app.fullApp.exists) ? ((app.fullApp.status) ? (app.fullApp.status.replace("_", " ")) : ('~none~')) : ('-')}</div>
      }
    })
  }

  return(
    <div>
      <div className={style['search-text']}>Search Results for "{props.lastSearchedText}"</div>
      <TableX
        className={style['app-table']}
        headers={getHeaders()}
        data={props.applications}
        onClickRow={props.onSelectApp}
        rowClassName={style['app-row']}
        conditionalRowClassFn={(app) => (app.id === selectedID)}
        conditionalRowClassName={style['selected-app']}
        paginated
        minimalHeader
      />
    </div>
  )
}
