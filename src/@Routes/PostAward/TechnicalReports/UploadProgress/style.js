import styled, { css } from 'styled-components'

export const Parent = styled.div`
  position: relative;
  width: 100%;
  height: 30px;
  border: 1px solid black;
  margin-top: 20px;
  background: white;
  display: flex;
`

export const Chunk = styled.div`
  flex: 1;
  transition: all 0.3s cubic-bezier(.25,.8,.25,1);
  > div {
    max-width: 0px;
  }
  ${props => props.filled && css`
    > div {
      flex: 1;
      max-width: 100%;
      height: 100%;
      background: #96c85b;
    }
  `}
`

export const Label = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
`
