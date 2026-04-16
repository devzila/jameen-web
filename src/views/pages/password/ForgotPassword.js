import { freeSet } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CCard,
  CContainer,
  CRow,
  CCol,
  CCardGroup,
  CCardBody,
  CCardHeader,
  CCardFooter,
} from '@coreui/react'
import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import jameenlogo from 'src/assets/images/jameen-logo.png'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const navigate = useNavigate()
  const initiateOtpRequest = (e) => {
    e.preventDefault()
    fetch(`${process.env.REACT_APP_API_URL}/v1/admin/auth/passwords`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'company-slug': window.location.hostname.split('.')[0],
      },
      body: JSON.stringify({
        email: email,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json()
        }
        throw res
      })
      .then((r) => {
        toast.success(r?.message || 'OTP sent succesfully.')
        navigate('/email-sent')
      })
      .catch((err) => {
        toast.error('Unknown error occured!')
      })
  }
  return (
    <CContainer fluid className="bg-light p-0">
      <CRow className="justify-content-center vh-100">
        <CCol className="d-flex-center" md={6}>
          <CCardGroup>
            <CCard className="rounded-0 border-0 shadow">
              <CCardHeader className="d-flex-center align-items-end bg-white py-3">
                <img className="logo-img" src={jameenlogo} />
                <h2 className="text-monospace theme_color m-0 px-3">Jameen</h2>
              </CCardHeader>
              <CCardBody className="px-5 pt-5 pb-3">
                <div className="text-secondary text-monospace p-0">
                  <p className="p-0 m-0">Enter your email address or username below to</p>
                  <p className="mb-3"> reset your password.</p>
                </div>
                <form onSubmit={initiateOtpRequest}>
                  <div className="row overflow-hidden">
                    <div className="col-12">
                      <label className="form-label text-secondary">
                        Email or Username <span className="text-danger">*</span>
                      </label>
                      <div className="input-group rounded-0 my-3">
                        <span className="input-group-text rounded-0">
                          <CIcon icon={freeSet.cilUser} size="lg" />
                        </span>
                        <input
                          type="email"
                          className="form-control p-2"
                          name="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          id="email"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="d-grid mt-3">
                        <button className="custom_theme_button p-2 rounded-0 m-0" type="submit">
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </CCardBody>
              <CCardFooter className="border-0 bg-white mb-3">
                <div className=" d-flex justify-content-center  mb-3 ">
                  <NavLink className="mx-2 text-secondary" to="/login">
                    Log In
                  </NavLink>
                </div>
              </CCardFooter>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  )
}
