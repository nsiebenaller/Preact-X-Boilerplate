import styled, { css, keyframes } from 'styled-components'

export const Container = styled.div`
  width: 100%;
`

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  ${props => props.header && css`
    background: #424242;
    color: white;
    font-weight: bold;
  `}
  ${props => props.group && css`
    padding: 6px 10px 6px 10px;
    border: 1px solid grey;
    > div {
      display: flex;
      flex-direction: row;
      flex: 1;
      align-items: center;
    }
  `}
  ${props => props.groupIndex && css`
    margin-left: ${props.groupIndex}px;
  `}
`

export const Cell = styled.div`
  flex: 1;
  padding: 6px 10px 6px 10px;
  border: 1px solid grey;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  ${props => props.header && !props.canSort && css`
    cursor: default !important;
  `}
`

export const IconContainer = styled.div`
  position: relative;
`

export const ArrowContainer = styled.i.attrs({
  className: 'material-icons'
})`
  user-select: none;
  position: absolute;
  cursor: pointer;
  ${props => props.color ?
    css`color: ${props.color};` :
    'color: white !important;'
  }
  display: inline-flex !important;
  align-items: center !important;
  width: 100% !important;
  height: 100% !important;
`

const animate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`

export const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 20px 0px 20px 0px;
`
export const LoaderIcon = styled.div`
  border: .3em solid currentcolor;
  border-bottom-color: transparent;
  border-radius: 50%;
  animation: 1s ${animate} linear infinite;
  position: relative;
  display: inline-block;
  width: 2em;
  height: 2em;
  color: inherit;
  vertical-align: middle;
  pointer-events: none;
`
