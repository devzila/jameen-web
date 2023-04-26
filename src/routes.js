import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Finance = React.lazy(() => import('./views/finance/Finance'))
const Resident = React.lazy(() => import('./views/resident/Resident'))
const Unit = React.lazy(() => import('./views/unit/Unit'))
const Property = React.lazy(() => import('./views/property/Property'))
const Maintenance = React.lazy(() => import('./views/maintenance/Maintenance'))
const Visitor = React.lazy(() => import('./views/visitor/Visitor'))
const Operation = React.lazy(() => import('./views/operation/Operation'))
const News = React.lazy(() => import('./views/news/News'))
const Report = React.lazy(() => import('./views/report/Report'))
const Settings = React.lazy(() => import('./views/settings/Settings'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/finance', name: 'Fianance', element: Finance, exact: true },
  { path: '/resident', name: 'Resident', element: Resident },
  { path: '/unit', name: 'Unit', element: Unit },
  { path: '/property', name: 'Property', element: Property, exact: true },
  { path: '/maintenance', name: 'Maintenance', element: Maintenance },
  { path: '/visitor', name: 'Visitor', element: Visitor },
  { path: '/operation', name: 'Operation', element: Operation },
  { path: '/news', name: 'News', element: News },
  { path: '/report', name: 'Report', element: Report },
  { path: '/settings', name: 'Settings', element: Settings },
]

export default routes
