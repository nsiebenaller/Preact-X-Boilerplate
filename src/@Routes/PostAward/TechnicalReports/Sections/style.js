import styled, { css } from 'styled-components'

export const SectionBody = styled.div`
  padding-top: 30px;
  display: flex;
  flex-wrap: wrap;
  ${props => props.column && css`
    flex-direction: column;
  `}
  ${props => props.scroll && css`
    flex-wrap: nowrap;
    overflow-y: auto;
    height: 275px;
    padding-top: 0px;
    margin-top: 10px;
  `}
  ${props => props.row && css`
    padding-right: 15%;
    > div {
      width: 40%;
      min-width: 200px;
      margin: 10px;
    }
  `}
  ${props => props.firstSection && css`
    padding-top: 0px;
    > div {
      display: flex;
      flex-wrap: wrap;
      > div {
        min-width: 215px;
        margin-bottom: 10px;
        margin-right: 125px;
        max-width: 215px;
        ${props => props.selected === 1 && css`
          margin-right: 60px;
        `}
        ${props => props.selected === 2 && css`
          margin-right: 10px;
        `}
      }
    }
  `}
  ${props => props.maxWidth && css`
    max-width: ${props.maxWidth};
  `}
  ${props => props.secondSection && css`
    height: 100%;
  `}
`

export const FileSubText = styled.div`
  margin-top: 10px;
  color: #9c9c94;
`

export const FileLabel = styled.div`
  height: 20px;
`
export const File = styled.div`
  display: flex;
  /*align-items: center;*/
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid white;
  > div {
    margin-right: 10px;
  }
  > div:nth-child(1) {
    display: flex;
    align-items: center;
    ${props => props.tagSelected && css`padding-top: 5px;`}
    max-width: 250px;
    width: 250px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #36a0f4;
  }
  > div:nth-child(2) {
    width: 300px;
  }
  > div:nth-child(3) {
    padding-top: 5px;
  }
  > svg {
    fill: #f46f65;
  }
  > div > svg {
    fill: #36a0f4;
  }
`

export const FileName = styled.div`
  display: flex;
  > .file-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`


export const ActionButtons = styled.div`
  position: absolute;
  right: 20px;
  bottom: 20px;
  > .button-container {
    display: flex;
    flex-direction: row-reverse;
    background: #f5f5f5;
    > * {
      margin-left: 10px;
    }
  }
`

export const Spacer = styled.div`
  ${props => props.height && css`
    height: ${props.height};
    flex: 0 0 ${props.height};
  `}
`

export const ErrorText = styled.div`
  color: red;
  font-size: 14px;
`

export const SectionHeader = styled.div`
  margin-top: 10px;
  color: white;
  border-radius: 5px;
  background: #42a5f5;
  padding: 10px;
  position: relative;
`

export const LabelModal = styled.div`
  ${props => props.hidden && css`
    overflow: hidden;
    width: 0;
    height: 0;
  `}
  background: white;
  position: fixed;
  z-index: 1;
  padding: 8px;
  width: 200px;
  font-size: 12px;
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
`

export const FileUploadDupes = styled.div`
  padding-right: 30px;
  padding-bottom: 5px;
  padding-left: 5px;
  padding-top: 5px;
  color: red;
  background: #f5f5f5;
`

export const CancelButton = styled.div`
  border: 1px solid #757575;
  border-radius: 5px;
  padding: 10px 14px;
  background: white;
  transition: all .2s ease-out;
  margin-left: 5px;
  cursor: pointer;
  &:hover {
    background: #e1e1e1;
  }
`
