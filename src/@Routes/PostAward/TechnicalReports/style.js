import styled, { css } from 'styled-components'

export const StepOpen = styled.div`
  flex: 1;
  padding: 20px;
  border: 1px solid darkgrey;
  > div {
    height: 100%;
    position: relative;
  }
  > b {
    border: 1px solid darkgrey;
    border-radius: 5px;
    padding: 5px 10px;
    white-space: nowrap;
  }
`

export const StepClosed = styled.div`
  flex: 0 0 300px;
  border: 1px solid darkgrey;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  > div {
    width: 170px;
    border: 1px solid darkgrey;
    text-align: center;
    font-weight: bold;
    padding: 60px 30px;
    border-radius: 5px;
    background: white;
  }
`

export const SectionSeperator = styled.div`
  width: 1px;
  background: white;
  box-shadow: 0px 0px 6px #514E49;
  ${props => !props.display && css`display: none;`}
`

export const NewDocButton = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  transition: all .2s ease-out;
  background: #617B94;
  color: #fff;
  cursor: pointer;
  border-radius: 5px;
  outline: 0;
  border: none;
  padding: 10px 14px;
  white-space: nowrap;
  &:hover {
    background: #8095a9;
  }
`
