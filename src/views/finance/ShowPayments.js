import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useFetch from 'use-http'
import { toast } from 'react-toastify'
import { Card, Row, Col, Button, Spinner } from 'react-bootstrap'

const ShowPayment = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [payment, setPayment] = useState(null)
  const [loading, setLoading] = useState(true)

  const { get, response } = useFetch()

  useEffect(() => {
    loadPayment()
  }, [id])

  async function loadPayment() {
    setLoading(true)

    const result = await get(`/v1/admin/payments/${id}`)

    if (response.ok) {
      setPayment(result?.data || result)
    } else {
      toast.error('Unable to load payment details')
    }

    setLoading(false)
  }

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    )
  }

  return (
    <div className="container-fluid mt-4">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Payment Details</h4>

          <Button
            onClick={() => navigate('/finance/payments')}
            style={{
              backgroundColor: '#00bfcc',
              borderColor: '#00bfcc',
              color: '#fff',
            }}
          >
            Back
          </Button>
        </Card.Header>

        <Card.Body>
          <Row className="g-4">
            <Col md={3}>
              <label className="fw-bold text-muted">Payment ID</label>
              <div>{payment?.id || '-'}</div>
            </Col>

            <Col md={3}>
              <label className="fw-bold text-muted">Amount</label>
              <div>{payment?.amount || '-'}</div>
            </Col>

            <Col md={3}>
              <label className="fw-bold text-muted">Status</label>
              <div>{payment?.status || '-'}</div>
            </Col>

            <Col md={3}>
              <label className="fw-bold text-muted">Type</label>
              <div>{payment?.payment_type || '-'}</div>
            </Col>

            <Col md={3}>
              <label className="fw-bold text-muted">Payment Date</label>
              <div>{payment?.payment_date || '-'}</div>
            </Col>

            <Col md={3}>
              <label className="fw-bold text-muted">Received On</label>
              <div>{payment?.received_on || '-'}</div>
            </Col>

            <Col md={3}>
              <label className="fw-bold text-muted">Created At</label>
              <div>{payment?.created_at || '-'}</div>
            </Col>

            <Col md={3}>
              <label className="fw-bold text-muted">Created By</label>
              <div>{payment?.created_by?.name || payment?.created_by || '-'}</div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  )
}

export default ShowPayment
