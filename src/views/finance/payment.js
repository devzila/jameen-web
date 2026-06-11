import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import { toast } from 'react-toastify'
import { Card, Row, Col, Button, Spinner, Dropdown, Form } from 'react-bootstrap'
import { CNavbar, CContainer, CNavbarBrand } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import Paginate from '../../components/Pagination'
import Loading from 'src/components/loading/loading'
import { formatdate } from 'src/services/CommonFunctions'
import { NavLink } from 'react-router-dom'

const Payments = () => {
  const [payments, setPayments] = useState([])
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [statusFilter, setStatusFilter] = useState('')
  const [propertyFilter, setPropertyFilter] = useState('')
  const [contractFilter, setContractFilter] = useState('')
  const [properties, setProperties] = useState([])
  const [contracts, setContracts] = useState([])

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      loadPayments()
    }
  }
  const { get, response } = useFetch()

  useEffect(() => {
    const timer = setTimeout(() => {
      loadPayments()
    }, 300)

    return () => clearTimeout(timer)
  }, [currentPage, statusFilter, propertyFilter, contractFilter, searchKeyword])

  useEffect(() => {
    loadProperties()
  }, [])

  const handleInputChange = (event) => {
    setSearchKeyword(event.target.value)
    setCurrentPage(1)
  }

  async function loadProperties() {
    const result = await get('/v1/admin/premises/properties')

    if (response.ok) {
      setProperties(result?.data || result || [])
    }
  }

  async function loadPayments() {
    setLoading(true)

    let endpoint = `/v1/admin/payments?page=${currentPage}`

    if (searchKeyword) {
      endpoint += `&q[id_eq]=${searchKeyword}`
    }

    if (statusFilter) {
      endpoint += `&q[status_eq]=${statusFilter}`
    }

    if (propertyFilter) {
      endpoint += `&q[property_id_eq]=${propertyFilter}`
    }

    if (contractFilter) {
      endpoint += `&q[unit_contract_id_eq]=${contractFilter}`
    }

    const result = await get(endpoint)

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

  const handlePropertyChange = async (e) => {
    const propertyId = e.target.value

    setPropertyFilter(propertyId)
    setContractFilter('')

    if (!propertyId) {
      setContracts([])
      return
    }

    const result = await get(`/v1/admin/premises/properties/${propertyId}/allotments`)

    if (response.ok) {
      setContracts(result?.data || result)
    }
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

                  <div className="d-flex justify-content-end align-items-center gap-2 flex-wrap ms-auto">
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="white"
                        style={{
                          border: '1px solid #64d1f6',
                          minWidth: '120px',
                        }}
                      >
                        Filter
                      </Dropdown.Toggle>

                      <Dropdown.Menu style={{ minWidth: '300px', padding: '15px' }}>
                        <Form.Group className="mb-3">
                          <Form.Select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                          >
                            <option value="">All Status</option>
                            <option value="1">Pending</option>
                            <option value="2">Due</option>
                            <option value="3">Paid</option>
                            <option value="4">Partial Paid</option>
                            <option value="5">Cancelled</option>
                          </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Select value={propertyFilter} onChange={handlePropertyChange}>
                            <option value="">All Properties</option>

                            {properties.map((property) => (
                              <option key={property.id} value={property.id}>
                                {property.name}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>

                        <Form.Group>
                          <Form.Select
                            value={contractFilter}
                            onChange={(e) => setContractFilter(e.target.value)}
                          >
                            <option value="">All Contracts</option>

                            {contracts.map((contract) => (
                              <option key={contract.id} value={contract.id}>
                                {contract.unit?.unit_no} - {contract.unit?.building?.name}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Dropdown.Menu>
                    </Dropdown>

                    <div className="d-flex" role="search">
                      <input
                        value={searchKeyword}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        className="form-control"
                        type="search"
                        placeholder="Search by Payment ID"
                        style={{
                          width: '250px',
                          borderColor: '#00bfcc',
                          boxShadow: 'none',
                        }}
                      />

                      <button
                        onClick={loadPayments}
                        className="btn "
                        type="button"
                        style={{
                          backgroundColor: '#00bfcc',
                          borderColor: '#00bfcc',
                          color: '#fff',
                        }}
                      >
                        <CIcon icon={freeSet.cilSearch} />
                      </button>
                    </div>
                  </div>
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
                          <tr key={payment.id}>
                            <td>
                              <NavLink to={`/finance/payments/${payment.id}`}>{payment.id}</NavLink>
                            </td>
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
    </>
  )
}

export default Payments
