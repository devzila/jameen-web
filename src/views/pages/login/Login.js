import React, { useEffect } from 'react'
import { toast } from 'react-toastify'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CCardHeader,
  CCardFooter,
} from '@coreui/react'
import { freeSet } from '@coreui/icons'

import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { AuthContext } from '../../../contexts/AuthContext'
import { Navigate, NavLink, useNavigate } from 'react-router-dom'
import jameenlogo from 'src/assets/images/jameen-logo.png'

const Login = () => {
  const { dispatch } = React.useContext(AuthContext)
  const initialState = {
    email: '',
    password: '',
    isSubmitting: false,
    errorMessage: null,
  }
  const navigate = useNavigate()

  const domain_array = window.location.hostname.split('.')
  const sub_domain_present = domain_array[0]

  const valid_subdomain =
    process.env.NODE_ENV == 'development' ? domain_array.length > 1 : domain_array.length > 3

  const [data, setData] = React.useState(initialState)
  const handleInputChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    })
  }
  const handleFormSubmit = (event) => {
    event.preventDefault()
    setData({
      ...data,
      isSubmitting: true,
      errorMessage: null,
    })
    fetch(`${process.env.REACT_APP_API_URL}/v1/admin/auth/session`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'company-slug': window.location.hostname.split('.')[0],
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json()
        }
        throw res
      })
      .then((resJson) => {
        dispatch({
          type: 'LOGIN',
          payload: resJson,
        })
        navigate('/')
      })
      .catch((error) => {
        if (!('json' in error) || error.status === 404) {
          toast.error('Unknown Error Occured. Server response not received.')
          setData({
            ...data,
            isSubmitting: false,
          })
          return
        }
        error.json().then((response) => {
          toast.error(response.message)
          setData({
            ...data,
            isSubmitting: false,
            errorMessage: response.message || error.statusText,
          })
        })
      })
  }

  return (
    <CContainer fluid className="bg-light p-0 m-0 gx-0">
      <CRow className="justify-content-center vh-100">
        <CCol className="d-flex-center" md={6}>
          <CCardGroup style={{ width: '475px' }}>
            <CCard className="rounded-0 border-0 shadow">
              <CCardHeader className="d-flex-center align-items-end bg-white py-3">
                <img className="logo-img" src={jameenlogo} />
                <h2 className="text-monospace theme_color m-0 px-3">Jameen</h2>
              </CCardHeader>
              <CCardBody className="px-5 pt-5 pb-3">
                <div className="text-secondary text-monospace">
                  <h1>Login</h1>
                </div>
                <CForm onSubmit={handleFormSubmit}>
                  <CInputGroup className="mb-3 w-100">
                    <CInputGroupText className="rounded-0">
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Email"
                      autoComplete="email"
                      name="email"
                      id="password"
                      value={data.email}
                      onChange={handleInputChange}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText className="rounded-0">
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      autoComplete="current-password"
                      name="password"
                      value={data.password}
                      onChange={handleInputChange}
                    />
                  </CInputGroup>
                  {valid_subdomain ? (
                    <div className="input-group rounded-0 mb-4">
                      <span className="input-group-text rounded-0">
                        <CIcon icon={freeSet.cilBuilding} size="lg" />
                      </span>
                      <input
                        type="text"
                        className="form-control p-2"
                        name="text"
                        disabled
                        value={sub_domain_present}
                        required
                      />
                    </div>
                  ) : (
                    ''
                  )}
                  <CRow>
                    <CCol>
                      <button
                        disabled={data.isSubmitting}
                        className={`custom_theme_button w-100 ${data.isSubmitting ? 'p-0' : 'p-2'}`}
                      >
                        {data.isSubmitting ? (
                          <span className="spinner-border"></span>
                        ) : (
                          <span>Login</span>
                        )}
                      </button>
                    </CCol>
                  </CRow>
                  <CCardFooter className="border-0 bg-white mt-3 mb-3">
                    <div className="row">
                      <div className=" d-flex-center mt-2 ">
                        <NavLink className="text-secondary " to={'/forgot-password'}>
                          Forgot password?
                        </NavLink>
                        <span className="text-secondary mx-1"> | </span>
                        <a
                          className="text-secondary"
                          target="_self"
                          href={`${process.env.REACT_APP_BASE_URL}/company-gateway`}
                        >
                          Login with another company
                        </a>
                      </div>
                    </div>
                  </CCardFooter>
                </CForm>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default Login
