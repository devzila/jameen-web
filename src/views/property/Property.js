import React, { useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import OverviewContent from './propertynav/OverviewContent'

export default function Property({ children }) {
  const { propertyId, unitTypeId } = useParams()
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="body-box-new section new-settings-box" style={{ border: 'none' }}>
      <div className="new-settings-menu">
        <div className="menu-list">
          <div>
            <NavLink
              to={`/property/${propertyId}/OverviewContent`}
              className={activeTab === 'overview' ? 'active' : ''}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </NavLink>
          </div>
          <div>
            <NavLink
              to={`/property/${propertyId}/PropertyUnit`}
              className={activeTab === 'unit' ? 'active' : ''}
              onClick={() => setActiveTab('units')}
            >
              unit
            </NavLink>
          </div>
          <div>
            <NavLink
              to={`/property/${propertyId}/BillableItems`}
              className={activeTab === 'billableItems' ? 'active' : ''}
              onClick={() => setActiveTab('billableItems')}
            >
              Unit Types
            </NavLink>
          </div>
          <div>
            <NavLink
              to={`/property/${propertyId}/ParkingLot`}
              className={activeTab === 'parkingLot' ? 'active' : ''}
              onClick={() => setActiveTab('parkingLot')}
            >
              Parking Lot
            </NavLink>
          </div>
          <div>
            <NavLink
              to={`/property/${propertyId}/Documents`}
              className={activeTab === 'Documents' ? 'active' : ''}
              onClick={() => setActiveTab('Documents')}
            >
              Documents
            </NavLink>
          </div>

          <div>
            <NavLink
              to={`/property/${propertyId}/Billing`}
              className={activeTab === 'Billing' ? 'active' : ''}
              onClick={() => setActiveTab('Billing')}
            >
              Billing
            </NavLink>
          </div>
          <div>
            <NavLink to="/#">Invoice Setting </NavLink>
          </div>
          <div>
            <NavLink to="/#">Notes </NavLink>
          </div>
        </div>
      </div>
      {activeTab === 'overview' && <OverviewContent />}
    </div>
  )
}

Property.propTypes = {
  children: PropTypes.node,
}
