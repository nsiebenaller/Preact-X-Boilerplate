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
    <path d="M14 7l-5 5 5 5V7z"/><path fill="none" d="M24 0v24H0V0h24z"/>
  </svg>
)
export default Icon
