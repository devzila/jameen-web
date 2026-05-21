import React, { useState } from 'react'
import { Accordion } from 'react-bootstrap'
import PropTypes from 'prop-types'
import InvoiceCashPaymentForm from './InvoiceCashPaymentForm'
import InvoiceChequePaymentForm from './InvoiceChequePaymentForm'
import InvoiceCreditNotePaymentForm from './InvoiceCreditNotePaymentForm'
import InvoicePaymentRecorded from './InvoicePaymentRecorded'

const PAY_SECTIONS = [
  { eventKey: 'cash', title: 'Cash' },
  { eventKey: 'cheque', title: 'Cheque' },
  { eventKey: 'credit_note', title: 'Credit Note' },
  { eventKey: 'upi', title: 'UPI' },
  { eventKey: 'credit_card', title: 'Credit Card' },
]

export default function InvoicePayScreen({ invoiceId, onRefresh }) {
  const [paymentRecorded, setPaymentRecorded] = useState(false)

  function handlePaymentSuccess() {
    setPaymentRecorded(true)
    onRefresh?.()
  }

  if (paymentRecorded) {
    return (
      <div className="d-flex flex-column gap-3">
        <h5 className="mb-0">Pay</h5>
        <InvoicePaymentRecorded />
      </div>
    )
  }

  return (
    <div className="d-flex flex-column gap-3">
      <h5 className="mb-0">Pay</h5>
      <Accordion defaultActiveKey="cash">
        {PAY_SECTIONS.map(({ eventKey, title }) => (
          <Accordion.Item eventKey={eventKey} key={eventKey}>
            <Accordion.Header>{title}</Accordion.Header>
            <Accordion.Body className="pt-3 pb-4">
              {invoiceId && eventKey === 'cash' ? (
                <InvoiceCashPaymentForm invoiceId={invoiceId} onSuccess={handlePaymentSuccess} />
              ) : null}
              {invoiceId && eventKey === 'cheque' ? (
                <InvoiceChequePaymentForm invoiceId={invoiceId} onSuccess={handlePaymentSuccess} />
              ) : null}
              {invoiceId && eventKey === 'credit_note' ? (
                <InvoiceCreditNotePaymentForm
                  invoiceId={invoiceId}
                  onSuccess={handlePaymentSuccess}
                />
              ) : null}
              {eventKey !== 'cash' && eventKey !== 'cheque' && eventKey !== 'credit_note' ? (
                <p className="mb-0">{title}</p>
              ) : null}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

InvoicePayScreen.propTypes = {
  invoiceId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onRefresh: PropTypes.func,
}
