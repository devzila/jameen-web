import React, { Suspense } from 'react'
import { Navigate, Route, Routes, Link, Outlet } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import Nav from './Nav'
import Role from './Role/Role'
export default function Index() {
  const User = React.lazy(() => import('./User/User'))

  const Integrations = React.lazy(() => import('./Intergrations'))
  const WorkFlow = React.lazy(() => import('./Workflow'))
  const Maintenance = React.lazy(() => import('./MaintenanceStaff/MaintenanaceStaff'))
  const Security = React.lazy(() => import('./SecurityStaff/SecurityStaff'))

  return (
    <>
      <Nav />
      <CContainer fluid>
        <Routes path="/settings" element={<Role />}>
          <Route path="roles" name="Role" element={<Role />} />
          <Route path="users" name="User" element={<User />} />
          <Route path="maintenance" name="Maintenance" element={<Maintenance />} />
          <Route path="security" name="Security" element={<Security />} />
          <Route path="integrations" name="Integrations" element={<Integrations />} />
          <Route path="workflow" name="Workflow" element={<WorkFlow />} />
        </Routes>
      </CContainer>
    </>
  )
}
