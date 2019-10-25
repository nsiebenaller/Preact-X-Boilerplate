import styled, { css } from 'styled-components'

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
