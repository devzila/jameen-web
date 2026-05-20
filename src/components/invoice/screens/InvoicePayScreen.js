import React from 'react'
import { Accordion } from 'react-bootstrap'

const PAY_SECTIONS = [
  { eventKey: 'cash', title: 'Cash' },
  { eventKey: 'cheque', title: 'Cheque' },
  { eventKey: 'credit_note', title: 'Credit Note' },
  { eventKey: 'upi', title: 'UPI' },
  { eventKey: 'credit_card', title: 'Credit Card' },
]

export default function InvoicePayScreen() {
  return (
    <div className="d-flex flex-column gap-3">
      <h5 className="mb-0">Pay</h5>
      <Accordion defaultActiveKey="cash">
        {PAY_SECTIONS.map(({ eventKey, title }) => (
          <Accordion.Item eventKey={eventKey} key={eventKey}>
            <Accordion.Header>{title}</Accordion.Header>
            <Accordion.Body className="pt-3 pb-4">
              <p className="mb-0">{title}</p>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}
