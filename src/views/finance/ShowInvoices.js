import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useFetch from 'use-http'
import { Row, Col, Spinner } from 'react-bootstrap'
import { toast } from 'react-toastify'

const ShowCreditNote = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [creditNote, setCreditNote] = useState(null)

  const { get, loading } = useFetch('/v1/admin')

  useEffect(() => {
    fetchCreditNote()
  }, [])

  const fetchCreditNote = async () => {
    try {
      const result = await get(`/credit_notes/${id}`)

      if (result) {
        setCreditNote(result.data || result)
      }
    } catch (error) {
      toast.error('Failed to load credit note')
    }
  }

  if (loading || !creditNote) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    )
  }

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="mb-1">Credit Note #{creditNote.credit_note_number || creditNote.id}</h3>

          <small className="text-muted">
            Created on{' '}
            {creditNote.created_at ? new Date(creditNote.created_at).toLocaleDateString() : '-'}
          </small>
        </div>

        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate('/finance/credit-notes')}
        >
          Back
        </button>
      </div>

      {/* Details Card */}
      <div className="card shadow-sm border-0">
        <div
          className="card-header text-white"
          style={{
            backgroundColor: '#00bfcc',
            fontWeight: '600',
          }}
        >
          Credit Note Details
        </div>

        <div className="card-body">
          <Row>
            <Col md={6} className="mb-4">
              <strong>Credit Note Number</strong>
              <div className="mt-1">{creditNote.credit_note_number || '-'}</div>
            </Col>

            <Col md={6} className="mb-4">
              <strong>Status</strong>
              <div className="mt-1">
                {creditNote.is_voided ? (
                  <span className="badge bg-danger">Voided</span>
                ) : (
                  <span className="badge bg-info">Active</span>
                )}
              </div>
            </Col>

            <Col md={6} className="mb-4">
              <strong>Contract ID</strong>
              <div className="mt-1">{creditNote.contract?.id || '-'}</div>
            </Col>

            <Col md={6} className="mb-4">
              <strong>Unit Number</strong>
              <div className="mt-1">{creditNote.contract?.unit?.unit_no || '-'}</div>
            </Col>

            <Col md={6} className="mb-4">
              <strong>Building</strong>
              <div className="mt-1">{creditNote.contract?.unit?.building?.name || '-'}</div>
            </Col>

            <Col md={6} className="mb-4">
              <strong>Property</strong>
              <div className="mt-1">
                {creditNote.contract?.unit?.building?.property?.name || '-'}
              </div>
            </Col>

            <Col md={6} className="mb-4">
              <strong>Amount</strong>
              <div className="mt-1 fw-bold">₹ {creditNote.amount || 0}</div>
            </Col>

            <Col md={6} className="mb-4">
              <strong>Consumed Amount</strong>
              <div className="mt-1 fw-bold">₹ {creditNote.consumed_amount || 0}</div>
            </Col>

            <Col md={12} className="mb-4">
              <strong>Description</strong>
              <div className="mt-2 p-3 bg-light rounded">
                {creditNote.description || 'No description available'}
              </div>
            </Col>

            <Col md={6}>
              <strong>Created At</strong>
              <div className="mt-1">
                {creditNote.created_at ? new Date(creditNote.created_at).toLocaleString() : '-'}
              </div>
            </Col>

            <Col md={6}>
              <strong>Updated At</strong>
              <div className="mt-1">
                {creditNote.updated_at ? new Date(creditNote.updated_at).toLocaleString() : '-'}
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  )
}

export default ShowCreditNote
