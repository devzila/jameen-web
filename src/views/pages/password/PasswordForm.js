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
import { toast } from 'react-toastify'
import jameenlogo from 'src/assets/images/jameen-logo.png'
import { status_color } from 'src/services/CommonFunctions'

export default function PasswordForm() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [disabled, setDisabled] = useState(true)

  const [validations, setValidations] = useState({
    length: null,
    upperCase: null,
    lowerCase: null,
    digit: null,
    specialChar: null,
    match: false,
  })

  const checkPassword = (input) => {
    setPassword(input)
    setDisabled(true)
    const isLongEnough = input.length >= 8
    const hasUpperCase = /[A-Z]/.test(input)
    const hasLowerCase = /[a-z]/.test(input)
    const hasDigit = /\d/.test(input)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(input)

    setValidations((prev) => ({
      ...prev,
      length: isLongEnough,
      upperCase: hasUpperCase,
      lowerCase: hasLowerCase,
      digit: hasDigit,
      specialChar: hasSpecialChar,
    }))
  }
  const checkConfirmPassword = (input) => {
    setConfirmPassword(input)
    setValidations((prev) => ({
      ...prev,
      match: input === password,
    }))
    if (input === password) {
      setDisabled(false)
    }
  }

  function getValidationColor(data) {
    const color = password.length == 0 ? 'color-gray' : data ? 'color-green' : 'color-red'
    return color
  }
  const initiateUpdatePassword = (e) => {
    e.preventDefault()
    toast.success('Password changed succesfully.')
  }
  return (
    <CContainer fluid>
      <CRow className="justify-content-center vh-100">
        <CCol className="d-flex-center" md={6}>
          <CCardGroup>
            <CCard className=" rounded-0 border-0 shadow-lg">
              <CCardHeader className="d-flex-center align-items-end bg-white py-3">
                <img className="logo-img" src={jameenlogo} />
                <h2 className="text-monospace theme_color m-0 px-3">Jameen</h2>
              </CCardHeader>
              <CCardBody className="p-5">
                <form onSubmit={initiateUpdatePassword}>
                  <div className="row overflow-hidden">
                    <div className="col-12">
                      <label className="form-label text-secondary">
                        Enter your new password <span className="text-danger">*</span>
                      </label>
                      <div className="input-group rounded-0 my-1">
                        <input
                          type="password"
                          className="form-control p-2"
                          name="password"
                          onChange={(e) => checkPassword(e.target.value)}
                          id="email"
                          required
                        />
                      </div>
                      {validations.length ? (
                        <div className="col-12">
                          <label className="form-label text-secondary">
                            Re-enter your new password <span className="text-danger">*</span>
                          </label>
                          <div className="input-group rounded-0 my-1">
                            <input
                              type="password"
                              className="form-control p-2"
                              name="password"
                              onChange={(e) => checkConfirmPassword(e.target.value)}
                              id="email"
                              required
                            />
                          </div>
                        </div>
                      ) : (
                        ''
                      )}
                      <section className="mx-3">
                        <ul className="list-unstyled text-secondary my-3 monospace-font opacity-75 p-2">
                          <li className={getValidationColor(validations.length)}>
                            {validations.length
                              ? '⬤ At least 8 characters long'
                              : '⬤ At least 8 characters long'}
                          </li>
                          <li className={getValidationColor(validations.upperCase)}>
                            {validations.upperCase
                              ? '⬤ At least one uppercase letter'
                              : '⬤ At least one uppercase letter'}
                          </li>
                          <li className={getValidationColor(validations.lowerCase)}>
                            {validations.lowerCase
                              ? '⬤ At least one lowercase letter'
                              : '⬤ At least one lowercase letter'}
                          </li>
                          <li className={getValidationColor(validations.digit)}>
                            {validations.digit ? '⬤ At least one digit' : '⬤ At least one digit'}
                          </li>
                          <li className={getValidationColor(validations.specialChar)}>
                            {validations.specialChar
                              ? '⬤ At least one special character'
                              : '⬤ At least one special character'}
                          </li>
                          {confirmPassword.length ? (
                            <li className={getValidationColor(validations.match)}>
                              {validations.match ? '⬤ Passwords match' : '⬤ Passwords do not match'}
                            </li>
                          ) : (
                            ''
                          )}
                        </ul>
                      </section>
                    </div>
                    <div className="col-12">
                      <div className="d-grid ">
                        <button
                          className="custom_theme_button p-3 rounded-0 m-0"
                          type="submit"
                          disabled={disabled}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </CCardBody>
              <CCardFooter className="border-0 bg-white">
                <div className="row">
                  <div className=" d-flex justify-content-center mt-2 mb-4 ">
                    <NavLink className="mx-2 text-secondary" to="/login">
                      Log In
                    </NavLink>
                    <span>•</span>
                    <NavLink className="mx-2 text-secondary" to="/register">
                      Register
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
