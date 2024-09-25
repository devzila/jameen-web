import React from 'react'
import { NavLink } from 'react-router-dom'

export default function PropertyNav() {
  return (
    <div className="container-fluid" style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
      <div className="body-box-new sectio new-settings-box" style={{ border: 'none' }}>
        <div className="new-settings-menu">
          <div className="menu-list">
            <div>
              <NavLink to="overview"> Overview </NavLink>
            </div>
            <div>
              <NavLink to="unit">Unit</NavLink>
            </div>
            <div>
              <NavLink to="unit-types"> Unit Types </NavLink>
            </div>
            <div>
              <NavLink to="Buildings"> Buildings </NavLink>
            </div>
            <div>
              <NavLink to="ParkingLot"> Parking Lot </NavLink>
            </div>
            <div>
              <NavLink to="Contracts"> Contracts </NavLink>
            </div>
            <div>
              <NavLink to="maintenance-requests"> Maintenance </NavLink>
            </div>
            <div>
              <NavLink to="templates"> Templates </NavLink>
            </div>
            <div>
              <NavLink to="Invoices"> Invoices </NavLink>
            </div>
            <div>
              <NavLink to="assets"> Assets </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
