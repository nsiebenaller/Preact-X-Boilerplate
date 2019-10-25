import styled, { css } from 'styled-components'

export const Backdrop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  ${props => {
    if(!props.open) {
      return css`display: none !important;`
    }
  }}
`

export const ModalBox = styled.div`
  position: relative;
  width: 600px;
  /*height: 300px;*/
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
  > h2 {
    margin: 0;
  }
`

export const ModalTitle = styled.div`
  top: 20px;
  width: 560px;
  font-size: 24px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e0e0e0;
`

export const ModalContents = styled.div`
  top: 80px;
  width: 560px;
  margin-top: 20px
`

export const ModalActionPrompt = styled.div`
  margin-top: 20px
`

export const ModalActions = styled.div`
  /*position: absolute;*/
  bottom: 20px;
  width: 560px;
  display: flex;
  justify-content: flex-end;
`

export const Confirm = styled.div`
  background: #0275d8;
  color: white;
  padding: 8px 16px;
  border-radius: 5px;
  margin-left: 10px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(.25,.8,.25,1);
  &:hover {
    background: #108ffd;
  }
`
export const Cancel = styled.div`
  border: 1px solid #9e9e9e;
  padding: 8px 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(.25,.8,.25,1);
  &:hover {
    border: 1px solid black;
  }
`
