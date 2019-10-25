import styled, { css } from 'styled-components'

export const Row = styled.div`
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  /* justify-content: space-evenly; */
  background: #fff;
  border: 1px solid #bdbdbd;
  font-weight: normal;
  margin-bottom: -1px;
  font-size: 14px;
  padding: 15px 5px 15px 15px;
  text-align: center;
  > div {
    width: auto;
    flex: 1;
    flex: 1 0 0;
    padding-left: 15px;
    padding-right: 15px;
    white-space: normal;
    /*overflow: hidden;*/
    overflow-wrap: break-word;
    word-break: break-all;
    /* text-overflow: ellipsis; */  /*ellipsis clipping */
  }
  ${props => props.header && css`
    padding: 15px 5px 15px 15px;
    background: #f5f5f5;
    font-weight: bold;
    > div {
      padding: 0;
    }
  `}
  ${props => props.overflow && css`
    > div {
      width: auto;
      font-weight: bold;
    }
  `}
  ${props => props.leftAlign && css`
    justify-content: left;
    > div {
      justify-content: left;
      align-items: center;
      text-align: left;
    }
  `}
  ${props => props.clickable && css`cursor: pointer;`}
  ${props => props.leftAlignFirst && css`
      text-align: left;
  `}
  ${props => props.selected && css`
      background: #fffdeb;

  `}
`
//color: #92907e;

export const Link = styled.div`
  color: #2196f3;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`

export const Buffer = styled.div`
  margin: 0px 10px 0px 10px;
`
