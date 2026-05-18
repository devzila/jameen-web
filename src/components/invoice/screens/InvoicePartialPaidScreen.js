import React from 'react'
import InvoicePaymentDetailsScreen from './InvoicePaymentDetailsScreen'
import InvoicePayScreen from './InvoicePayScreen'

export default function InvoicePartialPaidScreen() {
  return (
    <>
      <InvoicePaymentDetailsScreen />
      <hr className="my-4" />
      <InvoicePayScreen />
    </>
  )
}
