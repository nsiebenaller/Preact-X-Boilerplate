import styled, { css } from 'styled-components'

export const ItemContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`

export const Item = styled.div`
  width: 300px;
  padding: 20px;
  margin: 15px;
  position: relative;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  display: table;
`

export const Label = styled.div`
  font-size: 21px;
`

export const Prompt = styled.div`
  font-size: 14px;
  margin-top: 10px;
  margin-bottom: 10px;
`

export const TextArea = styled.textarea`
  position: relative;
  width:100%;
  resize: none;
  overflow: hidden;
  margin-bottom: 10px;
`

export const Button = styled.button`
  width: 100%;
  background: #2196f3;
  border: none;
  padding: 6px 16px;
  border-radius: 5px;
  cursor: pointer;
  color: white;
  font-weight: bold;
  transition: all 0.3s cubic-bezier(.25,.8,.25,1);
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  &:hover {
    background: #1976d2;
  }
`
