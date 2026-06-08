import React, { useState, useEffect } from 'react'
import { CCol, CCard, CRow, CTable } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import { useParams } from 'react-router-dom'
import { Modal, Form, Row, Col } from 'react-bootstrap'
import useFetch from 'use-http'
import { toast } from 'react-toastify'
import Loading from 'src/components/loading/loading'
import { formatdate } from 'src/services/CommonFunctions'

const EMPTY_FORM = { amount: '', description: '' }

export default function ContractCreditNotes() {
  const { propertyId, contractId } = useParams()
  const { get, post, response } = useFetch()

  const [creditNotes, setCreditNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [selectedNote, setSelectedNote] = useState(null)

  const baseEndpoint = `/v1/admin/premises/properties/${propertyId}/allotments/${contractId}/credit_notes`

  useEffect(() => {
    loadCreditNotes()
  }, [propertyId, contractId])

  async function loadCreditNotes() {
    setLoading(true)
    const data = await get(baseEndpoint)

    if (response.ok) {
      setCreditNotes(data.data || [])
    } else {
      toast.error('Unable to load credit notes.')
    }
    setLoading(false)
  }

  function openModal() {
    setFormData(EMPTY_FORM)
    setShowModal(true)
  }

  async function handleSubmit() {
    if (!formData.amount) {
      toast.warn('Please enter an amount.')
      return
    }

    setSubmitting(true)
    const payload = {
      credit_note: {
        contract_id: contractId,
        amount: formData.amount,
        description: formData.description,
      },
    }

    await post(baseEndpoint, payload)

    if (response.ok) {
      toast.success('Credit Note Created Successfully')
      setShowModal(false)
      setFormData(EMPTY_FORM)
      loadCreditNotes()
    } else {
      toast.error('Unable To Create Credit Note')
    }
    setSubmitting(false)
  }

  return (
    <CCard className="my-3 border-0">
      <CRow>
        <CCol md="12">
          <CCard className="p-3 border-0">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <CIcon icon={freeSet.cilLineStyle} size="lg" className="me-2 theme_color" />
                <strong className="text-black">Credit Notes</strong>
              </div>
              <div>
                <button
                  type="button"
                  className="btn custom_theme_button"
                  data-mdb-ripple-init
                  onClick={openModal}
                >
                  Add Credit Note
                </button>
              </div>
            </div>
            <hr className="text-secondary m-0 p-0" />
            {loading ? (
              <Loading />
            ) : creditNotes.length > 0 ? (
              <CTable responsive="sm" className="table table-striped mb-0">
                <thead>
                  <tr>
                    <th className="py-3 border-0">Credit Note No.</th>
                    <th className="py-3 border-0">Amount</th>
                    <th className="py-3 border-0">Consumed Amount</th>
                    <th className="py-3 border-0">Description</th>
                    <th className="py-3 border-0">Status</th>
                    <th className="py-3 border-0">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {creditNotes.map((note) => (
                    <tr key={note.id}>
                      <th className="pt-3 border-0" scope="row">
                        <button
                          type="button"
                          className="theme_color border-0 p-0"
                          style={{ background: 'initial' }}
                          onClick={() => setSelectedNote(note)}
                        >
                          {note.credit_note_number || note.id}
                        </button>
                      </th>
                      <td className="pt-3">{note.amount ?? '-'}</td>
                      <td className="pt-3">{note.consumed_amount ?? '-'}</td>
                      <td className="pt-3">{note.description || '-'}</td>
                      <td className="pt-3">
                        {note.is_voided ? (
                          <span className="badge bg-danger">Voided</span>
                        ) : (
                          <span className="badge bg-info">Active</span>
                        )}
                      </td>
                      <td className="pt-3">{formatdate(note.created_at) || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </CTable>
            ) : (
              <p className="text-center fst-italic text-secondary bg-white p-3">
                No Credit Notes Found
              </p>
            )}
          </CCard>
        </CCol>
      </CRow>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Credit Note</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter Amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <button className="btn custom_grey_button" onClick={() => setShowModal(false)}>
            Cancel
          </button>
          <button className="btn custom_theme_button" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Saving...' : 'Save'}
          </button>
        </Modal.Footer>
      </Modal>

      <Modal show={!!selectedNote} onHide={() => setSelectedNote(null)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Credit Note Details
            {selectedNote?.credit_note_number ? ` #${selectedNote.credit_note_number}` : ''}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedNote && (
            <Row>
              <Col md={4} className="mb-3">
                <small className="text-muted d-block">Credit Note Number</small>
                <strong>{selectedNote.credit_note_number || selectedNote.id}</strong>
              </Col>
              <Col md={4} className="mb-3">
                <small className="text-muted d-block">Status</small>
                {selectedNote.is_voided ? (
                  <span className="badge bg-danger">Voided</span>
                ) : (
                  <span className="badge bg-info">Active</span>
                )}
              </Col>
              <Col md={4} className="mb-3">
                <small className="text-muted d-block">Created At</small>
                <strong>{formatdate(selectedNote.created_at) || '-'}</strong>
              </Col>
              <Col md={4} className="mb-3">
                <small className="text-muted d-block">Amount</small>
                <strong className="text-success">{selectedNote.amount ?? 0}</strong>
              </Col>
              <Col md={4} className="mb-3">
                <small className="text-muted d-block">Consumed Amount</small>
                <strong className="text-warning">{selectedNote.consumed_amount ?? 0}</strong>
              </Col>
              <Col md={4} className="mb-3">
                <small className="text-muted d-block">Available Amount</small>
                <strong className="text-primary">
                  {(Number(selectedNote.amount) || 0) - (Number(selectedNote.consumed_amount) || 0)}
                </strong>
              </Col>
              <Col md={12}>
                <small className="text-muted d-block">Description</small>
                <strong>{selectedNote.description || '-'}</strong>
              </Col>
            </Row>
          )}
        </Modal.Body>

        <Modal.Footer>
          <button className="btn custom_grey_button" onClick={() => setSelectedNote(null)}>
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </CCard>
  )
}
