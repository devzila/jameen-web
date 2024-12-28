import React, { useContext, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import { AuthContext } from 'src/contexts/AuthContext'

export default function SettingsNav() {
  const { role } = useContext(AuthContext)?.state
  const settings_privileges = role?.privileges

  const navLinks = [
    { name: 'Role', url: '/settings/roles' },
    { name: 'User ', url: '/settings/users' },
    { name: 'Security Staff', url: '/settings/security' },
    { name: 'Maintenance Staff', url: '/settings/maintenance' },
    { name: 'Maintenance Categories', url: '/settings/maintenance-categories' },
    { name: 'Integrations', url: '/settings/integrations' },
    { name: 'Workflow', url: '/settings/workflow' },
  ]
  return (
    <div className="body-box-new sectio new-settings-box border-0 ">
      <div className="new-settings-menu container-fluid ms-2">
        <div className="menu-list">
          {navLinks.map((link, index) => (
            <div key={index}>
              <NavLink to={link.url}>{link.name}</NavLink>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

SettingsNav.propTypes = {
  children: PropTypes.node,
}
