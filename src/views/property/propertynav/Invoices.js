import React, { useState, useEffect } from 'react'
import { useFetch } from 'use-http'
import { toast } from 'react-toastify'
import Paginate from '../../../components/Pagination'
import Loading from 'src/components/loading/loading'
import CustomDivToggle from 'src/components/CustomDivToggle'
import { CNavbar, CContainer, CNavbarBrand } from '@coreui/react'
import { BsThreeDots } from 'react-icons/bs'
import { Dropdown, Row, Col } from 'react-bootstrap'
import { NavLink, useParams } from 'react-router-dom'
import PickOwner from '../unit/UnitFunctions/PickOwner'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import InvoicePayment from 'src/views/finance/InvoicePayment'
import InvoiceCancel from 'src/views/finance/InvoiceCancel'
import { formatdate } from 'src/services/CommonFunctions'
import { status_color } from 'src/services/CommonFunctions'

const Finance = () => {
  const [invoices, setInvoices] = useState([])
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [errors, setErrors] = useState(false)
  const [loading, setLoading] = useState(true)

  const { propertyId } = useParams()

  const [searchKeyword, setSearchKeyword] = useState(null)
  const { get, response } = useFetch()

  useEffect(() => {
    loadInitialinvoices()
  }, [currentPage])

  async function loadInitialinvoices() {
    let endpoint = `/v1/admin/premises/properties/${propertyId}/invoices?page=${currentPage}`
    if (searchKeyword) {
      endpoint += `&q[_cont]=${searchKeyword}`
    }
    let initial_invoices = await get(endpoint)
    console.log(initial_invoices)

    if (response.ok) {
      if (initial_invoices.data) {
        setLoading(false)
        setInvoices(initial_invoices.data)
        setPagination(initial_invoices.pagination)
        console.log(initial_invoices)
      }
    } else if (response.ok) {
      setErrors(true)
      setLoading(false)
      toast('else id executed')
    }
  }

  function handlePageClick(e) {
    setCurrentPage(e.selected + 1)
  }

  return (
    <>
      <div>
        <section className="w-100 p-0 mt-2">
          <div>
            <div className="mask d-flex align-items-center h-100">
              <div className="container-fluid">
                <CNavbar expand="lg" colorScheme="light" className="bg-white">
                  <CContainer fluid>
                    <CNavbarBrand href="#">Invoices</CNavbarBrand>
                    <div className="d-flex justify-content-end">
                      <div className="d-flex" role="search">
                        <input
                          onChange={(e) => setSearchKeyword(e.target.value)}
                          className="form-control  custom_input"
                          type="search"
                          placeholder="Search"
                          aria-label="Search"
                        />
                        <button
                          onClick={loadInitialinvoices}
                          className="btn btn-outline-success custom_search_button"
                          type="submit"
                        >
                          <CIcon icon={freeSet.cilSearch} />
                        </button>
                      </div>
                    </div>
                  </CContainer>
                </CNavbar>
                <hr className="p-0 m-0 text-secondary" />
                {invoices.length >= 1 ? (
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
                                  <NavLink to={`/finance/${invoice.id}/view`}>
                                    {invoice.number}
                                  </NavLink>
                                </th>
                                <td className="pt-3">
                                  {invoice?.unit_contract?.unit?.unit_no || '-'}
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
                                  <button
                                    className=" text-center  text-white border-0 p-0.7 m-0 rounded-0  "
                                    style={{
                                      backgroundColor: `${status_color(invoice.status)}`,

                                      cursor: 'default',
                                      width: '120px',
                                    }}
                                  >
                                    {invoice.status}
                                  </button>
                                </td>
                                <td>
                                  <Dropdown key={invoice.id}>
                                    <Dropdown.Toggle
                                      as={CustomDivToggle}
                                      style={{ cursor: 'pointer' }}
                                    >
                                      <BsThreeDots />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                      <div className="d-flex">
                                        <InvoicePayment invoice={invoice} />
                                        <InvoiceCancel id={invoice.id} />
                                      </div>
                                    </Dropdown.Menu>
                                  </Dropdown>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {loading ?? <Loading />}
                        {errors == true
                          ? toast('We are facing a technical issue at our end.')
                          : null}
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
export default Finance
