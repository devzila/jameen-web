import React from 'react'
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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { AuthContext } from '../../../contexts/AuthContext'

const Login = () => {
  const { dispatch } = React.useContext(AuthContext)
  const initialState = {
    email: 'admin',
    password: 'root1234',
    isSubmitting: false,
    errorMessage: null,
  }
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
      },
      body: JSON.stringify({
        username: data.email,
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
      })
      .catch((error) => {
        console.log(error)
        error.json().then((response) => {
          toast(response.message)
          setData({
            ...data,
            isSubmitting: false,
            errorMessage: response.message || error.statusText,
          })
        })
      })
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleFormSubmit}>
                    <h1>Login</h1>
                    <p className="text-medium-emphasis">Sign In to your Jameen account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Username"
                        autoComplete="username"
                        name="email"
                        id="password"
                        value={data.email}
                        onChange={handleInputChange}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
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
                    <CRow>
                      <CCol xs={6}>
                        <button
                          disabled={data.isSubmitting}
                          color="primary"
                          className="btn btn-primary"
                        >
                          {data.isSubmitting ? 'Loading...' : 'Login'}
                        </button>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
