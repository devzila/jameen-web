import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import { toast } from 'react-toastify'
import Paginate from '../../components/Pagination'
import Loading from 'src/components/loading/loading'
import { useNavigate } from 'react-router-dom'
import { CNavbar, CContainer, CNavbarBrand } from '@coreui/react'
import { Row, Col, Modal, Form, Dropdown } from 'react-bootstrap'
import CIcon from '@coreui/icons-react'
import { cilSync } from '@coreui/icons'
import { freeSet } from '@coreui/icons'

const CreditNotes = () => {
  const navigate = useNavigate()
  const { get, post, response } = useFetch()

  const [errors, setErrors] = useState(false)
  const [loading, setLoading] = useState(true)
  const [creditNotes, setCreditNotes] = useState([])
  const [contracts, setContracts] = useState([])
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [properties, setProperties] = useState([])
  const [propertyFilter, setPropertyFilter] = useState('')
  const [contractFilter, setContractFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const resetFilters = () => {
    setStatusFilter('')
    setPropertyFilter('')
    setContractFilter('')
    setContracts([])
  }

  const [formData, setFormData] = useState({
    contract_id: '',
    amount: '',
    description: '',
  })

  const STATUS_OPTIONS = [
    { value: '', label: 'All Status' },
    { value: '1', label: 'Pending' },
    { value: '2', label: 'Due' },
    { value: '3', label: 'Paid' },
    { value: '4', label: 'Partial Paid' },
    { value: '5', label: 'Cancelled' },
  ]

  useEffect(() => {
    loadCreditNotes()
  }, [currentPage, propertyFilter, contractFilter, statusFilter])

  useEffect(() => {
    if (searchKeyword === '') {
      loadCreditNotes()
    }
  }, [searchKeyword])

  useEffect(() => {
    loadContracts()
  }, [])

  useEffect(() => {
    loadProperties()
  }, [])

  const loadProperties = async () => {
    const data = await get('/v1/admin/premises/properties')

    if (response.ok) {
      setProperties(data.data || data || [])
    }
  }

  const handlePropertyChange = async (e) => {
    const propertyId = e.target.value

    setPropertyFilter(propertyId)
    setContractFilter('')

    if (!propertyId) {
      setContracts([])
      return
    }

    const data = await get(`/v1/admin/premises/properties/${propertyId}/allotments`)

    if (response.ok) {
      setContracts(data.data || data || [])
    } else {
      setContracts([])
    }
  }

  const loadContracts = async () => {
    const data = await get('/v1/admin/allotments')

    if (response.ok) {
      setContracts(data.data || data || [])
    }
  }

  const handleInputChange = (event) => {
    setSearchKeyword(event.target.value)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      loadCreditNotes()
    }
  }

  const loadCreditNotes = async () => {
    setLoading(true)

    let endpoint = `/v1/admin/credit_notes?page=${currentPage}`

    if (searchKeyword) {
      endpoint += `&q[credit_note_number_or_description_cont]=${searchKeyword}`
    }

    if (statusFilter) {
      endpoint += `&q[is_voided_eq]=${statusFilter}`
    }

    if (propertyFilter) {
      endpoint += `&q[property_id_eq]=${propertyFilter}`
    }

    if (contractFilter) {
      endpoint += `&q[contract_id_eq]=${contractFilter}`
    }

    console.log('Contract Filter:', contractFilter)
    console.log('Endpoint:', endpoint)
    const data = await get(endpoint)

    if (response.ok) {
      setCreditNotes(data.data || [])
      setPagination(data.pagination)
      setLoading(false)

      if ((data.data || []).length === 0) {
        toast.dismiss()
        toast.warn('No data found!')
      }
    } else {
      setErrors(true)
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    const payload = {
      credit_note: {
        contract_id: formData.contract_id,
        amount: formData.amount,
        description: formData.description,
      },
    }

    const result = await post('/v1/admin/credit_notes', payload)

    if (response.ok) {
      toast.success('Credit Note Created Successfully')

      setShowModal(false)

      setFormData({
        contract_id: '',
        amount: '',
        description: '',
      })

      loadCreditNotes()
    } else {
      toast.error('Unable To Create Credit Note')
    }
  }

  const handlePageClick = (e) => {
    setCreditNotes([])
    setLoading(true)
    setCurrentPage(e.selected + 1)
  }

  return (
    <>
      <div>
        {/* Header */}
        <CNavbar expand="lg" colorScheme="light" className="bg-white">
          <CContainer fluid>
            <CNavbarBrand href="/credit-notes">Credit Notes</CNavbarBrand>

            <div className="d-flex justify-content-end">
              <div className="d-flex justify-content-end align-items-center gap-2 flex-wrap">
                <Dropdown>
                  <Dropdown.Toggle
                    variant="white"
                    style={{
                      border: '1px solid #64d1f6',
                      minWidth: '120px',
                    }}
                  >
                    🔍 Filters
                  </Dropdown.Toggle>

                  <Dropdown.Menu
                    style={{
                      minWidth: '320px',
                      padding: '15px',
                    }}
                  >
                    <button
                      style={{
                        border: '0px',
                        float: 'left',
                        background: 'initial',
                      }}
                      onClick={resetFilters}
                    >
                      <CIcon icon={cilSync} /> Reset Filter
                    </button>
                    <br />
                    <Form.Group className="mb-3">
                      <Form.Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                    {/* Property Filter */}

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

                    {/* Contract Filter */}

                    <Form.Group>
                      <Form.Select
                        value={contractFilter}
                        onChange={(e) => {
                          console.log('Selected Contract:', e.target.value)
                          setContractFilter(e.target.value)
                        }}
                        style={{
                          color: '#000',
                          backgroundColor: '#fff',
                        }}
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
              </div>
              <div className="d-flex" role="search">
                <input
                  value={searchKeyword}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  className="form-control"
                  type="search"
                  placeholder="Search"
                  style={{
                    borderColor: '#00bfcc',
                    boxShadow: 'none',
                  }}
                />

                <button
                  onClick={loadCreditNotes}
                  className="btn"
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
              <button
                className="btn ms-2"
                onClick={() => setShowModal(true)}
                style={{
                  backgroundColor: '#00bfcc',
                  borderColor: '#00bfcc',
                  color: '#fff',
                }}
              >
                Add
              </button>
            </div>
          </CContainer>
        </CNavbar>

        <hr className="text-secondary m-0" />

        {/* Table */}
        <div className="mask d-flex align-items-center h-100">
          <div className="w-100">
            <div className="row justify-content-center">
              <div>
                <div className="table-responsive bg-white">
                  <table className="table table-striped mb-0">
                    <thead>
                      <tr>
                        <th className="pt-3 pb-3 border-0">Credit Note No.</th>
                        <th className="pt-3 pb-3 border-0">Allotment</th>
                        <th className="pt-3 pb-3 border-0">Amount</th>
                        <th className="pt-3 pb-3 border-0">Consumed Amount</th>
                        <th className="pt-3 pb-3 border-0">Description</th>
                        <th className="pt-3 pb-3 border-0">Status</th>
                        <th className="pt-3 pb-3 border-0">Created At</th>
                      </tr>
                    </thead>

                    <tbody>
                      {creditNotes.map((note) => (
                        <tr key={note.id}>
                          <td>
                            <span
                              style={{
                                color: '#00bfcc',
                                cursor: 'pointer',
                                fontWeight: '500',
                              }}
                              onClick={() => navigate(`/finance/credit-notes/${note.id}`)}
                            >
                              {note.credit_note_number}
                            </span>
                          </td>
                          <td>
                            {note.contract?.unit?.unit_no ? (
                              <>
                                <strong>{note.contract.unit.unit_no}</strong>
                                <span className="text-muted">
                                  {' '}
                                  - {note.contract?.unit?.building?.name || 'N/A'}
                                </span>
                              </>
                            ) : (
                              'N/A'
                            )}
                          </td>
                          <td>₹ {note.amount}</td>
                          <td>₹ {note.consumed_amount}</td>
                          <td>{note.description}</td>
                          <td>
                            {note.is_voided ? (
                              <span className="badge bg-danger">Voided</span>
                            ) : (
                              <span className="badge bg-info">Active</span>
                            )}
                          </td>
                          <td>{new Date(note.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {loading && <Loading />}
                  {errors && toast.error('Unable To Load Data')}
                </div>
              </div>
            </div>
          </div>
        </div>

        <br />

        {/* Pagination */}
        <CNavbar colorScheme="light" className="bg-light d-flex justify-content-center">
          <Row>
            <Col md="12">
              {pagination ? (
                <Paginate
                  onPageChange={handlePageClick}
                  pageRangeDisplayed={pagination.per_page}
                  pageCount={pagination.total_pages}
                  forcePage={currentPage - 1}
                />
              ) : (
                <br />
              )}
            </Col>
          </Row>
        </CNavbar>
      </div>

      {/* Add Credit Note Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Credit Note</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Contract ID</Form.Label>

            <Form.Select
              value={formData.contract_id}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  contract_id: e.target.value,
                })
              }
            >
              <option value="">Select Contract</option>

              {contracts.map((contract) => (
                <option key={contract.id} value={contract.id}>
                  {contract.id} ({contract.unit?.unit_no} - {contract.unit?.building?.name})
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Amount</Form.Label>

            <Form.Control
              type="number"
              placeholder="Enter Amount"
              value={formData.amount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  amount: e.target.value,
                })
              }
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Description</Form.Label>

            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
            Cancel
          </button>

          <button
            className="btn"
            style={{
              backgroundColor: '#00bfcc',
              borderColor: '#00bfcc',
              color: '#fff',
            }}
            onClick={handleSubmit}
          >
            Save
          </button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default CreditNotes
