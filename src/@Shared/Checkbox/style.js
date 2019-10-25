import styled, { css } from 'styled-components'

// CHECKBOX STYLES
export const Parent = styled.div`
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  float: left;
  clear: left;
  > i {
    margin: 5px 10px 5px 10px;
    ${props => props.checked && css`
      color: #0275d8;
    `}
  }
`
