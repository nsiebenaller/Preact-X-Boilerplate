import styled, { css } from 'styled-components'

export const Container = styled.div`
  pointer-events: all;
  position: absolute;
  min-width: 300px;
  height: 50px;
  z-index: 100;
  border-radius: 5px;
  background-color: #424242;
  padding: 6px 24px;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  color: white;
  ${props => !props.show && css`
    width: 0 !important;
    height: 0 !important;
    padding: 0 !important;
    overflow: hidden;
  `};
  ${props => {
    if(props.vertical) {
      if(props.vertical === 'top') return css`top: 20px;`
      if(props.vertical === 'bottom') return css`bottom: 20px;`
    }
  }};
  ${props => {
    if(props.horizontal) {
      if(props.horizontal === 'left') return css`left: 20px;`
      if(props.horizontal === 'center') return css`margin-left: 40%;`
      if(props.horizontal === 'right') return css`right: 20px;`
    }
  }};
`

export const CloseIcon = styled.i`
  cursor: pointer;
  position: absolute;
  right: 24px;
  border-radius: 50%;
  padding: 3px;
  transition: all 0.3s cubic-bezier(.25,.8,.25,1);
  :hover {
    background-color: black;
  }
`
