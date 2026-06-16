import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import { toast } from 'react-toastify'
import Paginate from '../../components/Pagination'
import Loading from 'src/components/loading/loading'
import { useNavigate } from 'react-router-dom'
import { Modal, Form, Dropdown, Button } from 'react-bootstrap'
import CIcon from '@coreui/icons-react'
import { cilSync } from '@coreui/icons'
import { freeSet } from '@coreui/icons'

const THEME_COLOR = '#00bfcc'

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

function allotmentLabel(note) {
  const unitNo = note?.contract?.unit?.unit_no
  const buildingName = note?.contract?.unit?.building?.name
  if (unitNo && buildingName) return `${unitNo} (${buildingName})`
  return unitNo || buildingName || 'N/A'
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
    setCurrentPage(1)
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
    setCurrentPage(1)

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

    const data = await get(endpoint)

    if (response.ok) {
      setCreditNotes(data.data || [])
      setPagination(data.pagination)
      setLoading(false)
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

    await post('/v1/admin/credit_notes', payload)

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

  const activeFilterCount = [statusFilter, propertyFilter, contractFilter].filter(Boolean).length

  return (
    <div style={{ padding: '20px' }}>
      <style>{`
        .credit-table tbody tr { transition: background-color .15s ease; }
        .credit-table tbody tr:hover { background-color: #f5fdfe; }

        .credit-pagination ul { margin: 0; align-items: center; gap: 4px; }
        .credit-pagination .btn {
          box-shadow: none !important;
          border: 1px solid #eef1f5 !important;
          border-radius: 8px !important;
          background: #fff;
          color: #495057;
          min-width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 10px;
          margin: 0 !important;
          transition: all .15s ease;
        }
        .credit-pagination .btn:hover {
          border-color: ${THEME_COLOR} !important;
          color: ${THEME_COLOR};
        }
        .credit-pagination .custom_background_color,
        .credit-pagination .custom_background_color .btn {
          background: ${THEME_COLOR} !important;
          border-color: ${THEME_COLOR} !important;
          color: #fff !important;
        }
      `}</style>

      <div
        style={{
          background: '#fff',
          borderRadius: '16px',
          boxShadow: '0 2px 12px rgba(0,0,0,.05)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
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
              <small style={{ color: '#8a94a6' }}>
                {pagination?.total_count ?? creditNotes.length} total
              </small>
            </div>
          </div>

          <div className="d-flex align-items-center" style={{ gap: '10px' }}>
            <Dropdown autoClose="outside">
              <Dropdown.Toggle
                as="button"
                type="button"
                className="btn d-flex align-items-center"
                style={{
                  gap: '8px',
                  background: activeFilterCount ? 'rgba(0,191,204,0.12)' : '#f5f7fb',
                  color: activeFilterCount ? THEME_COLOR : '#495057',
                  border: 'none',
                  borderRadius: '10px',
                  height: '38px',
                  fontWeight: 600,
                  fontSize: '14px',
                }}
              >
                <CIcon icon={freeSet.cilFilter} size="sm" />
                Filters
                {activeFilterCount ? (
                  <span
                    style={{
                      background: THEME_COLOR,
                      color: '#fff',
                      borderRadius: '999px',
                      fontSize: '11px',
                      padding: '0 7px',
                      lineHeight: '18px',
                    }}
                  >
                    {activeFilterCount}
                  </span>
                ) : null}
              </Dropdown.Toggle>
              <Dropdown.Menu
                renderOnMount
                popperConfig={{ strategy: 'fixed' }}
                style={{
                  minWidth: '320px',
                  padding: '16px',
                  border: '1px solid #eef1f5',
                  borderRadius: '12px',
                  boxShadow: '0 6px 24px rgba(0,0,0,.08)',
                }}
              >
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span style={{ fontWeight: 700, color: '#1f2933' }}>Filters</span>
                  <button
                    type="button"
                    className="d-inline-flex align-items-center border-0"
                    style={{
                      gap: '5px',
                      background: 'initial',
                      color: THEME_COLOR,
                      fontWeight: 600,
                    }}
                    onClick={resetFilters}
                  >
                    <CIcon icon={cilSync} size="sm" /> Reset
                  </button>
                </div>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontSize: '12px', color: '#8a94a6', fontWeight: 600 }}>
                    Status
                  </Form.Label>
                  <Form.Select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value)
                      setCurrentPage(1)
                    }}
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontSize: '12px', color: '#8a94a6', fontWeight: 600 }}>
                    Property
                  </Form.Label>
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
                  <Form.Label style={{ fontSize: '12px', color: '#8a94a6', fontWeight: 600 }}>
                    Contract
                  </Form.Label>
                  <Form.Select
                    value={contractFilter}
                    onChange={(e) => {
                      setContractFilter(e.target.value)
                      setCurrentPage(1)
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

            <div
              className="d-flex align-items-center"
              style={{
                background: '#f5f7fb',
                borderRadius: '10px',
                padding: '2px 6px 2px 12px',
              }}
            >
              <input
                value={searchKeyword}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="border-0"
                style={{ background: 'transparent', outline: 'none', minWidth: '180px' }}
                type="search"
                placeholder="Search by number or description"
                aria-label="Search"
              />
              <button
                onClick={loadCreditNotes}
                className="btn d-flex align-items-center justify-content-center"
                type="button"
                style={{
                  background: THEME_COLOR,
                  color: '#fff',
                  borderRadius: '8px',
                  width: '34px',
                  height: '34px',
                }}
              >
                <CIcon icon={freeSet.cilSearch} size="sm" />
              </button>
            </div>

            <button
              className="btn d-flex align-items-center"
              onClick={() => setShowModal(true)}
              style={{
                gap: '6px',
                background: THEME_COLOR,
                color: '#fff',
                borderRadius: '10px',
                height: '38px',
                fontWeight: 600,
              }}
            >
              <CIcon icon={freeSet.cilPlus} size="sm" />
              Add
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="table credit-table mb-0" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={headerCellStyle}>Credit Note No.</th>
                <th style={headerCellStyle}>Allotment</th>
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
                      onClick={() => navigate(`/finance/credit-notes/${note.id}`)}
                    >
                      {note.credit_note_number}
                    </button>
                  </td>
                  <td style={bodyCellStyle}>{allotmentLabel(note)}</td>
                  <td style={bodyCellStyle}>₹ {note.amount}</td>
                  <td style={bodyCellStyle}>₹ {note.consumed_amount}</td>
                  <td style={bodyCellStyle}>{note.description || '-'}</td>
                  <td style={bodyCellStyle}>
                    <span style={statusBadgeStyle(note.is_voided)}>
                      {note.is_voided ? 'Voided' : 'Active'}
                    </span>
                  </td>
                  <td style={bodyCellStyle}>{new Date(note.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {!loading && creditNotes.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
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
          {errors && toast.error('Unable To Load Data')}
        </div>

        {/* Pagination */}
        {pagination?.total_pages > 1 ? (
          <div
            className="credit-pagination d-flex justify-content-center"
            style={{ padding: '16px', borderTop: '1px solid #f2f4f7' }}
          >
            <Paginate
              onPageChange={handlePageClick}
              pageRangeDisplayed={pagination.per_page}
              pageCount={pagination.total_pages}
              forcePage={currentPage - 1}
            />
          </div>
        ) : null}
      </div>

      {/* Add Credit Note Modal */}
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
            padding: '18px 22px',
            borderTopLeftRadius: 'inherit',
            borderTopRightRadius: 'inherit',
          }}
        >
          <Modal.Title style={{ color: '#fff' }}>
            <div className="d-flex align-items-center" style={{ gap: '12px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CIcon icon={freeSet.cilNotes} size="lg" />
              </div>
              <span style={{ fontSize: '17px', fontWeight: 700 }}>Add Credit Note</span>
            </div>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ padding: '22px' }}>
          <Form.Group className="mb-3">
            <Form.Label style={{ fontWeight: 600, color: '#1f2933' }}>Contract</Form.Label>
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
            <Form.Label style={{ fontWeight: 600, color: '#1f2933' }}>Amount</Form.Label>
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
            <Form.Label style={{ fontWeight: 600, color: '#1f2933' }}>Description</Form.Label>
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
              style={{ resize: 'none' }}
            />
          </Form.Group>
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
            style={{
              background: THEME_COLOR,
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
            }}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default CreditNotes
