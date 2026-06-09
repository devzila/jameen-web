import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import { toast } from 'react-toastify'
import { Modal, Button, Row, Col } from 'react-bootstrap'
import { CNavbar, CContainer, CNavbarBrand } from '@coreui/react'

import Paginate from '../../components/Pagination'
import Loading from 'src/components/loading/loading'
import { formatdate } from 'src/services/CommonFunctions'

const Payments = () => {
  const [payments, setPayments] = useState([])
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState(false)

  const [showModal, setShowModal] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState(null)

  const { get, response } = useFetch()

  useEffect(() => {
    loadPayments()
  }, [currentPage])

  async function loadPayments() {
    setLoading(true)

    const result = await get(`/v1/admin/payments?page=${currentPage}`)

    if (response.ok) {
      setPayments(result?.data || [])
      setPagination(result?.pagination)
      setErrors(false)
    } else {
      setErrors(true)
      toast.error('We are facing a technical issue at our end.')
    }

    setLoading(false)
  }

  function handlePageClick(e) {
    setCurrentPage(e.selected + 1)
  }

  function openPayment(payment) {
    setSelectedPayment(payment)
    setShowModal(true)
  }

  return (
    <>
      <div>
        <section className="w-100">
          <div className="mask d-flex align-items-center h-100">
            <div className="container-fluid">
              <CNavbar expand="lg" colorScheme="light" className="bg-white">
                <CContainer fluid>
                  <CNavbarBrand>Payments</CNavbarBrand>
                </CContainer>
              </CNavbar>

              <hr className="text-secondary m-0" />

              <div className="row justify-content-center">
                <div className="col">
                  <div className="table-responsive bg-white">
                    <table className="table table-striped mb-0">
                      <thead>
                        <tr>
                          <th className="py-3 border-0">ID</th>
                          <th className="py-3 border-0">Amount</th>
                          <th className="py-3 border-0">Payment Date</th>
                          <th className="py-3 border-0">Created At</th>
                          <th className="py-3 border-0">Created BY</th>
                          <th className="py-3 border-0">Type</th>
                          <th className="py-3 border-0">Status</th>
                        </tr>
                      </thead>

                      <tbody>
                        {payments?.map((payment) => (
                          <tr
                            key={payment.id}
                            style={{ cursor: 'pointer' }}
                            onClick={() => openPayment(payment)}
                          >
                            <td>{payment.id}</td>

                            <td>{payment.amount || '-'}</td>

                            <td>{payment.payment_date ? formatdate(payment.payment_date) : '-'}</td>
                            <td>{payment.created_at ? formatdate(payment.created_at) : '-'}</td>
                            <td>{payment.created_by?.name || '-'}</td>
                            <td>{payment.payment_type || '-'}</td>

                            <td>{payment.status || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {loading && <Loading />}

                    {errors ? toast('We are facing a technical issue at our end.') : null}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <br />

          <CNavbar colorScheme="light" className="bg-light d-flex justify-content-center">
            <Row>
              <Col md="12">
                {pagination?.total_pages > 1 ? (
                  <Paginate
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={pagination?.per_page}
                    pageCount={pagination?.total_pages}
                    forcePage={currentPage - 1}
                  />
                ) : (
                  <br />
                )}
              </Col>
            </Row>
          </CNavbar>
        </section>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Payment Details</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row className="mb-3">
            <Col md={6}>
              <strong>ID:</strong>
            </Col>
            <Col md={6}>{selectedPayment?.id || '-'}</Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <strong>Amount:</strong>
            </Col>
            <Col md={6}>{selectedPayment?.amount || '-'}</Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <strong>Payment Date:</strong>
            </Col>
            <Col md={6}>
              {selectedPayment?.payment_date ? formatdate(selectedPayment.payment_date) : '-'}
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <strong>Type:</strong>
            </Col>
            <Col md={6}>{selectedPayment?.payment_type || '-'}</Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <strong>Status:</strong>
            </Col>
            <Col md={6}>{selectedPayment?.status || '-'}</Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <strong>Created At:</strong>
            </Col>
            <Col md={6}>
              {selectedPayment?.created_at ? formatdate(selectedPayment.created_at) : '-'}
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Payments
