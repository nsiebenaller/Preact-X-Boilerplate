import { h, Component } from 'preact';
import {
  IconContainer,
  ArrowContainer
} from './Style.js';
import { ArrowDropUp, ArrowDropDown, ArrowLeft, ArrowRight } from '@Icons';

const Arrow = ({ direction, color }) => (
  <IconContainer>
    <ArrowContainer color={color}>
      {
        direction === 'up' && <ArrowDropUp />
      }
      {
        direction === 'down' && <ArrowDropDown />
      }
      {
        direction === 'left' && <ArrowLeft />
      }
      {
        direction === 'right' && <ArrowRight />
      }
    </ArrowContainer>
  </IconContainer>
)

export default Arrow;
