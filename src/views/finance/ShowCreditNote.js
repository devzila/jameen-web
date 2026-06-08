import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useFetch from 'use-http'
import { toast } from 'react-toastify'
import Loading from 'src/components/loading/loading'

import { CNavbar, CContainer, CNavbarBrand } from '@coreui/react'

import { Row, Col, Card, Button } from 'react-bootstrap'

const ShowCreditNote = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { get, response } = useFetch()

  const [loading, setLoading] = useState(true)
  const [creditNote, setCreditNote] = useState(null)

  useEffect(() => {
    loadCreditNote()
  }, [])

  async function loadCreditNote() {
    setLoading(true)

    const api = await get(`/v1/admin/credit_notes/${id}`)

    if (response.ok) {
      setCreditNote(api.data || api)
    } else {
      toast.error('Unable To Load Credit Note')
    }

    setLoading(false)
  }

  if (loading) {
    return <Loading />
  }

  if (!creditNote) {
    return null
  }

  return (
    <div>
      {/* Header */}
      <CNavbar expand="lg" colorScheme="light" className="bg-white px-3">
        <CContainer fluid>
          <CNavbarBrand>
            <div>
              <h4 className="mb-0 fw-bold">Credit Note Details</h4>

              <small className="text-muted">
                #{creditNote.credit_note_number || creditNote.id}
              </small>
            </div>
          </CNavbarBrand>

          <Button
            onClick={() => navigate('/finance/credit-notes')}
            style={{
              backgroundColor: '#00bfcc',
              borderColor: '#00bfcc',
              color: '#fff',
            }}
          >
            Back
          </Button>
        </CContainer>
      </CNavbar>

      <hr className="m-0 text-secondary" />

      {/* Page Content */}
      <div
        className="container-fluid py-4"
        style={{
          backgroundColor: '#f8f9fa',
          minHeight: '100vh',
        }}
      >
        {/* Credit Note Information */}
        <Card className="border-0 shadow-sm rounded-4 mb-4">
          <Card.Body className="p-4">
            <div className="d-flex align-items-center mb-4">
              <h5 className="mb-0 fw-bold">Credit Note Information</h5>
            </div>

            <Row>
              <Col md={3} className="mb-4">
                <small className="text-muted d-block">Credit Note Number</small>
                <strong>{creditNote.credit_note_number || '-'}</strong>
              </Col>

              <Col md={3} className="mb-4">
                <small className="text-muted d-block">Status</small>

                {creditNote.is_voided ? (
                  <span className="badge bg-danger px-3 py-2">Voided</span>
                ) : (
                  <span className="badge bg-success px-3 py-2">Active</span>
                )}
              </Col>

              <Col md={3} className="mb-4">
                <small className="text-muted d-block">Amount</small>
                <strong className="text-success">₹ {creditNote.amount || 0}</strong>
              </Col>

              <Col md={3} className="mb-4">
                <small className="text-muted d-block">Consumed Amount</small>
                <strong className="text-warning">₹ {creditNote.consumed_amount || 0}</strong>
              </Col>

              <Col md={3} className="mb-4">
                <small className="text-muted d-block">Available Amount</small>
                <strong className="text-primary">
                  ₹ {(creditNote.amount || 0) - (creditNote.consumed_amount || 0)}
                </strong>
              </Col>

              <Col md={3} className="mb-4">
                <small className="text-muted d-block">Created By</small>
                <strong>
                  {creditNote.created_by?.name ||
                    creditNote.user?.name ||
                    creditNote.creator?.name ||
                    '-'}
                </strong>
              </Col>
              <Col md={3} className="mb-4">
                <small className="text-muted d-block">Created At</small>
                <strong>
                  {creditNote.created_at
                    ? new Date(creditNote.created_at).toLocaleDateString('en-US', {
                        month: 'long',
                        day: '2-digit',
                        year: 'numeric',
                      })
                    : '-'}
                </strong>
              </Col>

              <Col md={3} className="mb-4">
                <small className="text-muted d-block">Updated At</small>
                <strong>
                  {creditNote.updated_at
                    ? new Date(creditNote.updated_at).toLocaleDateString('en-US', {
                        month: 'long',
                        day: '2-digit',
                        year: 'numeric',
                      })
                    : '-'}
                </strong>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <small className="text-muted d-block mb-2">Description</small>
                <strong>{creditNote.description || '-'}</strong>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Contract Information */}
        <Card className="border-0 shadow-sm rounded-4 mb-4">
          <Card.Body className="p-4">
            <div className="d-flex align-items-center mb-4">
              <h5 className="mb-0 fw-bold">Contract Information</h5>
            </div>

            <Row>
              <Col md={6} className="mb-4">
                <small className="text-muted d-block">Contract ID</small>

                <strong>{creditNote.contract?.id || '-'}</strong>
              </Col>

              <Col md={6} className="mb-4">
                <small className="text-muted d-block">Unit Number</small>

                <strong>{creditNote.contract?.unit?.unit_no || '-'}</strong>
              </Col>

              <Col md={6} className="mb-4">
                <small className="text-muted d-block">Building</small>

                <strong>{creditNote.contract?.unit?.building?.name || '-'}</strong>
              </Col>

              <Col md={6} className="mb-4">
                <small className="text-muted d-block">Property</small>

                <strong>{creditNote.contract?.unit?.building?.property?.name || '-'}</strong>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </div>
    </div>
  )
}

export default ShowCreditNote
