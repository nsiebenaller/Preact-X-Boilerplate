import { h, Component } from 'preact';
import { createPortal } from 'preact/compat'
import { MoreHoriz } from '@Icons';
import style from './IconDropdown.less';

export default class IconDropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    }
  }

  componentDidMount() {
    window.addEventListener("click", this.handleClick);
    window.addEventListener("resize", this.updateDimensions);
    document.getElementById("app").addEventListener("scroll", this.updateDimensions)
    this.updateDimensions();
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.handleClick);
    window.removeEventListener("resize", this.updateDimensions);
    document.getElementById("app").removeEventListener("scroll", this.updateDimensions)
  }

  handleClick = e => {
    if(
      this.base && !this.base.contains(e.target) &&
      this.dropdown && !this.dropdown.contains(e.target)
    ) {
      this.setState({ open: false });
    }
  }

  toggleDropdown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    this.setState({ open: !this.state.open });
    this.updateDimensions();
  }

  updateDimensions = () => {
    if(this.base && this.dropdown) {
      const domRect = this.base.getBoundingClientRect();
      this.dropdown.style.top = `${domRect.top + this.base.offsetHeight}px`;
      this.dropdown.style.left = `${domRect.left}px`;
    }
  }

  setDropdown = (ref) => this.dropdown = ref;


  render(props, state) {
    return(
      <div>
        <MoreHoriz class={`${style['icon']} ${state.open ? style['icon-open'] : ''}`} onClick={this.toggleDropdown} />
        <Portal {...props} open={state.open} setDropdown={this.setDropdown} />
      </div>
    )
  }
}

function Portal(props) {
  return createPortal(
    <div className={`${style['dropdown']} ${props.open ? style['dropdown-open'] : ''}`} ref={props.setDropdown}>
      <div onClick={props.editDateRange}>Edit Report Date Range</div>
      <div onClick={props.addReviseBundle}>Revise or Add Documents</div>
    </div>
    , document.getElementsByTagName("BODY")[0]
  )
}
