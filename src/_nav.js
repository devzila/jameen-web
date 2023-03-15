import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilMoney,
  cilBarChart,
  cilNewspaper,
  cilSettings,
  cilPeople,
  cilGarage,
  cilGroup,
  cilCalculator,
  cilHouse,
  cilInstitution,
  cilSpeedometer,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavItem,
    name: 'Finance',
    to: '/theme/colors',
    icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Residents',
    to: '/theme/typography',
    icon: <CIcon icon={cilGroup} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Units',
    to: '/charts',
    icon: <CIcon icon={cilHouse} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Properties',
    to: '/widgets',
    icon: <CIcon icon={cilInstitution} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavItem,
    name: 'Maintenance',
    href: 'https://coreui.io/react/docs/templates/installation/',
    icon: <CIcon icon={cilGarage} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Visitors',
    href: 'https://coreui.io/react/docs/templates/installation/',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Operations',
    href: 'https://coreui.io/react/docs/templates/installation/',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'News/Posts',
    href: 'https://coreui.io/react/docs/templates/installation/',
    icon: <CIcon icon={cilNewspaper} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Reports',
    href: 'https://coreui.io/react/docs/templates/installation/',
    icon: <CIcon icon={cilBarChart} customClassName="nav-icon" />,
  },
]

export default _nav
