import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilMoney,
  cilBarChart,
  cilNewspaper,
  cilSettings,
  cilPeople,
  cilFactorySlash,
  cilInstitution,
  cilSpeedometer,
  cilWc,
} from '@coreui/icons'
import { CNavItem } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard/overview',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavItem,
    name: 'Finance',
    to: '/finance',
    icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Residents',
    to: '/resident',
    keys_data: ['resident', 'view'],
    icon: <CIcon icon={cilWc} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Properties',
    to: '/properties',
    icon: <CIcon icon={cilInstitution} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavItem,
    name: 'Maintenance Request',
    to: '/maintenance-request',
    keys_data: ['maintenance_requests', 'view'],
    icon: <CIcon icon={cilFactorySlash} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Visitors',
    to: 'visitor',
    keys_data: ['visitor', 'view'],
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'News/Posts',
    to: '/news',
    keys_data: ['posts', 'view'],
    icon: <CIcon icon={cilNewspaper} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Reports',
    to: '/report',
    keys_data: ['reports', 'view_finance_report'],

    icon: <CIcon icon={cilBarChart} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Settings',
    to: '/settings/users',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
  },
]

export default _nav
