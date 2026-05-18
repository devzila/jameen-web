import React from 'react'
import { NavLink } from 'react-router-dom'
import CheckPermissions from 'src/permissions/CheckPermissions'

export default function PropertyNav() {
  return (
    <div className="container-fluid" style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
      <div className="body-box-new sectio new-settings-box" style={{ border: 'none' }}>
        <div className="new-settings-menu">
          <div className="menu-list">
            <div>
              <NavLink to="overview"> Overview </NavLink>
            </div>
            <CheckPermissions
              component={
                <div>
                  <NavLink to="unit">Unit</NavLink>
                </div>
              }
              keys={['unit', 'view']}
            />

            <div>
              <NavLink to="unit-types"> Unit Types </NavLink>
            </div>
            <div>
              <NavLink to="Buildings"> Buildings </NavLink>
            </div>
            <div>
              <NavLink to="ParkingLot"> Parking Lot </NavLink>
            </div>
            <CheckPermissions
              component={
                <div>
                  <NavLink title="Allotment" to="Contracts">
                    Contracts
                  </NavLink>
                </div>
              }
              keys={['operation', 'manage_allotment']}
            />
            <CheckPermissions
              component={
                <div>
                  <NavLink to="moving-in"> Moving In </NavLink>
                </div>
              }
              keys={['operation', 'manage_moving_in']}
            />
            <CheckPermissions
              component={
                <div>
                  <NavLink to="maintenance-requests"> Maintenance </NavLink>
                </div>
              }
              keys={['maintenance_requests', 'view']}
            />

            <div>
              <NavLink to="templates"> Templates </NavLink>
            </div>

            <CheckPermissions
              component={
                <div>
                  <NavLink to="Invoices"> Invoices </NavLink>
                </div>
              }
              keys={['invoice', 'view']}
            />

            <div>
              <NavLink to="assets"> Assets </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
