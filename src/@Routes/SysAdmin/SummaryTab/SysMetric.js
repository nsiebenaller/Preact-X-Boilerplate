import { h, Component } from 'preact'
import { Metric } from './style.js'

const SysMetric = (props) => (
  <Metric>
    <div className="metric-label">{props.label}</div>
    <div className="metric-value">{props.value}</div>
  </Metric>
)

export default SysMetric
