import { h, Component } from 'preact'
import style from './style.css'
import { Row } from './style.js'
import { ArrowDropUp, ArrowDropDown } from '@Icons'

const Header = (props) => (
  <Row header>
    <div className={`flex-row vert-align pointer no-select ${style.docTypeCell}`}
      onClick={() => props.setFilter('type')}
    >
      <div>Document Type</div>
      {
        props.sortingKey === 'type' &&
        (
          (props.ascending) ?
          (
            <ArrowDropUp />
          ) :
          (
            <ArrowDropDown />
          )
        )
      }
    </div>
    <div className="flex-row vert-align pointer no-select"
      onClick={() => props.setFilter('name')}
    >
      <div>Document Name</div>
      {
        props.sortingKey === 'name' &&
        (
          (props.ascending) ?
          (
            <ArrowDropUp />
          ) :
          (
            <ArrowDropDown />
          )
        )
      }
    </div>
    <div className="flex-row vert-align pointer no-select"
      onClick={() => props.setFilter('submittedOn')}
    >
      <div>Submitted On</div>
      {
        props.sortingKey === 'submittedOn' &&
        (
          (props.ascending) ?
          (
            <ArrowDropUp />
          ) :
          (
            <ArrowDropDown />
          )
        )
      }
    </div>
    <div className="flex-row vert-align pointer no-select"
      onClick={() => props.setFilter('isRevised')}
    >
      <div>New or Revised?</div>
      {
        props.sortingKey === 'isRevised' &&
        (
          (props.ascending) ?
          (
            <ArrowDropUp />
          ) :
          (
            <ArrowDropDown />
          )
        )
      }
    </div>
    <div className="flex-row vert-align pointer no-select"
      onClick={() => props.setFilter('label')}
    >
      <div>Label</div>
      {
        props.sortingKey === 'label' &&
        (
          (props.ascending) ?
          (
            <ArrowDropUp />
          ) :
          (
            <ArrowDropDown />
          )
        )
      }
    </div>
    <div className="flex-row vert-align pointer no-select"
      onClick={() => props.setFilter('isFinal')}
    >
      <div>Final Report?</div>
      {
        props.sortingKey === 'isFinal' &&
        (
          (props.ascending) ?
          (
            <ArrowDropUp />
          ) :
          (
            <ArrowDropDown />
          )
        )
      }
    </div>
    <div className="flex-row vert-align pointer no-select"
      onClick={() => props.setFilter('limitedDistribution')}
    >
      <div>Limited Distribution?</div>
      {
        props.sortingKey === 'limitedDistribution' &&
        (
          (props.ascending) ?
          (
            <ArrowDropUp />
          ) :
          (
            <ArrowDropDown />
          )
        )
      }
    </div>
    <div className="flex-row vert-align no-select">
      <div>Actions</div>
    </div>
  </Row>
)

export default Header


/**
 * <i class={`material-icons ${style.muiTop} ${style.muiIcon} ${icoDisable === "up" ? style.visNone : "" }`}
 >arrow_drop_up</i>
 <i class={`material-icons ${style.muiBot} ${style.muiIcon} ${icoDisable === "down" ? style.visNone : ""}`}
 >arrow_drop_down</i>
 */
