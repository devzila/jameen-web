import React, { useState } from 'react'
import {
  CModalBody,
  CModalTitle,
  CModalHeader,
  CModal,
  CContainer,
  CModalFooter,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'

export default function InvoiceCancel() {
  const [visible, setVisible] = useState(false)

  return (
    <div className="text-center mx-1 ">
      <button
        onClick={() => setVisible(!visible)}
        type="button"
        className="btn custom_grey_button  "
        data-mdb-ripple-init
      >
        Cancel
      </button>
      <CModal
        alignment="center"
        size="lg"
        visible={visible}
        backdrop="static"
        onClose={() => setVisible(false)}
        aria-labelledby="StaticBackdropExampleLabel"
      >
        <CModalHeader className="text-center">
          <CModalTitle id="StaticBackdropExampleLabel" className="fs-4  ms-3">
            <CIcon icon={freeSet.cilWarning} className="text-danger mx-2" size="xl" /> Are you sure?
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CContainer>
            <i>
              <b className="text-danger">*</b>This action cannot be undone.
            </i>
          </CContainer>
          <CModalFooter className="border-0">
            <button
              onClick={() => null}
              type="button"
              className="btn  ms-2 bg-danger custom_grey_button  "
              data-mdb-ripple-init
            >
              Proceed
            </button>
            <button
              onClick={() => setVisible(false)}
              type="button"
              className="btn  ms-2 custom_grey_button  "
              data-mdb-ripple-init
            >
              Cancel
            </button>
          </CModalFooter>
        </CModalBody>
      </CModal>
    </div>
  )
}
