import { h, Component } from 'preact';
import OrgGroup from './OrgGroup.js';
import OrgRow from './OrgRow.js';

export default function TableRow(props) {
  const { data } = props
  if(data.items) return(<OrgGroup data={data} />)
  return(<OrgRow {...props} />)
}
