import styled, { css } from 'styled-components'

export const SearchRow = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  margin-bottom: 20px;
  & > *:last-child {
    margin-left: auto;
  }
`

export const SearchLabel = styled.div`
  margin-right: 10px;
`

export const ClearButton = styled.div`
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
