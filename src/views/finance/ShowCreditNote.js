import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useFetch from 'use-http'
import { toast } from 'react-toastify'
import Loading from 'src/components/loading/loading'

import { CNavbar, CContainer, CNavbarBrand } from '@coreui/react'
import { Row, Col } from 'react-bootstrap'

const ShowCreditNote = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { get, response } = useFetch()

  const [loading, setLoading] = useState(true)
  const [creditNote, setCreditNote] = useState(null)
  const [errors, setErrors] = useState(false)

  useEffect(() => {
    loadCreditNote()
  }, [])

  async function loadCreditNote() {
    setLoading(true)

    const api = await get(`/v1/admin/credit_notes/${id}`)

    if (response.ok) {
      setCreditNote(api.data || api)
      setLoading(false)
    } else {
      setErrors(true)
      setLoading(false)
      toast.error('Unable To Load Credit Note')
    }
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
      <CNavbar expand="lg" colorScheme="light" className="bg-white">
        <CContainer fluid>
          <CNavbarBrand>Credit Note #{creditNote.credit_note_number || creditNote.id}</CNavbarBrand>

          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate('/finance/credit-notes')}
          >
            Back
          </button>
        </CContainer>
      </CNavbar>
      <hr className="text-secondary m-0" />
      {/* Content */}
      <div className="container-fluid bg-white p-4">
        <h5 className="mb-4">Credit Note Information</h5>
        <Row>
          <Col md={6} className="mb-4">
            <strong>Credit Note Number</strong>
            <p className="mt-2">{creditNote.credit_note_number || '-'}</p>
          </Col>
          <Col md={6} className="mb-4">
            <strong>Status</strong>
            <p className="mt-2">
              {creditNote.is_voided ? (
                <span className="badge bg-danger">Voided</span>
              ) : (
                <span className="badge bg-info">Active</span>
              )}
            </p>
          </Col>
          <Col md={6} className="mb-4">
            <strong>Amount</strong>
            <p className="mt-2">₹ {creditNote.amount || 0}</p>
          </Col>
          <Col md={6} className="mb-4">
            <strong>Consumed Amount</strong>
            <p className="mt-2">₹ {creditNote.consumed_amount || 0}</p>
          </Col>
          <Col md={6} className="mb-4">
            <strong>Created At</strong>
            <p className="mt-2">
              {creditNote.created_at ? new Date(creditNote.created_at).toLocaleString() : '-'}
            </p>
          </Col>
          <Col md={6} className="mb-4">
            <strong>Updated At</strong>
            <p className="mt-2">
              {creditNote.updated_at ? new Date(creditNote.updated_at).toLocaleString() : '-'}
            </p>
          </Col>
        </Row>
        <hr />
        <h5 className="mb-4">Contract Information</h5>
        <Row>
          <Col md={6} className="mb-4">
            <strong>Contract ID</strong>
            <p className="mt-2">{creditNote.contract?.id || '-'}</p>
          </Col>
          <Col md={6} className="mb-4">
            <strong>Unit Number</strong>
            <p className="mt-2">{creditNote.contract?.unit?.unit_no || '-'}</p>
          </Col>
          <Col md={6} className="mb-4">
            <strong>Building</strong>
            <p className="mt-2">{creditNote.contract?.unit?.building?.name || '-'}</p>
          </Col>
          <Col md={6} className="mb-4">
            <strong>Property</strong>
            <p className="mt-2">{creditNote.contract?.unit?.building?.property?.name || '-'}</p>
          </Col>
        </Row>
        <hr />
        <h5 className="mb-4">Description</h5>
        <Row>
          <Col md={12}>
            <div className="p-3 border rounded bg-light" style={{ minHeight: '100px' }}>
              {creditNote.description || 'No description available'}
            </div>
          </Col>
        </Row>
      </div>
      {errors && toast.error('Unable To Load Data')}
    </div>
  )
}

export default ShowCreditNote
