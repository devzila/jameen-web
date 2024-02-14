import React, { useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import OverviewContent from './OverviewContent'

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
              to={`/property/${propertyId}/unit_types/${unitTypeId}/billable_items`}
              className={activeTab === 'billableItems' ? 'active' : ''}
              onClick={() => setActiveTab('billableItems')}
            >
              Billable Items
            </NavLink>
          </div>
          <div>
            <NavLink to="/settings/allotment"> Parking Lot </NavLink>
          </div>
          <div>
            <NavLink to="/settings/moving-out">Unit Type </NavLink>
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
