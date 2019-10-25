import { h, Component } from 'preact';
import {
  Container,
  Row,
  Cell,
  IconContainer,
  ArrowContainer,
} from './Style.js';
import TableHeader from './TableInfo/TableHeader.js';
import TableFooter from './TableInfo/TableFooter.js';
import Loader from './TableLoader.js';
import Arrow from './Arrow.js';

/**
 * TableX Parameters
 * @param {Object}  headers           -Required-  Describes columns for the table
 * @param {Array}   data              -Required-  Data to render
 * @param {Object}  groups                        Defines a configuration for a grouped table
 * @param {Array}   perPageOpts                   Override Per Page Options (set at mount)
 * @param {Number}  perPage                       Override Starting Per Page Option (set at mount)
 * @param {Boolean} isLoading                     Displays loader in body of table
 * @param {Boolean} paginated                     Enables pagination controls
 * @param {String}  selectType                    Defines what kinds of selection type for groups ["single", "multiple"]
 * @param {String}  className                     Defines a classname to apply to the container
 * @param {Function}onClickRow                    Defines function to call when row is clicked
 * @param {String}  rowClassName                  Defines a classname to apply to each row
 * @param {Function} conditionalRowClassFn        Determines whether to attach the "conditionalRowClassName"
 * @param {String}  conditionalRowClassName       Conditional class name to apply
 */

/**
 * headers Object
 * @key       {String}      key               -Required-  Key that describes a column (default for column header)
 * @property  {Function}    render                        Describes what to render in that column's cells
 * @property  {String}      renderProperty                Describes a property on the data object to display
 * @property  {String}      class                         Class to assign to that column
 * @property  {Function}    header                        Overrides the key of the object
 * @property  {Function}    sort                          Describes a function to sort the column by
 * @property  {String}      sortProperty                  Describes a property on the data object to sort by
 */

 /**
  * groups Object (requires 'selectType' property)
  * @key      {String}    key                   -Required-  Describes the property to group by
  * @property {Number}    order                             Defines what leveled order for multi-group tables
  * @property {Function}  render                            Defines what to render
  */

export default class TableX extends Component{

  constructor(props) {
    super(props)
    this.state = {
      sortingKey: undefined,
      inverse: false,
      currentPage: 0,
      perPage: props.perPage || 10,
      perPageOpts: props.perPageOpts || [10, 25, 50, 75, 100],
      selectedGroups: {},
      selectType: props.selectType
    }
  }

  _sort = (data = this.props.data) => {
    const { props, state } = this

    // Return if not sorting
    if(!state.sortingKey) return data

    // User custom sort function
    const sortFn = props.headers[state.sortingKey].sort
    if(sortFn) return data.sort((a, b) => { return sortFn(a, b, state.inverse) })

    // Use 'sortProperty' to sort
    const sortProperty = props.headers[state.sortingKey].sortProperty
    if(sortProperty) return data.sort((a, b) => {
      if(!state.inverse) {
        if(a[sortProperty] < b[sortProperty]) { return -1; }
        if(a[sortProperty] > b[sortProperty]) { return 1; }
        return 0;
      }
      if(state.inverse) {
        if(a[sortProperty] > b[sortProperty]) { return -1; }
        if(a[sortProperty] < b[sortProperty]) { return 1; }
        return 0;
      }
    })

    // Return if sorting is not defined
    return data
  }

  _paginate = (rowData) => {
    const { props, state } = this

    if(!props.paginated) return rowData
    const firstIndex = (state.currentPage * state.perPage)
    const lastIndex = (state.currentPage * state.perPage) + state.perPage
    return rowData.slice(firstIndex, lastIndex)
  }

  _group = () => {

  }

  _handleColumnClick = (e) => {
    const { props, state } = this
    const value = e
    const canSort = props.headers[value].sort || props.headers[value].sortProperty
    if(props.headers[value] && canSort) {
      if(state.sortingKey !== value) {
        this.setState({ sortingKey: value, inverse: false })
      }
      else if(state.sortingKey === value && !state.inverse) {
        this.setState({ inverse: true })
      }
      else if(state.sortingKey === value && state.inverse) {
        this.setState({ sortingKey: undefined, inverse: true })
      }
    }
  }

  changePerPage = (e) => {
    this.setState({ perPage: e.value, currentPage: 0 })
  }
  changeCurrentPage = (e) => {
    this.setState({ currentPage: e })
  }

  renderHeaders = () => {
    const { props, state } = this

    return(
      <Row header>
        {
          Object.keys(props.headers).map(key => {
            const column = props.headers[key]
            return(
              <Cell
                className={column.class || ''}
                header
                canSort={!!column.sort || !!column.sortProperty}
                onClick={() => this._handleColumnClick(key)}
              >
                {
                  column.header ?
                  column.header() :
                  <span>{key}</span>
                }
                {
                  state.sortingKey === key &&
                  <Arrow
                    direction={(state.inverse) ? 'down' : 'up'}
                  />
                }
              </Cell>
            )
          })
        }
      </Row>
    )
  }
  renderBody = () => {
    const { props, state } = this
    const keys = Object.keys(props.headers)
    const rowData = this._sort()
    const pagedData = this._paginate(rowData)

    return(
      <div>
        {
          pagedData.map((data) => {
            const conditionalClass = (props.conditionalRowClassFn && props.conditionalRowClassName) ? (props.conditionalRowClassFn(data) ? (props.conditionalRowClassName) : ('')) : ('')
            return(
            <Row className={`${props.rowClassName ? props.rowClassName : ''} ${conditionalClass}`} onClick={(props.onClickRow) && (() => props.onClickRow(data))}>
              {
                keys.map(key => {
                  const column = props.headers[key]
                  const doConditionalRender = column.conditionalRender && column.condition && column.condition(data)
                  return(
                    <Cell
                      className={(column.class || '')}
                    >
                      {
                        doConditionalRender &&
                        column.conditionalRender(data)
                      }
                      {
                        !doConditionalRender && column.render &&
                        column.render(data)
                      }
                      {
                        !doConditionalRender && column.renderProperty && data[column.renderProperty]
                      }
                    </Cell>
                  )
                })
              }
            </Row>
          )})
        }
      </div>
    )
  }
  renderGroupedBody = () => {
    const { props } = this

    // Format Group Config
    const groupConfig = []
    Object.keys(props.groups).forEach((key) => {
      groupConfig.push({
        groupProperty: props.groups[key].groupProperty || key,
        order: props.groups[key].order,
        render: props.groups[key].render
      })
    })
    groupConfig.sort((a, b) => a.order - b.order)

    // Get Unique Groups From Data
    const groups = []
    const firstProperty = groupConfig[0].groupProperty

    const groupCategories = this.getGroups(props.data, firstProperty)
    Object.keys(groupCategories).forEach((category) => {
      const items = props.data.filter(x => x[firstProperty].toString() === category)
      const nextLevel = this.getNextLevel(groupConfig, items, 1)

      groups.push({
        type: firstProperty,
        group: category,
        items: items,
        subGroups: nextLevel
      })
    })

    const root = {
      group: 'root',
      items: props.data,
      subGroups: groups,
      type: 'root'
    }
    const numberOfLevels = groupConfig.length
    const flatMap = this.flatten(groups, numberOfLevels)
    return this.getRenderableLevel(groups, root, groupConfig, flatMap)
  }

  getNextLevel = (groupConfig, items, level) => {
    if(!groupConfig[level]) {
      return items
    }

    const groups = []
    const groupType = groupConfig[level].groupProperty
    const groupCategories = this.getGroups(items, groupType)

    Object.keys(groupCategories).forEach((category) => {
      const filteredItems = items.filter(x => x[groupType].toString() === category)
      const nextLevel = this.getNextLevel(groupConfig, filteredItems, level + 1)

      groups.push({
        type: groupType,
        group: category,
        items: filteredItems,
        subGroups: nextLevel
      })
    })

    return groups
  }

  getGroups = (items, property) => {
    const grouping = {}
    items.forEach((obj) => {
      grouping[ obj[property] ] =  obj[property]
    })
    return grouping
  }

  getRenderableLevel = (level, parent, groupConfig, flatMap, levelIdx = 0, renderable = []) => {
    const numberOfLevels = groupConfig.length

    if(levelIdx === numberOfLevels) {
      //render items normally
      const keys = Object.keys(this.props.headers)
      const data = this._sort(level)
      data.forEach((data) => {
        renderable.push(
          <Row groupIndex={levelIdx*40}>
              {
                keys.map(key => {
                  const column = this.props.headers[key]
                  const doConditionalRender = column.conditionalRender && column.condition && column.condition(data)
                  return(
                    <Cell
                      className={(column.class || '')}
                    >
                      {
                        doConditionalRender &&
                        column.conditionalRender(data)
                      }
                      {
                        !doConditionalRender && column.render &&
                        column.render(data)
                      }
                      {
                        !doConditionalRender && column.renderProperty && data[column.renderProperty]
                      }
                    </Cell>
                  )
                })
              }
            </Row>
        )
      })
      return renderable
    }

    const config = groupConfig[levelIdx]
    level.forEach((category) => {
      const isOpen = this.isLevelOpen(category.type, category.group)

      renderable.push(
        <Row
          group
          groupIndex={levelIdx*40}
          onClick={() => this.selectGroup(category.type, category.group)}
        >
          {config.render({
            group: category,
            parent: parent,
            isOpen: isOpen,
            flatMap: flatMap,
            flatGroup: this.findFlatGroup(flatMap, category, parent)
          })}
        </Row>
      )
      if(isOpen) {
        renderable.concat(this.getRenderableLevel(category.subGroups, category, groupConfig, flatMap, levelIdx+1, renderable))
      }
    })

    return renderable
  }

  findFlatGroup = (flatMap, group, parent) => {
    let found  = null
    flatMap.forEach((x) => {
      const matchType = x.type === group.type
      const matchGroup = x.group === group.group
      const matchParent = this.isParentEqual(x, parent)
      if(matchType && matchGroup && matchParent) {
        found = x
      }
    })
    return found
  }

  isParentEqual = (flatValue, parent) => {
		if(!parent) {
			return(
				flatValue.parent === null
			)
		}
		if(!flatValue.parent) {
			return(
				parent.type === 'root'
			)
		}
		return(
			(flatValue.parent.type === parent.type) &&
			(flatValue.parent.group === parent.group)
		)
	}


  flatten = (config, numberOfLevels, currentLevel = 0, array = [], parent = null) => {
    if(numberOfLevels === currentLevel) {
      return array
    }
    config.forEach((x) => {
      array.push({
        type: x.type,
        group: x.group,
        parent: parent
      })
      this.flatten(x.subGroups, numberOfLevels, currentLevel+1, array, x)
    })
    return array
  }

  selectGroup = (group, category) => {
    const { state } = this

    if(state.selectType === 'single') {
      const keys = Object.keys(state.selectedGroups)
      if(keys.includes(group) && state.selectedGroups[group].includes(category)) {
        const selectedGroups = { ...state.selectedGroups, [group]: [] }
        this.setState({ selectedGroups: selectedGroups })
      }
      else {
        const selectedGroups = { ...state.selectedGroups, [group]: [category] }

        //Remove lower levels from being selected
        const keys = Object.keys(this.props.groups)
        const currentOrder = this.props.groups[group].order
        keys.forEach((key) => {
          const config = this.props.groups[key]
          if(config.order > currentOrder) {
            selectedGroups[key] = []
          }
        })

        this.setState({
          selectedGroups: selectedGroups
        })
      }
    }
    else if(state.selectType === 'multiple') {
      const keys = Object.keys(state.selectedGroups)
      if(keys.includes(group) && state.selectedGroups[group].includes(category)) {
        const selectedGroups = {
          ...state.selectedGroups,
          [group]: state.selectedGroups[group].filter(x => x !== category)
        }
        this.setState({ selectedGroups: selectedGroups })
      }
      else {
        let selectedGroups = { ...state.selectedGroups }
        if(state.selectedGroups[group]) {
          selectedGroups[group] = selectedGroups[group].concat([category])
        }
        else {
          selectedGroups = { ...state.selectedGroups, [group]: [category] }
        }

        //Remove lower levels from being selected
        const keys = Object.keys(this.props.groups)
        const currentOrder = this.props.groups[group].order
        keys.forEach((key) => {
          const config = this.props.groups[key]
          if(config.order > currentOrder) {
            selectedGroups[key] = []
          }
        })

        this.setState({
          selectedGroups: selectedGroups
        })
      }
    }
  }

  isLevelOpen = (group, category) => {
    const { state } = this
    const validGroups = Object.keys(state.selectedGroups)
    if(validGroups.includes('*')) return true
    if(!validGroups.includes(group)) return false
    const validCategories = state.selectedGroups[group].map(x => x.toString())
    if(validCategories.includes('*')) return true
    if(validCategories.includes(category.toString())) return true
    return false
  }

  render(props, state) {
    return(
      <Container className={props.className ? props.className : ''}>
        {
          props.paginated &&
          <TableHeader
            currentPage={state.currentPage}
            perPage={state.perPage}
            perPageOpts={state.perPageOpts}
            changePerPage={this.changePerPage}
            changeCurrentPage={this.changeCurrentPage}
            total={props.data.length}
            minimal={props.minimalHeader}
          />
        }
        {this.renderHeaders()}
        {
          !props.groups &&
          this.renderBody()
        }
        {
          props.groups &&
          this.renderGroupedBody()
        }
        {
          props.isLoading &&
          <Loader />
        }
        {
          props.paginated &&
          <TableFooter
            currentPage={state.currentPage}
            total={props.data.length}
            perPage={state.perPage}
            changeCurrentPage={this.changeCurrentPage}
            minimal={props.minimalHeader}
          />
        }
      </Container>
    )
  }

}
