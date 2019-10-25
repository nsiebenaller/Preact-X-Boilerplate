import { h, Component } from 'preact'
import {
  Dropdown,
  Button,
  AutoComplete,
} from '@Shared'
import {formOptions, getUnique} from '@Helpers/index.js'

const autoMap = {
  "Log Number": 'logNo',
  "Award Number": 'awardNumber'
}

const DefaultSearch = ({textfieldOption, applications, textfield, setState, search}) => (
  <div className="default-search-bar">
    <Dropdown
      class="action-dd"
      value={textfieldOption}
      options={formOptions(["Log Number", "Award Number"])}
      onChange={(opt) => setState({textfieldOption: opt.value, textfield: ''})}
    />
    <AutoComplete
      options={getUnique(applications.map(app => app[autoMap[textfieldOption]]))}
      value={textfield}
      onChange={(e) => setState({textfield: e})}
    />
    <Button
      class="fix-height"
      onClick={search}
    >Search</Button>
  </div>
)

export default DefaultSearch
