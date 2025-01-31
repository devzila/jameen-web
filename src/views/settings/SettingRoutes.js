import React, { Suspense, useContext } from 'react'
import { Navigate, Route, Routes, Link, Outlet } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import SettingsNav from './SettingsNav'
import Role from './Role/Role'
import { AuthContext } from '../../contexts/AuthContext'

export default function Index() {
  const User = React.lazy(() => import('./User/User'))

  const Integrations = React.lazy(() => import('./Intergrations'))
  const WorkFlow = React.lazy(() => import('./Workflow'))
  const Maintenance = React.lazy(() => import('./MaintenanceStaff/MaintenanaceStaff'))
  const Security = React.lazy(() => import('./SecurityStaff/SecurityStaff'))
  const MaintenanceCategories = React.lazy(() => import('./MaintenanceCategory/Maintenances'))

  const { roles } = useContext(AuthContext)?.state
  console.log(roles)

  return (
    <>
      <SettingsNav />
      <CContainer fluid>
        <Suspense>
          <Routes>
            <Route path="users" name="User" element={<User />} />
            <Route path="roles" name="Role" element={<Role />} />
            <Route path="maintenance" name="Maintenance" element={<Maintenance />} />
            <Route
              path="maintenance-categories"
              name="Maintenance Categories"
              element={<MaintenanceCategories />}
            />
            <Route path="*" element={<Navigate to="/settings/users" replace />} />
            <Route path="security" name="Security" element={<Security />} />
            <Route path="integrations" name="Integrations" element={<Integrations />} />
            <Route path="workflow" name="Workflow" element={<WorkFlow />} />
          </Routes>
        </Suspense>
      </CContainer>
    </>
  )
}
