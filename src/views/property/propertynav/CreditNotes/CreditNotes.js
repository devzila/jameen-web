import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import { toast } from 'react-toastify'
import { NavLink, useParams } from 'react-router-dom'
import { Dropdown, Row, Col } from 'react-bootstrap'
import { BsThreeDots } from 'react-icons/bs'
import Paginate from 'src/components/Pagination'
import CustomDivToggle from 'src/components/CustomDivToggle'
import { CNavbar, CContainer, CNavbarBrand } from '@coreui/react'
import { formatdate } from '../../../../services/CommonFunctions'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
// import AddContracts from './AddContracts'
// import FilterAccordionContract from './FilterAccordionContract'
// import ManualInvoice from './ManualInvoice'

const CreditNote = () => {
  const { get, response } = useFetch()
  const { propertyId, unitId } = useParams()
  const [creditNotes, setCreditNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState(false)
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchKeyword, setSearchKeyword] = useState(null)

  useEffect(() => {
    loadInitialCreditNotes()
  }, [currentPage, searchKeyword])

  async function loadInitialCreditNotes(queries) {
    let endpoint = `/v1/admin/template/credit_notes?page=${currentPage}`
    console.log(queries)
    if (queries) {
      endpoint += `&type=${queries}`
    }
    if (searchKeyword) {
      endpoint += `&q=${searchKeyword}`
    }
    const initialCreditNotes = await get(endpoint) // Corrected variable name
    console.log('Initial Credit Notes:', initialCreditNotes) // Corrected variable name

    if (response.ok) {
      if (initialCreditNotes.data) {
        // Corrected variable name
        setLoading(false)
        setCreditNotes(initialCreditNotes.data) // Corrected variable name
        setPagination(initialCreditNotes.pagination) // Corrected variable name
      }
    } else {
      setErrors(true)
      setLoading(false)
    }
  }

  function handlePageClick(e) {
    setCurrentPage(e.selected + 1)
  }

  const refreshData = () => {
    loadInitialCreditNotes()
    setSearchKeyword('')
  }

  return (
    <>
      <section className="w-100 p-0 mt-2">
        <div>
          <div className="mask d-flex align-items-center h-100">
            <div className="container-fluid">
              <CNavbar expand="lg" colorScheme="light" className="bg-white">
                <CContainer fluid>
                  <CNavbarBrand href="/contracts">Credit Notes</CNavbarBrand>
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
                        onClick={loadInitialCreditNotes}
                        className="btn btn-outline-success custom_search_button "
                        type="submit"
                      >
                        <CIcon icon={freeSet.cilSearch} />
                      </button>
                    </div>
                    {/* <AddContracts after_submit={refreshData} /> */}
                  </div>
                </CContainer>
              </CNavbar>
              <div>
                <div className="mask d-flex align-items-center h-100">
                  <div className="w-100">
                    <div className="row justify-content-center">
                      <div className="col-12">
                        <div className="table-responsive bg-white">
                          <table className="table mb-0">
                            <thead>
                              <tr>
                                <th className="pt-3 pb-3 border-0">Name</th>
                                <th className="pt-3 pb-3 border-0">Created At</th>
                                <th className="pt-3 pb-3 border-0">Updated At</th>
                                <th className="pt-3 pb-3 border-0">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {creditNotes.map((credit_notes) => (
                                <tr key={credit_notes.id}>
                                  <td className="pt-3">{credit_notes.name || '-'}</td>
                                  <td className="pt-3">{formatdate(credit_notes.created_at)}</td>
                                  <td className="pt-3">{formatdate(credit_notes.updated_at)}</td>
                                  <td>
                                    <Dropdown>
                                      <Dropdown.Toggle
                                        as={CustomDivToggle}
                                        style={{ cursor: 'pointer' }}
                                      >
                                        <BsThreeDots />
                                      </Dropdown.Toggle>
                                      {/* <Dropdown.Menu>
                                        {credit_notes.contract_type == 'allotment' ? (
                                          <ManualInvoice
                                            after_submit={loadInitialCreditNotes}
                                            allotmentId={credit_notes.id}
                                          />
                                        ) : null}
                                      </Dropdown.Menu> */}
                                    </Dropdown>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
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
          </div>
        </div>
      </section>
    </>
  )
}

export default CreditNote
