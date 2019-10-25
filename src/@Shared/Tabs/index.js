import { h, Component } from 'preact'
import { Link } from 'react-router-dom'
import style from './style.less'

/**
 * [Tabs Component]
 * @param       {Array}   options   tab options to render
 * @param       {String}  selected  url of current route
 */

export default function Tabs({ options, selected, class : className, setLoading }) {
  const opts = options.sort((a,b) => a.order - b.order);

  const handleNav = (url) => (e) => {
    if(setLoading) setLoading();
    window.location.href = url;
  }
  return(
    <div class={`${className ? className : ''} ${style['tab-container']}`}>
      {
        opts.map((option) => (option.legacy) ?
        (
          <a
            href={'/eBRAP'+option.url}
            onClick={handleNav('/eBRAP'+option.url)}
            class={(option.url.includes(selected)) ? style['selected-option'] : ''}
          >{option.label}</a>
        ) :
        (
          <Link
            to={'/eBRAP'+option.url}
            class={(option.url.includes(selected)) ? style['selected-option'] : ''}
          >{option.label}</Link>
        ))
      }
    </div>
  )
}
