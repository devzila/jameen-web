import React, { useEffect, useState } from 'react'
import useFetch from 'use-http'
import { toast } from 'react-toastify'

import { Card, Table, Badge, Spinner } from 'react-bootstrap'

const CreditNotes = ({ contractId }) => {
  const { get, response } = useFetch()

  const [loading, setLoading] = useState(true)
  const [creditNotes, setCreditNotes] = useState([])

  useEffect(() => {
    loadCreditNotes()
  }, [])

  async function loadCreditNotes() {
    setLoading(true)

    // Replace with your actual endpoint
    const api = await get(
      `/v1/admin/contracts/${contractId}/credit_notes`,
    )

    if (response.ok) {
      setCreditNotes(api.data || [])
    } else {
      toast.error('Unable to load credit notes')
    }

    setLoading(false)
  }

  if (loading) {
    return (
      <div className="text-center p-4">
        <Spinner animation="border" />
      </div>
    )
  }

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <h5 className="fw-bold mb-3">Credit Notes</h5>

        {creditNotes.length === 0 ? (
          <div className="text-muted">
            No credit notes have been issued for this contract.
          </div>
        ) : (
          <Table bordered hover responsive>
            <thead>
              <tr>
                <th>Credit Note Number</th>
                <th>Amount</th>
                <th>Consumed Amount</th>
                <th>Available Amount</th>
                <th>Status</th>
                <th>Created Date</th>
              </tr>
            </thead>

            <tbody>
              {creditNotes.map((note) => (
                <tr key={note.id}>
                  <td>{note.credit_note_number}</td>

                  <td>₹ {note.amount}</td>

                  <td>₹ {note.consumed_amount}</td>

                  <td>
                    ₹ {(note.amount || 0) - (note.consumed_amount || 0)}
                  </td>

                  <td>
                    {note.is_voided ? (
                      <Badge bg="danger">Voided</Badge>
                    ) : (
                      <Badge bg="success">Active</Badge>
                    )}
                  </td>

                  <td>
                    {new Date(note.created_at).toLocaleDateString(
                      'en-US',
                      {
                        month: 'short',
                        day: '2-digit',
                        year: 'numeric',
                      },
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  )
}

export default CreditNotes
