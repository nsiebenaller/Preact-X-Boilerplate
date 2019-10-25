import { h, Component } from 'preact';
import PageSize from './PageSize.js';
import PageDescription from './PageDescription.js';
import PageControls from './PageControls.js';
import { Container } from './Style.js';

const TableHeader = (props) => (
  <Container tableHeader>
    <PageDescription
      currentPage={props.currentPage}
      perPage={props.perPage}
      total={props.total}
    />
    <PageSize
      perPage={props.perPage}
      perPageOpts={props.perPageOpts}
      changePerPage={props.changePerPage}
    />
    <PageControls
      currentPage={props.currentPage}
      total={props.total}
      perPage={props.perPage}
      changeCurrentPage={props.changeCurrentPage}
      minimal={props.minimal}
    />
  </Container>
)

export default TableHeader;
