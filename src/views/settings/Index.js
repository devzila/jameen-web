import React, { Suspense } from 'react'
import { Navigate, Route, Routes, Link, Outlet } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'

export default function Index() {
  const User = React.lazy(() => import('./User'))
  const Role = React.lazy(() => import('./Role'))

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
              <Link className="nav-link" to="/settings/roles">
                Roles
              </Link>
              <Link className="nav-link" to="/settings/users">
                User
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <CContainer lg>
        <Routes>
          <Route path="roles" name="Role" element={<Role />} />
          <Route path="users" name="User" element={<User />} />
        </Routes>
      </CContainer>
    </>
  )
}
