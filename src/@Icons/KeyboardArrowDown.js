import { h, Component } from 'preact'

/**
 * Icon Component
 * @param   {String}    class     Optional - Style class to apply
 * @param   {String}    title     Optional - title to apply when hovering
 * @param   {Function}  onClick   Optional - Function to call when icon is clicked
 */

const Icon = ({ class: className, title, onClick }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    class={className || ''}
    title={title || ''}
    onClick={onClick || (() => {})}
  >
    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
    <path fill="none" d="M0 0h24v24H0V0z"/>
  </svg>
)
export default Icon
