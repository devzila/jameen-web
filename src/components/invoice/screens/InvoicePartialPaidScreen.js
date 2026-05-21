import React from 'react'
import PropTypes from 'prop-types'
import InvoicePaymentDetailsScreen from './InvoicePaymentDetailsScreen'
import InvoicePayScreen from './InvoicePayScreen'

export default function InvoicePartialPaidScreen({ invoiceId, onRefresh }) {
  return (
    <>
      <InvoicePaymentDetailsScreen />
      <hr className="my-4" />
      <InvoicePayScreen invoiceId={invoiceId} onRefresh={onRefresh} />
    </>
  )
}

InvoicePartialPaidScreen.propTypes = {
  invoiceId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onRefresh: PropTypes.func,
}
