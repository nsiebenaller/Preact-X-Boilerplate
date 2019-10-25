import styled, { css } from 'styled-components'

export const Btn = styled.div.attrs({
  tabindex: '0'
})`
  ${props => props.color &&
    (props.outlined ?
      (css`
        border: 1px solid ${props.color} !important;
        color: ${props.color} !important;
      `) :
      (css`
        background-color: ${props.color} !important;
      `))
  }
  ${props => props.hoverColor && css`
    &:hover {
      background-color: ${props.hoverColor} !important;
    }
  `}
  ${props => props.disabled && props.outlined && css`
    border: 1px solid #9e9e9e !important;
  `}
`
