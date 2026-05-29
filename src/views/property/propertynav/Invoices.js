import React, { useState, useEffect } from 'react'
import { useFetch } from 'use-http'
import { toast } from 'react-toastify'
import Paginate from '../../../components/Pagination'
import Loading from 'src/components/loading/loading'
import { CNavbar, CContainer, CNavbarBrand } from '@coreui/react'
import { Row, Col, Form } from 'react-bootstrap'
import { NavLink, useParams } from 'react-router-dom'
import PickOwner from '../unit/UnitFunctions/PickOwner'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'

import { formatdate } from 'src/services/CommonFunctions'
import { status_color } from 'src/services/CommonFunctions'

const INVOICE_STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: '1', label: 'Pending' },
  { value: '2', label: 'Due' },
  { value: '3', label: 'Paid' },
  { value: '4', label: 'Partial paid' },
  { value: '5', label: 'Cancelled' },
]

const PropertyInvoices = () => {
  const [invoices, setInvoices] = useState([])
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)

  const { propertyId } = useParams()

  const [searchInput, setSearchInput] = useState('')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const { get, response } = useFetch()

  useEffect(() => {
    loadInitialinvoices()
  }, [currentPage, searchKeyword, statusFilter, propertyId])

  async function loadInitialinvoices() {
    setLoading(true)
    let endpoint = `/v1/admin/premises/properties/${propertyId}/invoices?page=${currentPage}`
    if (searchKeyword?.trim()) {
      endpoint += `&q[number_cont]=${encodeURIComponent(searchKeyword.trim())}`
    }
    if (statusFilter !== '') {
      endpoint += `&q[status_eq]=${statusFilter}`
    }
    const initial_invoices = await get(endpoint)

    if (response.ok) {
      if (initial_invoices.data) {
        setInvoices(initial_invoices.data)
        setPagination(initial_invoices.pagination)
      }
    } else {
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
        <section className="w-100 p-0 mt-2">
          <div>
            <div className="mask d-flex align-items-center h-100">
              <div className="container-fluid p-0">
                <CNavbar expand="lg" colorScheme="light" className="bg-white">
                  <CContainer fluid>
                    <CNavbarBrand href="#">Invoices</CNavbarBrand>
                    <div className="d-flex justify-content-end align-items-center gap-2 flex-wrap">
                      <Form.Select
                        aria-label="Filter by invoice status"
                        className="custom_input"
                        style={{ width: 'auto', minWidth: '160px' }}
                        value={statusFilter}
                        onChange={handleStatusFilterChange}
                      >
                        {INVOICE_STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value || 'all'} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </Form.Select>
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
                <hr className="p-0 m-0 text-secondary" />
                {loading && invoices.length === 0 ? (
                  <Loading />
                ) : invoices.length >= 1 ? (
                  <div className="row justify-content-center">
                    <div className="col-12">
                      <div className="table-responsive bg-white">
                        <table className="table table-striped  mb-0">
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
                                <th className="pt-3 ps-3 border-0" scope="row">
                                  <NavLink to={`${invoice.id}`}>{invoice.number}</NavLink>
                                </th>
                                <td className="pt-3">
                                  {invoice?.unit_contract?.unit?.unit_no || '-'}
                                  {invoice?.unit_contract?.unit?.building?.name &&
                                    ` (${invoice?.unit_contract?.unit?.building?.name})`}
                                </td>
                                <td className="pt-3 text-center">{invoice?.total_amount || '-'}</td>
                                <td className="pt-2">
                                  {PickOwner(invoice?.unit_contract?.contract_members)}
                                </td>
                                <td className="pt-3">{formatdate(invoice?.invoice_date) || '-'}</td>
                                <td className="pt-3">
                                  {formatdate(invoice?.period_from) +
                                    '/' +
                                    formatdate(invoice?.period_to)}
                                </td>{' '}
                                <td className="pt-3">{invoice?.due_date || '-'}</td>
                                <td className="pt-3">
                                  <button className={`request-${status_color(invoice?.status)}`}>
                                    {invoice.status}
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {loading && <Loading />}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-center  fst-italic bg-white p-5">No Invoice Found</p>
                )}
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
export default PropertyInvoices
