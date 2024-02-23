import React, { useState, useEffect } from 'react'
import { useFetch } from 'use-http'
import { toast } from 'react-toastify'
import Paginate from '../../components/Pagination'
import Loading from 'src/components/loading/loading'
import CustomDivToggle from 'src/components/CustomDivToggle'
import { CNavbar, CContainer, CNavbarBrand } from '@coreui/react'
import { BsThreeDots } from 'react-icons/bs'
import { Dropdown, Row, Col } from 'react-bootstrap'
import ShowInvoices from './ShowInvoices'
import { status_color } from 'src/services/CommonFunctions'

const Finance = () => {
  const [invoices, setInvoices] = useState([])
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [errors, setErrors] = useState(false)
  const [loading, setLoading] = useState(true)

  const [searchKeyword, setSearchKeyword] = useState(null)
  const { get, response } = useFetch()

  useEffect(() => {
    loadInitialinvoices()
  }, [currentPage])

  async function loadInitialinvoices() {
    let endpoint = `/v1/admin/invoices?page=${currentPage}`
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
        <section style={{ width: '100%', padding: '0px' }}>
          <CNavbar expand="lg" colorScheme="light" className="bg-light">
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
                    Search
                  </button>
                </div>
              </div>
            </CContainer>
          </CNavbar>
          <div>
            <div className="mask d-flex align-items-center h-100">
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-12">
                    <div className="table-responsive bg-white">
                      <table className="table mb-0">
                        <thead
                          style={{
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            overFlow: 'hidden',
                          }}
                        >
                          <tr>
                            <th className="pt-3 pb-3 border-0">Invoice No.</th>
                            <th className="pt-3 pb-3 border-0">Amount</th>
                            <th className="pt-3 pb-3 border-0">Invoice Date</th>
                            <th className="pt-3 pb-3 border-0">From/TO</th>
                            <th className="pt-3 pb-3 border-0">Status </th>
                          </tr>
                        </thead>

                        <tbody>
                          {invoices.map((invoice) => (
                            <tr key={invoice.id}>
                              <th className="pt-3" scope="row" style={{ color: '#666666' }}>
                                {invoice.number}
                              </th>
                              <td className="pt-3">{invoice.amount}</td>
                              <td className="pt-3">{invoice.invoice_date}</td>
                              <td className="pt-3">
                                {invoice.period_from + '/' + invoice.period_to}
                              </td>
                              <td className="pt-3">
                                <button
                                  className=" text-center "
                                  style={{
                                    backgroundColor: `${status_color(invoice.status)}`,
                                    border: '0px',
                                    padding: '1px',
                                    borderRadius: '2px',
                                    color: 'white',
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
                                    {/* <ShowUser userId={invoice.id} /> */}
                                  </Dropdown.Menu>
                                </Dropdown>
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
          </div>
          <br></br>
          <CNavbar
            colorScheme="light"
            className="bg-light d-flex justify-content-center"
            placement="fixed-bottom"
          >
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
        </section>
      </div>
    </>
  )
}
export default Finance
