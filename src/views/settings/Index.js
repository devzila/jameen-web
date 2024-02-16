import React, { Suspense } from 'react'
import { Navigate, Route, Routes, Link, Outlet } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import Nav from './Nav'

export default function Index() {
  const User = React.lazy(() => import('./User/User'))
  const Role = React.lazy(() => import('./Role/Role'))
  const Allotment = React.lazy(() => import('./Allotment'))
  const MovingOut = React.lazy(() => import('./MovingOut'))

  const Integrations = React.lazy(() => import('./Intergrations'))
  const WorkFlow = React.lazy(() => import('./Workflow'))

  return (
    <>
      <Nav />
      <CContainer lg>
        <Routes>
          <Route path="roles" name="Role" element={<Role />} />
          <Route path="users" name="User" element={<User />} />
          <Route path="allotment" name="Allotment" element={<Allotment />} />
          <Route path="moving-out" name="MovingOut" element={<MovingOut />} />
          <Route path="integrations" name="Integrations" element={<Integrations />} />
          <Route path="moving-out" name="MovingOut" element={<MovingOut />} />
          <Route path="workflow" name="Workflow" element={<WorkFlow />} />
        </Routes>
      </CContainer>
    </>
  )
}
