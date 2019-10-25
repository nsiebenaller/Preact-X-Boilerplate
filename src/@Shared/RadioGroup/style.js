import styled, { css } from 'styled-components'

export const Option = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(.25,.8,.25,1);
  border-radius: 5px;
  padding: 5px 10px 5px 5px;
  border: 1px solid transparent;
  &:hover {
    border: 1px solid black;
  }
  > i {
    margin-right: 10px;
  }
`

export const OptionContainer = styled.div`
  display: inline-flex;
  flex-direction: column;
  ${props => props.horizontal && css`flex-direction: row;`}
`
