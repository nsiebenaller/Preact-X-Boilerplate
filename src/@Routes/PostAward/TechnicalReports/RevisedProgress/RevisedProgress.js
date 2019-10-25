import { h, Component } from 'preact';
import {
  Container,
  Progress,
  Text,
  Label
} from './Styled.js';

export default function RevisedProgress({ progress, text, label, error }) {
  return(
    <div>
      <Container>
        <Progress progress={progress} error={error} />
        <Text>
        {
          text ? text :
          progress + "%"
        }
        </Text>
      </Container>
      <Label>{label}</Label>
    </div>
  )
}
