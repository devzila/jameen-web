import React, { Suspense } from 'react'
import { Navigate, Route, Routes, Link, Outlet } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import Nav from './Nav'

export default function Index() {
  const User = React.lazy(() => import('./User'))
  const Role = React.lazy(() => import('./Role'))

  return (
    <>
      <Nav />
      <CContainer lg>
        <Routes>
          <Route path="roles" name="Role" element={<Role />} />
          <Route path="users" name="User" element={<User />} />
        </Routes>
      </CContainer>
    </>
  )
}
