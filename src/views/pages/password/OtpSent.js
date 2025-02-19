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
import { NavLink } from 'react-router-dom'
import jameenlogo from 'src/assets/images/jameen-logo.png'

export default function OtpSent() {
  return (
    <CContainer className="bg-light p-0" fluid>
      <CRow className="justify-content-center vh-100">
        <CCol className="d-flex-center" md={6}>
          <CCardGroup>
            <CCard className=" rounded-0 border-0 shadow-sm">
              <CCardHeader className="d-flex-center align-items-end bg-white py-3">
                <img className="logo-img" src={jameenlogo} />
                <h2 className="text-monospace theme_color m-0 px-3">Jameen</h2>
              </CCardHeader>
              <CCardBody className="p-5">
                <div className="d-flex align-items-end">
                  <CIcon icon={freeSet.cilFingerprint} size="3xl" />
                  <h3 className="m-0 px-3">Password Updated</h3>
                </div>
                <div className="text-secondary text-monospace mt-4 mx-5">
                  <p className="p-0 m-0">Your Password is updated.</p>
                  <p className="p-0 m-0">
                    You can now navigate back to the
                    <NavLink className=" mx-1" to="/login">
                      Log In
                    </NavLink>
                    screen.
                  </p>
                </div>
              </CCardBody>
              <CCardFooter className="border-0 bg-white">
                <div className="row">
                  <div className=" d-flex justify-content-center mt-2 mb-4 ">
                    <NavLink className="mx-2 text-secondary" to="/login">
                      Log In
                    </NavLink>
                  </div>
                </div>
              </CCardFooter>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  )
}
