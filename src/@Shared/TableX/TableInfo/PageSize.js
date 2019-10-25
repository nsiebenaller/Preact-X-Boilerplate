import { h, Component } from 'preact';
import * as Shared from '../../index.js';
import { Container } from './Style.js'

const PageSize = (props) => {
  return(
    <Container pageSize>
      <div>Show</div>
      <Shared.Dropdown
        value={props.perPage}
        options={props.perPageOpts.map(x => ({ ...x, value: x, label: x }))}
        onChange={props.changePerPage}
      />
      <div>entries</div>
    </Container>
  )
}

export default PageSize
