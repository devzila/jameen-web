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

export default function InvoiceStatusAside({ status, invoiceId, onRefresh }) {
  const normalized = normalizeStatus(status)

  if (normalized === 'pending' || normalized === 'due') {
    return <InvoicePayScreen invoiceId={invoiceId} onRefresh={onRefresh} />
  }

  if (normalized === 'paid') {
    return <InvoicePaymentDetailsScreen />
  }

  if (normalized === 'partial_paid') {
    return <InvoicePartialPaidScreen invoiceId={invoiceId} onRefresh={onRefresh} />
  }

  if (normalized === 'cancelled') {
    return <InvoiceCancelledScreen />
  }

  return null
}

InvoiceStatusAside.propTypes = {
  status: PropTypes.string,
  invoiceId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onRefresh: PropTypes.func,
}
