import React from 'react'
import { Link, NavLink } from 'react-router-dom'

export default function PropertyNav() {
  return (
    <div className="body-box-new sectio new-settings-box" style={{ border: 'none' }}>
      <div className="new-settings-menu">
        <div className="menu-list">
          <div>
            <NavLink end to="OverviewContent">
              Overview
            </NavLink>
            <NavLink to="overview"> Overview </NavLink>
          </div>
          <div>
            <NavLink to="unit">Unit</NavLink>
          </div>
          <div>
            <NavLink to="unit-types"> Unit Types </NavLink>
          </div>
          <div>
            <NavLink to="ParkingLot"> Parking Lot </NavLink>
          </div>
          <div>
            <NavLink to="Documents"> Documents </NavLink>
          </div>
          <div>
            <NavLink to="Billing"> Billing </NavLink>
          </div>
          <div>
            <NavLink to="/*"> Invoice Setting </NavLink>
          </div>
        </div>
      </div>
    </div>
  )
}
