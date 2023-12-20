import React, { useState } from 'react'
import {
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CModalTitle,
  CForm,
  CFormInput,
  CContainer,
  CCol,
  CRow,
} from '@coreui/react'

export default function UserForm() {
  const [visible, setVisible] = useState(false)

  return (
    <div>
      <CButton onClick={() => setVisible(!visible)}>Add User</CButton>
      <CModal
        alignment="center"
        size="xl"
        visible={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="StaticBackdropExampleLabel"
      >
        <CModalHeader>
          <CModalTitle id="StaticBackdropExampleLabel">Modal title</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CContainer>
            <CForm>
              <CRow>
                <CCol>
                  <CFormInput
                    type="Name"
                    id="name"
                    label="Name"
                    placeholder="Full Name"
                    aria-describedby="exampleFormControlInputHelpInline"
                  />
                </CCol>
                <CCol>
                  <CFormInput
                    type="email"
                    id="email"
                    label="Email address"
                    placeholder="name@example.com"
                    aria-describedby="exampleFormControlInputHelpInline"
                  />
                </CCol>
              </CRow>
              <CFormInput
                type="Mobile Number"
                id="exampleFormControlInput1"
                label="Mobile Number"
                placeholder="0 123 456 789"
                aria-describedby="exampleFormControlInputHelpInline"
              />
              <CRow>
                <CCol>
                  <CFormInput
                    type="Assigned Properties"
                    id="exampleFormControlInput1"
                    label="Assigned Properties"
                    placeholder="Enter Property Name"
                    aria-describedby="exampleFormControlInputHelpInline"
                  />
                </CCol>
              </CRow>
            </CForm>
          </CContainer>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
          <CButton color="primary">Save changes</CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}
