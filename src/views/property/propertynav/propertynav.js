import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import User from './User/User'

export default function Nav({ children }) {
  const [show, setShow] = useState(false)
  const handleShow = () => setShow(true)

  return (
    <div className="body-box-new sectio new-settings-box" style={{ border: 'none' }}>
      <div className="new-settings-menu">
        <div className="menu-list">
          <div>
            <NavLink to="/settings/roles"> Role </NavLink>
          </div>
          <div>
            <NavLink to="/settings/users">User</NavLink>
          </div>
          <div>
            <NavLink to="/settings/allotment"> Allotment </NavLink>
          </div>
          <div>
            <NavLink to="/settings/moving-out"> Moving Out </NavLink>
          </div>
          <div>
            <NavLink to="/settings/integrations"> Integrations </NavLink>
          </div>
          <div>
            <NavLink to="/settings/workflow_settings"> Workflow </NavLink>
          </div>
        </div>
      </div>
      {/*<div className="clearfix">{children || <User />}</div>*/}
    </div>
  )
}

Nav.propTypes = {
  children: PropTypes.node,
}
