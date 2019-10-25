import styled, { css } from 'styled-components'

// EXPANDED ROW
export const Expanded = styled.div`
  background: white;
  outline: 1px solid lightgrey;
  width: 100%;
  display: table-row;
  ${props => !props.selected && css`
    display: none;
  `};
  > .section {
    width: 100%;
    > .header {
      display: flex;
      font-weight: bolder;
      padding: 10px 0px 10px 20px;
      border-bottom: 1px solid lightgrey;
      > div {
        margin-right: 500px;
      }
    }
    > .data-section {
      display: flex;
      padding: 10px 0px 10px 20px;
      > .data-table {
        width: 650px;
        > .data {
          display: flex;
          > div:nth-child(odd) {
            width: 300px;
            display: inline-block;
          }
        }
      }
    }
  }
  a {
    display: block;
  }
`

// ORG ROW
export const MyAppRow = styled.div`
  text-align: left;
  height: 70px;
  outline: 1px solid lightgrey;
  background-color: #f5f5f5;
  ${props => props.selected && css`background-color: #e0e0e0;`}
  width: 100%;
  display: table-row;
  cursor: pointer;
  td {
    align-items: center;
    line-height: 70px;
    padding-left: 20px;
  }
  .link {
      cursor: pointer;
      color: #2196f3;
      text-align: left;
      display: flex;
      justify-content: left;
      align-items: center;
  }
`
