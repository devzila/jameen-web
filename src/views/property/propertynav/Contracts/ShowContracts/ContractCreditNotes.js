import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import { useParams } from 'react-router-dom'
import { Modal, Form, Row, Col, Button } from 'react-bootstrap'
import useFetch from 'use-http'
import { toast } from 'react-toastify'
import Loading from 'src/components/loading/loading'
import { formatdate } from 'src/services/CommonFunctions'

const THEME_COLOR = '#00bfcc'
const EMPTY_FORM = { amount: '', description: '' }

const cardStyle = {
  background: '#fff',
  borderRadius: '16px',
  boxShadow: '0 2px 12px rgba(0,0,0,.05)',
  overflow: 'hidden',
}

const headerCellStyle = {
  color: '#8a94a6',
  fontSize: '11px',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  borderBottom: '1px solid #eef1f5',
  padding: '14px 16px',
  whiteSpace: 'nowrap',
}

const bodyCellStyle = {
  padding: '14px 16px',
  borderBottom: '1px solid #f2f4f7',
  color: '#1f2933',
  verticalAlign: 'middle',
}

const labelStyle = { fontWeight: 600, color: '#1f2933' }
const cardFormStyle = {
  background: '#f8fafc',
  border: '1px solid #eef1f5',
  borderRadius: '14px',
  padding: '18px',
}

function statusBadgeStyle(isVoided) {
  const colors = isVoided
    ? { bg: '#fdeaea', color: '#e03131' }
    : { bg: '#e6f9ec', color: '#1a9e54' }
  return {
    background: colors.bg,
    color: colors.color,
    padding: '4px 14px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 600,
    textTransform: 'capitalize',
    display: 'inline-block',
  }
}

function DetailTile({ label, value }) {
  return (
    <Col md={4} className="mb-3">
      <div
        style={{
          background: '#f8fafc',
          border: '1px solid #eef1f5',
          borderRadius: '12px',
          padding: '14px 16px',
          height: '100%',
        }}
      >
        <div
          style={{
            color: '#8a94a6',
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginBottom: '6px',
          }}
        >
          {label}
        </div>
        <div style={{ fontWeight: 600, color: '#1f2933' }}>{value}</div>
      </div>
    </Col>
  )
}

DetailTile.propTypes = {
  label: PropTypes.node,
  value: PropTypes.node,
}

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
      toast.success('Credit note created successfully')
      setShowModal(false)
      setFormData(EMPTY_FORM)
      loadCreditNotes()
    } else {
      toast.error('Unable to create credit note')
    }
    setSubmitting(false)
  }

  return (
    <div style={{ ...cardStyle, marginTop: '16px' }}>
      <style>{`
        .contract-credit-notes-table tbody tr { transition: background-color .15s ease; }
        .contract-credit-notes-table tbody tr:hover { background-color: #f5fdfe; }
      `}</style>

      <div
        className="d-flex justify-content-between align-items-center flex-wrap"
        style={{ gap: '12px', padding: '20px 24px' }}
      >
        <div className="d-flex align-items-center" style={{ gap: '12px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'rgba(0,191,204,0.12)',
              color: THEME_COLOR,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CIcon icon={freeSet.cilNotes} size="lg" />
          </div>
          <div>
            <h5 className="mb-0" style={{ fontWeight: 700, color: '#1f2933' }}>
              Credit Notes
            </h5>
            <small style={{ color: '#8a94a6' }}>{creditNotes.length} total</small>
          </div>
        </div>

        <button
          type="button"
          className="btn d-flex align-items-center"
          onClick={openModal}
          style={{
            gap: '6px',
            background: THEME_COLOR,
            color: '#fff',
            borderRadius: '10px',
            height: '38px',
            fontWeight: 600,
            border: 'none',
          }}
        >
          <CIcon icon={freeSet.cilPlus} size="sm" />
          Add Credit Note
        </button>
      </div>

      <div className="table-responsive">
        <table
          className="table contract-credit-notes-table mb-0"
          style={{ borderCollapse: 'collapse' }}
        >
          <thead>
            <tr>
              <th style={headerCellStyle}>Credit Note No.</th>
              <th style={headerCellStyle}>Amount</th>
              <th style={headerCellStyle}>Consumed Amount</th>
              <th style={headerCellStyle}>Description</th>
              <th style={headerCellStyle}>Status</th>
              <th style={headerCellStyle}>Created At</th>
            </tr>
          </thead>
          <tbody>
            {creditNotes.map((note) => (
              <tr key={note.id}>
                <td style={bodyCellStyle}>
                  <button
                    type="button"
                    className="border-0 p-0 fw-semibold"
                    style={{ background: 'initial', color: THEME_COLOR }}
                    onClick={() => setSelectedNote(note)}
                  >
                    {note.credit_note_number || note.id}
                  </button>
                </td>
                <td style={bodyCellStyle}>{note.amount ?? '-'}</td>
                <td style={bodyCellStyle}>{note.consumed_amount ?? '-'}</td>
                <td style={bodyCellStyle}>{note.description || '-'}</td>
                <td style={bodyCellStyle}>
                  <span style={statusBadgeStyle(note.is_voided)}>
                    {note.is_voided ? 'Voided' : 'Active'}
                  </span>
                </td>
                <td style={bodyCellStyle}>{formatdate(note.created_at) || '-'}</td>
              </tr>
            ))}
            {!loading && creditNotes.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="text-center text-secondary fst-italic"
                  style={{ padding: '32px' }}
                >
                  No credit notes found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {loading && <Loading />}
      </div>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        contentClassName="border-0 overflow-hidden rounded-4"
      >
        <Modal.Header
          closeButton
          closeVariant="white"
          style={{
            background: `linear-gradient(135deg, ${THEME_COLOR} 0%, #0098a3 100%)`,
            border: 'none',
            padding: '20px 24px',
            borderTopLeftRadius: 'inherit',
            borderTopRightRadius: 'inherit',
          }}
        >
          <Modal.Title style={{ color: '#fff' }}>
            <div className="d-flex align-items-center" style={{ gap: '14px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CIcon icon={freeSet.cilNotes} size="lg" />
              </div>
              <div className="d-flex flex-column">
                <span style={{ fontSize: '18px', fontWeight: 700, lineHeight: 1.2 }}>
                  Add Credit Note
                </span>
                <span style={{ fontSize: '12px', fontWeight: 400, opacity: 0.9 }}>
                  Create a credit note for this contract
                </span>
              </div>
            </div>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ padding: '22px' }}>
          <div style={cardFormStyle}>
            <Form.Group className="mb-3">
              <Form.Label style={labelStyle}>
                Amount <span style={{ color: '#e03131' }}>*</span>
              </Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter amount"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label style={labelStyle}>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                style={{ resize: 'none' }}
              />
            </Form.Group>
          </div>
        </Modal.Body>

        <Modal.Footer style={{ border: 'none', padding: '0 22px 22px' }}>
          <Button
            variant="light"
            onClick={() => setShowModal(false)}
            style={{ borderRadius: '8px', fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              background: THEME_COLOR,
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
            }}
          >
            {submitting ? 'Saving...' : 'Save'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={!!selectedNote}
        onHide={() => setSelectedNote(null)}
        centered
        size="lg"
        contentClassName="border-0 overflow-hidden rounded-4"
      >
        <Modal.Header
          closeButton
          closeVariant="white"
          style={{
            background: `linear-gradient(135deg, ${THEME_COLOR} 0%, #0098a3 100%)`,
            border: 'none',
            padding: '20px 24px',
            borderTopLeftRadius: 'inherit',
            borderTopRightRadius: 'inherit',
          }}
        >
          <Modal.Title style={{ color: '#fff' }}>
            <div className="d-flex align-items-center" style={{ gap: '14px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CIcon icon={freeSet.cilNotes} size="lg" />
              </div>
              <div className="d-flex flex-column">
                <span style={{ fontSize: '18px', fontWeight: 700, lineHeight: 1.2 }}>
                  Credit Note Details
                </span>
                {selectedNote?.credit_note_number ? (
                  <span style={{ fontSize: '12px', fontWeight: 400, opacity: 0.9 }}>
                    #{selectedNote.credit_note_number}
                  </span>
                ) : null}
              </div>
            </div>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ padding: '22px' }}>
          {selectedNote ? (
            <Row className="g-3">
              <DetailTile
                label="Credit Note Number"
                value={selectedNote.credit_note_number || selectedNote.id}
              />
              <DetailTile
                label="Status"
                value={
                  <span style={statusBadgeStyle(selectedNote.is_voided)}>
                    {selectedNote.is_voided ? 'Voided' : 'Active'}
                  </span>
                }
              />
              <DetailTile label="Created At" value={formatdate(selectedNote.created_at) || '-'} />
              <DetailTile label="Amount" value={selectedNote.amount ?? 0} />
              <DetailTile label="Consumed Amount" value={selectedNote.consumed_amount ?? 0} />
              <DetailTile
                label="Available Amount"
                value={
                  (Number(selectedNote.amount) || 0) - (Number(selectedNote.consumed_amount) || 0)
                }
              />
              <Col md={12}>
                <div style={cardFormStyle}>
                  <div
                    style={{
                      color: '#8a94a6',
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      marginBottom: '6px',
                    }}
                  >
                    Description
                  </div>
                  <div style={{ fontWeight: 600, color: '#1f2933' }}>
                    {selectedNote.description || '-'}
                  </div>
                </div>
              </Col>
            </Row>
          ) : null}
        </Modal.Body>

        <Modal.Footer style={{ border: 'none', padding: '0 22px 22px' }}>
          <Button
            variant="light"
            onClick={() => setSelectedNote(null)}
            style={{ borderRadius: '8px', fontWeight: 600 }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
