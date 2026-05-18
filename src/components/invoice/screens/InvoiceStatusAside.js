import React from 'react'
import PropTypes from 'prop-types'
import InvoicePayScreen from './InvoicePayScreen'
import InvoicePaymentDetailsScreen from './InvoicePaymentDetailsScreen'
import InvoicePartialPaidScreen from './InvoicePartialPaidScreen'
import InvoiceCancelledScreen from './InvoiceCancelledScreen'

function normalizeStatus(status) {
  return String(status ?? '')
    .trim()
    .toLowerCase()
}

export default function InvoiceStatusAside({ status }) {
  const normalized = normalizeStatus(status)

  if (normalized === 'pending' || normalized === 'due') {
    return <InvoicePayScreen />
  }

  if (normalized === 'paid') {
    return <InvoicePaymentDetailsScreen />
  }

  if (normalized === 'partial_paid') {
    return <InvoicePartialPaidScreen />
  }

  if (normalized === 'cancelled') {
    return <InvoiceCancelledScreen />
  }

  return null
}

InvoiceStatusAside.propTypes = {
  status: PropTypes.string,
}
