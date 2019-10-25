import { h, Component } from 'preact';
import PageControls from './PageControls.js';
import { Container } from './Style.js';

const TableFooter = (props) => (
  <Container tableFooter>
    <PageControls
      currentPage={props.currentPage}
      total={props.total}
      perPage={props.perPage}
      changeCurrentPage={props.changeCurrentPage}
      minimal={props.minimal}
    />
  </Container>
)

export default TableFooter;
