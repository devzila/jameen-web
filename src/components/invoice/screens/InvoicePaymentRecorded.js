import React from 'react'
import PropTypes from 'prop-types'

export default function InvoicePaymentRecorded({ message = 'Payment recorded successfully' }) {
  return (
    <div className="text-center py-4">
      <p className="mb-0 fw-semibold text-success">{message}</p>
    </div>
  )
}

InvoicePaymentRecorded.propTypes = {
  message: PropTypes.string,
}
