import React, { useState } from 'react'
import { Link, NavLink, Outlet, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

export default function ResNav() {
  return (
    <div>
      <div className="body-box-new sectio new-settings-box" style={{ border: 'none' }}>
        <div className="new-settings-menu">
          <div className="menu-list">
            <div>
              <NavLink to="overview"> Overview </NavLink>
            </div>
            <div>
              <NavLink to="notes">Notes</NavLink>
            </div>
            <div>
              <NavLink to="vehicles"> Vehicles </NavLink>
            </div>
            <div>
              <NavLink to="history"> History </NavLink>
            </div>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  )
}
