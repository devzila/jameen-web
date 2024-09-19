import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilMoney,
  cilBarChart,
  cilNewspaper,
  cilSettings,
  cilPeople,
  cibViber,
  cilInstitution,
  cilSpeedometer,
  cilWc,
  cibLaunchpad,
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
    name: 'Maintenance Category',
    to: '/maintenance-category',
    icon: <CIcon icon={cibViber} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Visitors',
    to: 'visitor',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Operations',
    to: 'operation',
    icon: <CIcon icon={cibLaunchpad} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'News/Posts',
    to: '/news',
    icon: <CIcon icon={cilNewspaper} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Reports',
    to: '/report',
    icon: <CIcon icon={cilBarChart} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Settings',
    to: '/settings/roles',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
  },
]

export default _nav
