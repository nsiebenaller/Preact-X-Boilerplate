import styled, { css } from 'styled-components'

export const Parent = styled.div.attrs({
  tabindex: '0'
})`
  position: relative;
  width: auto;
  height: auto;
  border-radius: 5px;
  min-height: 1.1em;
  text-overflow: ellipsis;
  cursor: pointer;
  padding: 10px 14px;
  padding-right: 26px;
  border: 1px solid lightgrey;
  font-size: 14px;
  transition: all .2s ease-out;
  outline:0;
  background-color: white;
  * {
    outline:0;
  }
  &:hover {
    border-color: black;
  }
  ${props => props.disabled && css`
    cursor: not-allowed;
    border-color: lightgrey;
    &:hover {
      border: 1px solid lightgrey;
    }
  `}
  ${props => props.opened && css`
    border-color: black;
  `}
`

export const ListDiv = styled.div`
  max-height: 200px;
  overflow: auto;
  position:absolute;
  z-index: 10;
  background-color: white;
  padding: 10px 0px;
  width: 100%;
  left: 0;
  top: 0;
  border-radius: 5px;
  box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
  ${props => props.closed && css`
    display: none !important;
  `}
`

export const ListItem = styled.div`
  text-align: center;
  padding: 10px 4px;
  word-wrap:break-word;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  &:hover {
    background-color: #EEEEEE;
  }
  ${props => props.leftAlign && css`
    text-align: left !important;
    padding-left: 20px;
  `}
  ${props => props.selected && css`
    background-color: #E0E0E0;
    &:hover {
      background-color: #E0E0E0;
    }
  `}
  ${props => props.targeted && css`
    background-color: #E0E0E0;
    &:hover {
      background-color: #E0E0E0;
    }
  `}
`

export const ErrorText = styled.div`
  color: #f44336;
  white-space: nowrap;
  font-size: 14px;
`

export const Label = styled.div`
  margin-top: 20px;
  height: 18px;
`

export const Arrow = styled.i`
  position: absolute;
  pointer-events: none;
  right: 0;
  top: calc(50% - 12px);
`

export const ActiveField = styled.div`
  > svg {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
  }
`
