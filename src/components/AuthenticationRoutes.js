import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer } from '@coreui/react'
import Loading from 'src/components/loading/loading'

export default function AuthenticationRoutes() {
  const ForgotPassword = React.lazy(() => import('../views/pages/password/ForgotPassword'))
  const NewPassword = React.lazy(() => import('../views/pages/password/PasswordForm'))
  const Login = React.lazy(() => import('../views/pages/login/Login'))
  const EmailSent = React.lazy(() => import('../views/pages/password/EmailSent'))
  const FindCompany = React.lazy(() => import('../views/pages/company_subdomain/FindCompany'))

  return (
    <CContainer fluid className="g-0 p-1 overflow-hidden">
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/forgot-password" name="Forgot Password" element={<ForgotPassword />} />
          <Route path="/reset-password" name="Password" element={<NewPassword />} />
          <Route path="/login" name="Login" element={<Login />} />
          <Route path="/" name="Login" element={<Login />} />
          <Route path="/email-sent" element={<EmailSent />} />
          <Route path="/company-gateway" element={<FindCompany />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}
