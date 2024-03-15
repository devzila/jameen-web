import React, { useState } from 'react'
import { CModalBody, CModalTitle, CModalHeader, CModal, CContainer } from '@coreui/react'

export default function InvoicePayment() {
  const [visible, setVisible] = useState(false)

  return (
    <div className="text-center mx-1 ">
      <button
        onClick={() => setVisible(!visible)}
        type="button"
        className="btn custom_theme_button  "
        data-mdb-ripple-init
      >
        Pay
      </button>
      <CModal
        alignment="center"
        size="xl"
        visible={visible}
        backdrop="static"
        onClose={() => setVisible(false)}
        aria-labelledby="StaticBackdropExampleLabel"
      >
        <CModalHeader>
          <CModalTitle id="StaticBackdropExampleLabel">Payment</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CContainer>
            <div>hello</div>
          </CContainer>
        </CModalBody>
      </CModal>
    </div>
  )
}
