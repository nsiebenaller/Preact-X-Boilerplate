import { h, Component } from 'preact';
import { ArrowDropUp, ArrowDropDown } from '@Icons';
import style from './table.css';
import {
  groupBy,
  sortBy,
  formSortedGroupedRows,
  getPagedData,
} from './functions.js'

/*
	PROPS
  @param: rowComponent - required
  @param: headers - required
  @param: data - required
  @param: perPage - optional (default: 25)
	@param: group - optional
	@param: defaultSort - optional
	@param: containerClass - optional
	@param: tableClass - optional
  @param: hidePerPage - optional
*/

export default class Table extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currPage: 0,
      isDefault: true,
      sortingKey: "",
      sortingReverse: false,
      perPage: props.perPage ? props.perPage : 25
    }
  }

  toggleSort = (header) => {
    const {props, state} = this
    if(state.sortingKey !== header) {
      this.setState({
        sortingKey: header,
        sortingReverse: false
      })
    }
    else if(state.sortingKey === header) {
      if(!state.sortingReverse) {
        this.setState({sortingReverse: true})
      }
      else {
        this.setState({
          sortingKey: '',
          sortingReverse: false
        })
      }
    }
  }

  renderBody = () => {
    const {
      isDefault,
      currPage,
      perPage,
      sortingKey,
      sortingReverse,
    } = this.state
    const {
      data,
      headers,
      group,
      defaultSort,
    } = this.props
    const Row = this.props.rowComponent
    const ExpandedRow = this.props.expandedRow
    const showGroups = (!!group)

    let rowData
    if(this.props.firstItem) {
      rowData = data.filter(x => x.id !== this.props.firstItem.id)
    }
    else {
      rowData = this.props.data
    }

    if(isDefault) {
      const sorted = sortBy(rowData, group, true)
      const paged = getPagedData(sorted, currPage, perPage)
      const grouped = groupBy(paged, group)
      const updated = (sortingKey === "") ?
        formSortedGroupedRows(grouped, false, defaultSort, showGroups) :
        formSortedGroupedRows(grouped, sortingReverse, headers[sortingKey], showGroups)

      const rows = updated.map((e, i) => (
        <tbody key={`u-row-${i}`}>
          <Row data={e} />
          {ExpandedRow && !e.group && <ExpandedRow data={e} />}
        </tbody>
      ))

      if(this.props.firstItem) {
        rows.unshift(
          <tbody key={`u-row-first`}>
            <Row data={this.props.firstItem} />
            {ExpandedRow && !this.props.firstItem.group && <ExpandedRow data={this.props.firstItem} />}
          </tbody>
        )
      }

      return rows
    }

  }

  renderHeaders = () => {
    const {props, state} = this

    return(
      <thead class={style.tableHeader}>
        {
          Object.keys(props.headers).map(header => {
            return(<th
              key={`u-head-${header}`}
              onClick={() => {this.toggleSort(header)}}
             >
              <div>
                <HeadArrows
                  sortingKey={state.sortingKey}
                  sortingReverse={state.sortingReverse}
                  header={header}
                />
                <div class={style.headerText}>{header}</div>
              </div>
             </th>)
          })
        }
      </thead>
    )
  }

  changePage = (page) => {
    if(this.state.currPage !== page) {
      this.setState({currPage: page})
    }
  }

  changePerPage = (perPage) => {
    this.setState({perPage: perPage})
  }

  render(props, state) {
    const ActionComponent = props.actionComponent
    return(
      <div>
        {
          props.actionComponent &&
          <div class={style.actionComponent}>
            <ActionComponent />
          </div>
        }
        <Showing
          dataTotal={props.data.length}
          currPage={state.currPage}
          perPage={state.perPage}
        />
        {
          !props.hidePerPage &&
          <NumEntries
            perPage={state.perPage}
            changePerPage={this.changePerPage}
          />
        }
        <Paginator
          changePage={this.changePage}
          dataTotal={props.data.length}
          currPage={state.currPage}
          perPage={state.perPage}
        />
        <div class={`${style.container} ${props.containerClass}`}>
        <table
          class={`${style.table} ${props.tableClass}`}
          cellpadding="0"
          cellspacing="0"
        >
          {this.renderHeaders()}
          {this.renderBody()}
        </table>
        </div>
        <Paginator
          changePage={this.changePage}
          dataTotal={props.data.length}
          currPage={state.currPage}
          perPage={state.perPage}
        />
      </div>
    )
  }
}

const HeadArrows = (props) => {
  const icoDisable = (props.sortingKey === props.header) ? (props.sortingReverse ? "up" : "down") : ("")
  return(
    <div class={style.headerIcon}>
      <div class={style.iconContainer}>
      <ArrowDropUp
        class={`${style.muiTop} ${style.muiIcon} ${icoDisable === "up" ? style.visNone : "" }`}
      />
      </div>
      <div class={style.iconContainer}>
      <ArrowDropDown
        class={`${style.muiBot} ${style.muiIcon} ${icoDisable === "down" ? style.visNone : ""}`}
      />
      </div>
    </div>
  )
}

const Paginator = (props) => {
  const numBtns = Math.ceil(props.dataTotal / props.perPage)
  const pages = []
  for(let i = 0; i < numBtns; i ++) {
    pages.push(i + 1)
  }
  let chunk = pages
  if(pages.length > 5) {
    const low = (props.currPage < 2) ? (0) : (props.currPage - 2)
    chunk = pages.slice(low, low + 5)
  }
  return(
    <div class={style.paginator}>
      <div
        class={`${style.pButton} ${props.currPage === 0 ? style.cDisabled : ''}`}
        onClick={() => {
          if(chunk.includes(props.currPage)) {
            props.changePage(props.currPage-1)
          }
        }}
      >Previous</div>
      <div class={style.pCont}>{(chunk[0] !== 1) ? ("...") : ("")}</div>
      {
        chunk.map((page, k) => {
          return(
          <div
            key={`pag-key-${k}`}
            class={(page-1 === props.currPage) ? (`${style.pPage} ${style.pActive}`) : (`${style.pPage}`)}
            onClick={() => props.changePage(page-1)}
          >{page}</div>
        )})
      }
      <div class={style.pCont}>{(chunk[chunk.length-1] !== pages[pages.length-1]) ? ("...") : ("")}</div>
      <div
        class={`${style.pButton} ${props.currPage === pages.length-1 ? style.cDisabled : ''}`}
        onClick={() => {
          if(pages.includes(props.currPage+2)) {
            props.changePage(props.currPage+1)
          }
        }}
      >Next</div>
    </div>
  )
}

const Showing = (props) => {
  const start = (props.dataTotal === 0) ? (0) : (((props.currPage)*props.perPage)+1)
  const last = ((start+props.perPage)-1 > props.dataTotal) ? (props.dataTotal) : ((start+props.perPage)-1)
  return(<div class={style.showing}>Showing {start} - {last} of {props.dataTotal} items</div>)
}

const NumEntries = (props) => {
  const opts = [
    {
      label: "25",
      value: 25
    },
    {
      label: "50",
      value: 50
    },
    {
      label: "100",
      value: 100
    },
    {
      label: "200",
      value: 200
    }
  ]
  return(
    <div class={style.entries}>
      Showing
      <ShowDropdown
        onChange={(e) => props.changePerPage(parseInt(e.value))}
        options={opts}
        value={props.perPage}
      />
      entries
    </div>)
}
class ShowDropdown extends Component {
  constructor(props) {
    super(props)
    this.state = {
      opened: false
    }
  }

  render(props, state) {
    const cClass = (props.class) ? (props.class) : ("")
    return(
      <div class={`${style.cDropdown} ${cClass}`}
        ref={dropdown => this.dropdown = dropdown}
        tabindex="0" //use this to recieve blur/focus
        onFocus={() => {this.setState({opened: true})}}
        onBlur={() => {this.setState({opened: false})}}
      >
        <div>
          {(props.value) ? (props.value) : ("select")}
          <ArrowDropDown
            class={style.cArrow}
          />
        </div>
        <div class={(state.opened) ? (`${style.cDrop}`) : (`${style.cDrop} ${style.cClose}`)}>
					{
						props.options.map((opt) => {
							const selClass = (parseInt(opt.label) === props.value) ? (`${style.cSel}`) : ("")
							return(
								<div
									class={`${style.cOption} ${selClass}`}
									value={opt.value}
									onClick={(e) => {
										props.onChange(opt)
										this.dropdown.blur()
									}}
								>{opt.label}</div>
							)
						})
					}
				</div>
      </div>

    )
  }
}
