import { h, Component } from 'preact';
import {
  Container,
  PageItem,
  ArrowIcon
} from './Style.js'
import { FirstPage, LastPage, ArrowLeft, ArrowRight } from '@Icons';


function getFirstPage(currentPage) {
  if(currentPage === 0) return 1

  let first = currentPage
  for(let i = 0; i < 1; i++) {
    first--
    if(first === 0) return 1
  }
  return first
}

function getAvailablePages(currentPage, totalItems, perPage) {
  const availablePages = []
  const firstPage = getFirstPage(currentPage)
  const lastPossiblePage = Math.ceil(totalItems / perPage)

  availablePages.push(firstPage)
  let currIdx = firstPage
  for(let i = 0; i < 4; i++) {
    currIdx++
    if(currIdx <= lastPossiblePage) {
      availablePages.push(currIdx)
    }
  }

  while(availablePages.length < 5 && availablePages[0] !== 1) {
    availablePages.unshift(availablePages[0] - 1)
  }

  return availablePages
}

const PageControls = (props) => {
  const availablePages = getAvailablePages(props.currentPage, props.total, props.perPage)
  const lastPossiblePage = props.total === 0 ? 1 : Math.ceil(props.total / props.perPage)
  const firstArrowDisabled = props.currentPage === 0
  const lastArrowDisabled = (lastPossiblePage-1) === props.currentPage
  return(
    <Container pageControls>
      <ArrowIcon
        disabled={firstArrowDisabled}
        onClick={() => !firstArrowDisabled && props.changeCurrentPage(0)}
      ><FirstPage /></ArrowIcon>
      <ArrowIcon
        disabled={firstArrowDisabled}
        onClick={() => !firstArrowDisabled && props.changeCurrentPage(props.currentPage-1)}
      ><ArrowLeft /></ArrowIcon>
      {
        !props.minimal &&
        availablePages.map((page, i) => (
          <PageItem
            key={`table-page-item-${i}`}
            selected={(page-1) === props.currentPage}
            onClick={() => props.changeCurrentPage(page-1)}
          >{page}</PageItem>
        ))
      }
      {
        props.minimal &&
        <PageItem
        >{props.currentPage+1}</PageItem>
      }
      <ArrowIcon
        disabled={lastArrowDisabled}
        onClick={() => !lastArrowDisabled && props.changeCurrentPage(props.currentPage+1)}
      ><ArrowRight /></ArrowIcon>
      <ArrowIcon
        disabled={lastArrowDisabled}
        onClick={() => !lastArrowDisabled && props.changeCurrentPage(lastPossiblePage-1)}
      ><LastPage /></ArrowIcon>
    </Container>
  )
}

export default PageControls
