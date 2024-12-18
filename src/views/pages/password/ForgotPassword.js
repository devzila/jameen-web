import { CContainer } from '@coreui/react'
import React from 'react'
import jameenlogo from 'src/assets/images/jameen-logo.png'

export default function ForgotPassword() {
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <div className="row justify-content-md-center">
          <div className="col-12 col-md-11 col-lg-8 col-xl-7 col-xxl-6">
            <div className="bg-white p-4 p-md-5 rounded shadow-sm">
              <div className="row gy-3 mb-5">
                <div className="col-12">
                  <div className="text-center">
                    <a href="#!">
                      <img src={jameenlogo} height="57" />
                    </a>
                  </div>
                </div>
                <div className="col-12">
                  <h2 className="fs-6 fw-normal text-center text-secondary m-0 px-md-5">
                    Provide the email address associated with your account to recover your password.
                  </h2>
                </div>
              </div>
              <form action="#!">
                <div className="row gy-3 gy-md-4 overflow-hidden">
                  <div className="col-12">
                    <label className="form-label">
                      Email <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-envelope"
                          viewBox="0 0 16 16"
                        >
                          <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z" />
                        </svg>
                      </span>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        id="email"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="d-grid">
                      <button className="btn btn-primary btn-lg" type="submit">
                        Reset Password
                      </button>
                    </div>
                  </div>
                </div>
              </form>
              <div className="row">
                <div className="col-12 d-flex justify-content-center mt-5">
                  <hr className="mt-5 mb-4 border-secondary-subtle" />
                  <div className="d-flex gap-4 justify-content-center" />
                  <a href="#!" className="link-secondary text-decoration-none mx-3">
                    Log In
                  </a>
                  <a href="#!" className="link-secondary text-decoration-none mx-3">
                    Register
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CContainer>
    </div>
  )
}
