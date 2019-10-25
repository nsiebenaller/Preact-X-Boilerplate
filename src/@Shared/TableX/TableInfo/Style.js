import styled, { css } from 'styled-components'

export const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  ${props => props.tableHeader && css`
    margin: 10px 0px 10px 0px;
    > div {
      margin-right: 30px;
    }
    > div:nth-child(1) {
      @media (max-width: 800px) {
        /*display: none;*/
      }
    }
    > div:nth-child(2) {
      @media (max-width: 580px) {
        /*visibility: hidden;*/
      }
    }
    > div:nth-child(3) {
      position: absolute;
      margin-right: 0px;
      right: 0px;
    }
  `}
  ${props => props.tableFooter && css`
    height: 38px;
        margin: 10px 0px 10px 0px;
    > div:nth-child(1) {
      position: absolute;
      margin-right: 0px;
      right: 0px;
    }
  `}
  ${props => props.pageSize && css`
    > div {
      margin-right: 10px;
    }
    > div:nth-child(2) {
      width: 60px;
      > div {
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  `}
  ${props => props.pageControls && css`
  `}
`

export const ArrowIcon = styled.i.attrs({
  className: 'material-icons'
})`
  cursor: pointer;
  user-select: none;
  border: 1px solid transparent;
  border-radius: 5px;
  padding: 2px;
  transition: all .2s ease-out;
  &:hover {
    border: 1px solid black;
  }
  ${props => props.disabled && css`
    color: #bdbdbd;
    fill: #bdbdbd;
    cursor: default;
    &:hover {
      border: 1px solid transparent;
    }
  `}
`

export const PageItem = styled.div`
  padding: 5px 10px 5px 10px;
  border-radius: 5px;
  border: 1px solid transparent;
  margin-right: 5px;
  cursor: pointer;
  user-select: none;
  transition: all .2s ease-out;
  &:hover {
    border: 1px solid black;
  }
  ${props => props.selected && css`
    background: #eeeeee;
    border: 1px solid #424242;
  `}
`
