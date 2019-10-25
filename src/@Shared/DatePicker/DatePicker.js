import { h, Component } from 'preact';
import { createPortal } from 'preact/compat'
import style from './DatePicker.less';
import Calendar from 'react-calendar';
import { CalendarToday } from '@Icons';


/**
 * DatePicker properties
 * @param {Function}  onChange  -Called when a valid date is input by a user
 * @param {Date}      value     -Initial value to select for date input
 */
export default class DatePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      date: null,
      month: null,
      day: null,
      year: null,
      error: false,
    }
  }

  componentDidMount() {
    const { value } = this.props;
    window.addEventListener("click", this.handleClick);
    window.addEventListener("resize", this.updateDimensions);
    document.getElementById("app").addEventListener("scroll", this.updateDimensions);
    if(value) this.onDateChange(value, true);
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.handleClick);
    window.removeEventListener("resize", this.updateDimensions);
    document.getElementById("app").removeEventListener("scroll", this.updateDimensions);
  }

  componentWillReceiveProps({ value }) {
    const { date } = this.state;
    if(value === null && date !== null) this.setState({ date: null, day: null, month: null, year: null });
    if(!!value && !isEqual(value, date)) this.onDateChange(value, true);
  }

  updateDimensions = (e) => {
    if(this.container && this.calendar) {
      const domRect = this.container.getBoundingClientRect();
      this.calendar.style.top = `${domRect.top + this.container.offsetHeight}px`;
      if(this.props.rightAlign) this.calendar.style.left = `${domRect.left - domRect.width}px`;
      else this.calendar.style.left = `${domRect.left}px`;
    }
  }

  handleClick = e => {
    if(
      e.target &&
      this.container && !this.container.contains(e.target) &&
      this.calendar && !this.calendar.contains(e.target) &&
      e.target.className.includes && !e.target.className.includes("react-calendar__tile") &&
      e.target.parentNode &&
      e.target.parentNode.className.includes && !e.target.parentNode.className.includes("react-calendar__tile")
    ) {
      this.validateDate();
      this.setState({ open: false });
    }
  }

  onMonthChange = e => {
    const { state } = this;

    if(e.target.value === "0") return;

    const month = e.target.value.length <= 2 ? e.target.value : e.target.value.substring(0,2);
    this.setState({ month: parseInt(month) > 12 ? 12 : month });

    if(this.state.day) {
      const year = state.year ? state.year : new Date().getFullYear();
      if(parseInt(this.state.day) > daysInMonth(month, year)) {
        this.setState({ day: daysInMonth(month, year) })
      }
    }
    this.setMonthDate(month);
  }
  onDayChange = e => {
    if(e.target.value === "0") return;
    const { state } = this;

    let day = e.target.value;
    if(parseInt(e.target.value) > 31) day = 31;
    else day = day.substring(0,2);

    if(
      this.state.month &&
      this.state.year &&
      parseInt(day) > daysInMonth(state.month, state.year)
    ) day = daysInMonth(state.month, state.year);

    this.setState({ day: day });
    this.setDayDate(day);
  }
  onYearChange = e => {
    if(e.target.value === "0") return;

    const year = e.target.value.length <= 4 ? e.target.value : e.target.value.substring(0,4);
    this.setState({ year: year });

    if(this.state.month && this.state.day) {
      if(parseInt(this.state.day) > daysInMonth(this.state.month, year)) {
        this.setState({ day: 31 });
      }
    }

    this.setYearDate(year);
  }
  onDateChange = (date, mounting = false) => {
    const { state, props } = this;

    let day = date.getDate().toString();
    if(day.length === 1) day = "0"+day;

    let month =  (date.getMonth()+1).toString();
    if(month.length === 1) month = "0"+month;

    const year = date.getFullYear();

    this.setState({
      date: date,
      day: day,
      month: month,
      year: year,
      error: false,
      open: false
    });

    if(props.onChange && date && !mounting) {
      props.onChange(date);
    }
  }

  setMonthDate = (month) => {
    if(month.toString().length === 0) return;

    const { state, props } = this;
    const year = state.year ? state.year : new Date().getFullYear();
    const day = state.day ? state.day : 1;

    if(state.month && state.day && state.year) {
      this.setState({ date: new Date(year, parseInt(month)-1, day) });
      if(props.onChange) props.onChange(new Date(year, month-1, day));
    }
    else {
      this.setState({ date: null });
      if(props.onChange) props.onChange(null);
    }
  }
  setDayDate = (day) => {
    if(day.toString().length === 0) return;

    const { state, props } = this;
    const year = state.year ? state.year : new Date().getFullYear();
    const month = state.month ? state.month : new Date().getMonth();

    if(state.month && state.day && state.year) {
      this.setState({ date: new Date(year, month-1, day) });
      if(props.onChange) props.onChange(new Date(year, month-1, day));
    }
    else {
      this.setState({ date: null });
      if(props.onChange) props.onChange(null);
    }
  }
  setYearDate = (year) => {
    if(year.toString().length !== 4) return;

    const { state, props } = this;
    const day = state.day ? state.day : 1;
    const month = state.month ? state.month : new Date().getMonth();

    if(state.month && state.day && state.year) {
      this.setState({ date: new Date(year, month-1, day) });
      if(props.onChange) props.onChange(new Date(year, month-1, day));
    }
    else {
      this.setState({ date: null });
      if(props.onChange) props.onChange(null);
    }
  }

  validateDate = () => {
    const { state } = this;
    if(!state.month && !state.day && !state.year) {
      this.setState({ error: false });
      return;
    }
    if(!state.month || !state.day || !state.year) {
      this.setState({ error: true });
    }
    else {
      if(state.year.toString().length < 4) this.setState({ error: true });
      else this.setState({ error: false });
    }
  }

  toggleCalendar = () => {
    this.validateDate();
    this.setState({
      open: !this.state.open
    }, () => this.updateDimensions());
  }
  openCalendar = () => this.setState({ open: true }, () => this.updateDimensions());


  render(props, state) {
    return(
      <span className={`${style['parent']}`} ref={ref => this.container = ref}>
        <div className={` ${style['preact-date-picker']} ${state.open ? style['opened'] : ''} ${props.className ? props.className : ''}`}>
          <input
            className={style['picker-month']}
            type="number"
            placeholder='mm'
            value={state.month}
            onInput={this.onMonthChange}
            onClick={this.openCalendar}
          />
          <span>/</span>
          <input
            className={style['picker-day']}
            type="number"
            placeholder='dd'
            value={state.day}
            onInput={this.onDayChange}
            onClick={this.openCalendar}
          />
          <span>/</span>
          <input
            className={style['picker-year']}
            type="number"
            placeholder='yyyy'
            value={state.year}
            onInput={this.onYearChange}
            onClick={this.openCalendar}
          />
          <span class={style["picker-icon"]} onClick={this.toggleCalendar}>
            <CalendarToday />
          </span>
        </div>
          <Portal into="body" ref={ref => this._portal = ref}>
            <div className={`${style['preact-calendar']} ${!state.open ? style['calendar-hidden'] : ''}`} ref={ref => this.calendar = ref}>
              {
                state.open &&
                <Calendar
                  value={state.date}
                  onChange={this.onDateChange}
                  prev2Label={'<<'} //«
                  prevLabel={'<'} //‹
                  next2Label={'>>'} //»
                  nextLabel={'>'} //›
                />
              }
            </div>
          </Portal>
          { state.error && <div className={style['error']}>Invalid date</div>}
      </span>
    )
  }
}

function daysInMonth(iMonth, iYear) {
  return 32 - new Date(iYear, iMonth-1, 32).getDate();
}

function isEqual(aDate, bDate) {
  if(!aDate || !bDate) return false;
  return(
    (aDate.getFullYear() === bDate.getFullYear()) &&
    (aDate.getMonth() === bDate.getMonth()) &&
    (aDate.getDate() === bDate.getDate())
  )
}
