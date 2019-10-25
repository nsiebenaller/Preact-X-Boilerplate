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
    <path d="M0 0h24v24H0z" fill="none"/>
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
  </svg>
)
export default Icon
