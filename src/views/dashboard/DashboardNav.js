import { freeSet } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import PropTypes from 'prop-types'
import React from 'react'
import { NavLink } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function DashboardNav() {
  return (
    <div className=" d-flex justify-content-center container-fluid mt-2 ">
      <div className="body-box-new new-settings-box border-0 menu-items">
        <div className="new-settings-menu  shadow-sm  bg-white rounded-pill">
          <div className="ms-5">
            <NavLink to="/dashboard/overview" className="p-3 ">
              <CIcon icon={freeSet.cilLayers} size="xxl" />
            </NavLink>
          </div>
          <div>
            <NavLink to="/dashboard/finance" className="p-3 ">
              <CIcon icon={freeSet.cilCash} size="xxl" />
            </NavLink>
          </div>
          <div className="me-5">
            <NavLink to="/dashboard/maintenance" className="p-3">
              <CIcon icon={freeSet.cilFactorySlash} size="xxl" />
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  )
}
