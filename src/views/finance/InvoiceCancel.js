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
import useFetch from 'use-http'
import { toast } from 'react-toastify'
import PropTypes from 'prop-types'

export default function InvoiceCancel({ id }) {
  const [visible, setVisible] = useState(false)
  const { put, response } = useFetch()

  async function cancelInvoice() {
    const apiResponse = await put(`/v1/admin/invoices/${id}/cancel`)
    if (response.ok) {
      setVisible(!visible)
      toast.success('Invoice Cancelled')
    } else {
      toast.error(response.data?.message)
    }
  }

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
              onClick={cancelInvoice}
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

InvoiceCancel.propTypes = {
  id: PropTypes.number,
}
