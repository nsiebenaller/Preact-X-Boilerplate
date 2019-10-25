import styled, { css } from 'styled-components'

// AUTOCOMPLETE STYLES
export const Parent = styled.div`
  position: relative;
  display: inline-block;
  margin-right: 20px;
  
`

export const TextLabel = styled.div`
  margin-top: 15px;
  height: 18px;
  margin-bottom: 5px;
`

export const Input = styled.input`
  position: relative;
  /*z-index: 5;*/
  border-radius: 5px;
  border: 1px solid lightgrey;
  padding: 10px 14px;
  outline: 0;
  transition: all .2s ease-out;
  :hover, :focus {
    border: 1px solid black;
  }
  ::placeholder { /* Firefox, Chrome, Opera */
      color: #bdbdbd;
  }
  :-ms-input-placeholder { /* Internet Explorer 10-11 */
      color: #bdbdbd;
  }

  ::-ms-input-placeholder { /* Microsoft Edge */
      color: #bdbdbd;
  }
`

// LIST STYLES
export const ListParent = styled.div`
  ${props => !props.opened && css`display: none;`};
  position:absolute;
  z-index: 10;
  width: 100%;
  background-color: white;
  left: 0;
  top: 0;
  box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
  border-radius: 0px 0px 5px 5px;
`
export const OptionList = styled.div`
  max-height: 200px;
  overflow: auto;
  padding: 10px 0px;
  width: 100%;
`
export const Option = styled.div`
  text-align: center;
  padding: 10px 4px;
  word-wrap:break-word;
  cursor: pointer;
  :hover {
    background-color: #EEEEEE;
  }
`
export const NotFound = styled.div`
  text-align: center;
  padding: 10px 4px;
  word-wrap:break-word;
`
