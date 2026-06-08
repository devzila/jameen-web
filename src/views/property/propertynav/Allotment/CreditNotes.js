import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import useFetch from 'use-http'
import { toast } from 'react-toastify'
import { Card, Table, Badge, Spinner } from 'react-bootstrap'

const CreditNotes = ({ propertyId, allotmentId }) => {
  const { get, response } = useFetch()

  const [loading, setLoading] = useState(true)
  const [creditNotes, setCreditNotes] = useState([])

  useEffect(() => {
    loadCreditNotes()
  }, [propertyId, allotmentId])

  async function loadCreditNotes() {
    if (!propertyId || !allotmentId) {
      setLoading(false)
      return
    }

    setLoading(true)

    const api = await get(
      `/v1/admin/premises/properties/${propertyId}/allotments/${allotmentId}/credit_notes`,
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
    <Card className="shadow-sm mt-4">
      <Card.Body>
        <h5 className="fw-bold mb-3">Credit Notes</h5>

        {creditNotes.length === 0 ? (
          <div className="text-muted">No credit notes have been issued for this allotment.</div>
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

                  <td>₹ {note.amount || 0}</td>

                  <td>₹ {note.consumed_amount || 0}</td>

                  <td>₹ {(note.amount || 0) - (note.consumed_amount || 0)}</td>

                  <td>
                    {note.is_voided ? (
                      <Badge bg="danger">Voided</Badge>
                    ) : (
                      <Badge bg="success">Active</Badge>
                    )}
                  </td>

                  <td>
                    {note.created_at
                      ? new Date(note.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: '2-digit',
                          year: 'numeric',
                        })
                      : '-'}
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

CreditNotes.propTypes = {
  propertyId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  allotmentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
}

export default CreditNotes
