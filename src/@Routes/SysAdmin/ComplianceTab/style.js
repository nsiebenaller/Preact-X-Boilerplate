import styled, { css } from 'styled-components'

// OPTION
export const OptionContainer = styled.div`
  display: inline-flex;
  border: 1px solid #007aff;
  border-radius: 5px;
  margin: 10px 0px 10px 0px;
  overflow: hidden;
`
export const Opt = styled.div`
  padding: 10px 20px;
  width: 260px;
  color: #007aff;
  display: flex;
  justify-content: center;
  cursor: pointer;
  &:hover {
    background: #e7f2ff;
  }
  ${props => props.selected && css`
    background: #007aff !important;
    color: white;
  `}
`
