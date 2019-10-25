import { h, Component } from 'preact';

const PageDescription = ({ currentPage, perPage, total }) => {
  const first = (((currentPage + 1) * perPage) - perPage) + 1
  const lastItem = (currentPage + 1) * perPage
  const last = (total < lastItem) ? total : lastItem
  return(
    <div>Showing {first}-{last} of {total} entries</div>
  )
}

export default PageDescription
