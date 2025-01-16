import React, { Suspense, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import { CContainer } from '@coreui/react'
import Loading from 'src/components/loading/loading'

export default function AuthenticationRoutes() {
  const ForgotPassword = React.lazy(() => import('../views/pages/password/ForgotPassword'))
  const NewPassword = React.lazy(() => import('../views/pages/password/PasswordForm'))
  const Login = React.lazy(() => import('../views/pages/login/Login'))
  const EmailSent = React.lazy(() => import('../views/pages/password/EmailSent'))
  const FindCompany = React.lazy(() => import('../views/pages/company_subdomain/FindCompany'))
  const navigate = useNavigate()

  const domain_array = window.location.hostname.split('.')
  const location = useLocation()
  const params = useParams()
  const redirect_url =
    params['*'] !== 'login' &&
    params['*'] !== 'company-gateway' &&
    params['*'] !== 'email-sent' &&
    params['*'] !== 'forgot-password' &&
    params['*'] !== 'reset-password'
      ? `?redirect=${params['*']}`
      : ''

  console.log(redirect_url)
  const redirect_string = location.search.length == 0 ? redirect_url : location.search
  const valid_subdomain =
    process.env.NODE_ENV == 'development' ? domain_array.length > 1 : domain_array.length > 3
  useEffect(() => {
    if (!valid_subdomain && window.location.pathname != '/company-gateway') {
      navigate(`/company-gateway${redirect_string}`)
    }
  }, [])

  return (
    <CContainer fluid className="g-0 p-1 overflow-hidden">
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="*" name="Login" element={<Login />} />
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
