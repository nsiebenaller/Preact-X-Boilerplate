import { h } from 'preact'
import { Link } from 'react-router-dom'
import style from './Menu.less';

export default function Menu({ options, setIsLoading }) {

  const opts = options.sort((a,b) => a.order - b.order);
  const uri = window.location.pathname;
  const setLoading = () => setIsLoading(true);

  return(
    <div className={style['menu']}>
      {
        opts.map((opt) => (opt.legacy) ?
        (
          <a
            href={'/eBRAP'+opt.url}
            onClick={setLoading}
            className={(getSelected(uri, opt)) ? (style['sel-menu-btn']) : (style['menu-btn'])}
          >{opt.label}</a>
        ) :
        (
          <Link
            to={'/eBRAP'+opt.url}
            class={(getSelected(uri, opt)) ? (style['sel-menu-btn']) : (style['menu-btn'])}
          >{opt.label}</Link>
        ))
      }
    </div>
)}

function getSelected(currentUrl, opt) {
  if(!currentUrl) return false;
  const currGroup = extractURLGroup(currentUrl);
  const optGroup = extractURLGroup(opt.url);
  return currGroup.includes(optGroup);
}

function extractURLGroup(url) {
  url = url.replace('/eBRAP', '');
  let group = url.substring(url.indexOf("/")+1, url.lastIndexOf("."));
  if(group.includes("/")) return group.substring(0, group.indexOf("/"));
  return group;
}
