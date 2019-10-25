import styled, { css } from 'styled-components'


export const Container = styled.div`
  position: relative;
  width: 100%;
  height: 30px;
  margin-top: 20px;
  border: 1px solid black;
  box-sizing: content-box;
`

export const Progress = styled.div`
  height: 30px;
  background: #96c85b;
  display: flex;
  justify-content: center;
  align-items: center;
  ${props => css`
    width: ${props.progress}%;
  `}
  ${props => props.error && css`
    background: #e53935;
  `}
`

export const Text = styled.div`
  font-weight: bold;
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const Label = styled.div`
  font-size: 14px;
  margin-top: 5px;
`
