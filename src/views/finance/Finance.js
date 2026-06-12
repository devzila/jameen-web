import React, { useState, useEffect } from 'react'
import { useFetch } from 'use-http'
import { toast } from 'react-toastify'
import Paginate from '../../components/Pagination'
import Loading from 'src/components/loading/loading'
import CustomDivToggle from 'src/components/CustomDivToggle'
import { CNavbar, CContainer, CNavbarBrand } from '@coreui/react'
import { BsThreeDots } from 'react-icons/bs'
import { Row, Col, Form, Dropdown } from 'react-bootstrap'
import { status_color } from 'src/services/CommonFunctions'
import PickOwner from '../property/unit/UnitFunctions/PickOwner'
import CIcon from '@coreui/icons-react'
import { cilSync } from '@coreui/icons'
import { freeSet } from '@coreui/icons'
import { formatdate } from 'src/services/CommonFunctions'
import { NavLink } from 'react-router-dom'

const INVOICE_STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: '1', label: 'Pending' },
  { value: '2', label: 'Due' },
  { value: '3', label: 'Paid' },
  { value: '4', label: 'Partial paid' },
  { value: '5', label: 'Cancelled' },
]

const Finance = () => {
  const [invoices, setInvoices] = useState([])
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [errors, setErrors] = useState(false)
  const [loading, setLoading] = useState(true)

  const [searchInput, setSearchInput] = useState('')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [propertyFilter, setPropertyFilter] = useState('')
  const [contractFilter, setContractFilter] = useState('')
  const [properties, setProperties] = useState([])
  const [contracts, setContracts] = useState([])
  const { get, response } = useFetch()
  const resetFilters = () => {
    setStatusFilter('')
    setPropertyFilter('')
    setContractFilter('')
    setContracts([])
  }

  useEffect(() => {
    loadInitialinvoices()
  }, [currentPage, searchKeyword, statusFilter, propertyFilter, contractFilter])

  useEffect(() => {
    loadProperties()
  }, [])

  async function loadProperties() {
    const result = await get('/v1/admin/premises/properties')

    if (response.ok) {
      setProperties(result?.data || result)
    }
  }

  async function handlePropertyChange(e) {
    const propertyId = e.target.value

    setPropertyFilter(propertyId)
    setContractFilter('')
    setCurrentPage(1)

    if (!propertyId) {
      setContracts([])
      return
    }

    const result = await get(`/v1/admin/premises/properties/${propertyId}/allotments`)

    if (response.ok) {
      setContracts(result?.data || result)
    } else {
      setContracts([])
    }
  }

  async function loadInitialinvoices() {
    setLoading(true)
    let endpoint = `/v1/admin/invoices?page=${currentPage}`
    if (searchKeyword?.trim()) {
      endpoint += `&q[number_cont]=${encodeURIComponent(searchKeyword.trim())}`
    }
    if (statusFilter !== '') {
      endpoint += `&q[status_eq]=${statusFilter}`
    }
    if (propertyFilter) {
      endpoint += `&q[property_id_eq]=${propertyFilter}`
    }

    if (contractFilter) {
      endpoint += `&q[unit_contract_id_eq]=${contractFilter}`
    }
    const initial_invoices = await get(endpoint)

    if (response.ok) {
      if (initial_invoices.data) {
        setInvoices(initial_invoices.data)
        setPagination(initial_invoices.pagination)
        setErrors(false)
        console.log('Invoice Data => ', initial_invoices.data)
      }
    } else {
      setErrors(true)
      toast.error('We are facing a technical issue at our end.')
    }
    setLoading(false)
  }

  function handlePageClick(e) {
    setCurrentPage(e.selected + 1)
  }

  function applySearch(e) {
    e?.preventDefault()
    setCurrentPage(1)
    setSearchKeyword(searchInput.trim())
  }

  function handleSearchInputChange(e) {
    const value = e.target.value
    setSearchInput(value)
    if (value === '') {
      setCurrentPage(1)
      setSearchKeyword('')
    }
  }

  function handleStatusFilterChange(e) {
    setStatusFilter(e.target.value)
    setCurrentPage(1)
  }

  return (
    <>
      <div>
        <section className="w-100">
          <div className="mask d-flex align-items-center h-100">
            <div className="container-fluid">
              <CNavbar expand="lg" colorScheme="light" className="bg-white">
                <CContainer fluid>
                  <CNavbarBrand href="#">Invoices</CNavbarBrand>
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
                      <Dropdown.Menu style={{ minWidth: '300px', padding: '15px' }}>
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
                        <Form.Group className="mb-3">
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
                    <form className="d-flex" role="search" onSubmit={applySearch}>
                      <input
                        value={searchInput}
                        onChange={handleSearchInputChange}
                        className="form-control  custom_input"
                        type="search"
                        placeholder="Search"
                        aria-label="Search"
                      />
                      <button
                        className="btn btn-outline-success custom_search_button"
                        type="submit"
                      >
                        <CIcon icon={freeSet.cilSearch} />
                      </button>
                    </form>
                  </div>
                </CContainer>
              </CNavbar>
              <hr className=" text-secondary m-0" />
              <div className="row justify-content-center">
                <div className="col">
                  <div className="table-responsive bg-white">
                    <table className="table table-striped mb-0">
                      <thead
                        style={{
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          overFlow: 'hidden',
                        }}
                      >
                        <tr>
                          <th className="py-3 border-0">Invoice No.</th>
                          <th className="py-3 border-0">Unit No.</th>

                          <th className="py-3 border-0">Total Amount</th>
                          <th className="py-3 border-0">Owner/Resident</th>

                          <th className="py-3 border-0">Invoice Date</th>
                          <th className="py-3 border-0">Period</th>
                          <th className="py-3 border-0">Due Date</th>

                          <th className="py-3 border-0">Status </th>
                        </tr>
                      </thead>

                      <tbody>
                        {invoices?.map((invoice) => (
                          <tr key={invoice.id}>
                            <th
                              className="pt-3 ps-3 border-0"
                              scope="row"
                              style={{ color: '#666666' }}
                            >
                              <NavLink to={`/finance/invoices/${invoice.id}`}>
                                {invoice.number}
                              </NavLink>
                            </th>
                            <td className="pt-3">
                              {invoice?.unit_contract?.unit?.unit_no || '- '}
                            </td>
                            <td className="pt-3 text-center">{invoice.total_amount || '-'}</td>
                            <td className="pt-2">
                              {PickOwner(invoice?.unit_contract?.contract_members || '-')}
                            </td>

                            <td className="pt-3">{formatdate(invoice?.invoice_date) || '-'}</td>
                            <td className="pt-3">
                              {formatdate(invoice?.period_from) +
                                '/' +
                                formatdate(invoice?.period_to)}
                            </td>
                            <td className="pt-3">{invoice?.due_date || '-'}</td>

                            <td className="pt-3">
                              <button className={`request-${status_color(invoice?.status)}`}>
                                {invoice?.status || '-'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {loading && <Loading />}
                    {errors == true ? toast('We are facing a technical issue at our end.') : null}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <br></br>
          <CNavbar colorScheme="light" className="bg-light d-flex justify-content-center">
            <Row>
              <Col md="12">
                {pagination?.total_pages > 1 ? (
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
        </section>
      </div>
    </>
  )
}
export default Finance
