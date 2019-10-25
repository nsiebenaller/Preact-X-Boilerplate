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
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4z"/>
    <path fill="none" d="M0 0h24v24H0V0z"/>
  </svg>
)
export default Icon
