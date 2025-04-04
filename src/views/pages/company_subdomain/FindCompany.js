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
import { NavLink, useLoaderData, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import jameenlogo from 'src/assets/images/jameen-logo.png'

export default function FindCompany() {
  const [company_name, setCompanyName] = useState('')
  const navigate = useNavigate()

  const location = useLocation()
  const host_url = document.location.host
  const protocol = document.location.protocol
  const pathname = location.search?.split('?redirect=')[1] || 'login'
  const fetchCompanySubDomain = (e) => {
    e.preventDefault()
    fetch(`${process.env.REACT_APP_API_URL}`, {
      headers: {
        'Content-Type': 'application/json',
        'company-slug': company_name,
      },
      method: 'GET',
    })
      .then((res) => {
        if (res.ok) {
          return res.json()
        } else {
          return res.json().then((errorData) => {
            toast.error(errorData.message || 'An error occurred')
            throw new Error(errorData.message || 'An error occurred')
          })
        }
      })
      .then((data) => {
        window.location.href = `${protocol}//${company_name}.${host_url}/${pathname}`
      })
      .catch((error) => {
        console.log('Error fetching data:', error)
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
                  <p className="p-0 m-0">{`Enter your company's name below to`}</p>
                  <p className="mb-3"> redirect to the login screen.</p>
                </div>
                <form onSubmit={fetchCompanySubDomain}>
                  <div className="row overflow-hidden">
                    <div className="col-12">
                      <label className="form-label text-secondary">
                        Company Name <span className="text-danger">*</span>
                      </label>
                      <div className="input-group rounded-0 my-3">
                        <span className="input-group-text rounded-0">
                          <CIcon icon={freeSet.cilBuilding} size="lg" />
                        </span>
                        <input
                          type="text"
                          className="form-control p-2"
                          name="text"
                          value={company_name}
                          onChange={(e) => setCompanyName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-12 mb-5">
                      <div className="d-grid mt-3 mb-4">
                        <button className="custom_theme_button p-2 rounded-0 m-0" type="submit">
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  )
}
