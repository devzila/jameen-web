import React from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import CheckPermissions from 'src/permissions/CheckPermissions'

export default function SettingsNav() {
  const navLinks = [
    { name: 'Role', url: '/settings/roles', keys: ['roles', 'view'] },
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
            <CheckPermissions
              component={
                <div key={index}>
                  <NavLink to={link.url}>{link.name}</NavLink>
                </div>
              }
              key={index}
              keys={link.keys}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

SettingsNav.propTypes = {
  children: PropTypes.node,
}
