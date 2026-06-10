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
        <Card.Body>
          <h5 className="mb-3">Allocations</h5>

          {payment?.allocations?.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Invoice No</th>
                    <th>Unit No</th>
                    <th>Allocated Amount</th>
                    <th>Invoice Date</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {payment.allocations.map((allocation, index) => (
                    <tr key={allocation.id}>
                      <td>{index + 1}</td>
                      <td>{allocation.invoice?.number || '-'}</td>
                      <td>{allocation.invoice?.unit_contract?.unit?.unit_no || '-'}</td>
                      <td>{allocation.allocated_amount || '-'}</td>
                      <td>
                        {allocation.invoice?.invoice_date
                          ? new Date(allocation.invoice.invoice_date).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : '-'}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            allocation.invoice?.status === 'paid'
                              ? 'bg-success'
                              : allocation.invoice?.status === 'pending'
                              ? 'bg-warning text-dark'
                              : 'bg-secondary'
                          }`}
                        >
                          {allocation.invoice?.status || '-'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-muted">No allocations found.</div>
          )}
        </Card.Body>
      </Card>
    </div>
  )
}

export default ShowPayment
