import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'

export default function Nav() {
  return (
    <div className="body-box-new sectio new-settings-box border-0 ">
      <div className="new-settings-menu container">
        <div className="menu-list">
          <div>
            <NavLink to="/settings/roles"> Role </NavLink>
          </div>
          <div>
            <NavLink to="/settings/users">User</NavLink>
          </div>
          <div>
            <NavLink to="/settings/security">Security Staff</NavLink>
          </div>
          <div>
            <NavLink to="/settings/maintenance">Maintenance Staff</NavLink>
          </div>

          <div>
            <NavLink to="/settings/integrations"> Integrations </NavLink>
          </div>
          <div>
            <NavLink to="/settings/workflow"> Workflow </NavLink>
          </div>
        </div>
      </div>
    </div>
  )
}

Nav.propTypes = {
  children: PropTypes.node,
}
