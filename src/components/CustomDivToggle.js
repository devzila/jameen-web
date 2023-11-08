import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'

const CustomDivToggle = forwardRef((props, ref) => (
  <div
    ref={ref}
    onClick={(e) => {
      e.preventDefault()
      if (props.onClick) {
        props.onClick(e)
      }
    }}
  >
    {props.children}
  </div>
))

CustomDivToggle.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node,
}

CustomDivToggle.displayName = 'CustomDivToggle'

export default CustomDivToggle
