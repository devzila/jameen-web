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
import AddContracts from './AddContracts'
import FilterAccordionContract from './FilterAccordionContract'

const Contract = () => {
  const { get, response } = useFetch()
  const { propertyId, unitId } = useParams()
  const [runningContracts, setRunningContracts] = useState([])
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState(false)
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchKeyword, setSearchKeyword] = useState(null)
  const [contract_type, setContract_type] = useState([])

  useEffect(() => {
    loadInitialRunningContracts()
  }, [currentPage, searchKeyword])

  async function loadInitialRunningContracts(queries) {
    let endpoint = `/v1/admin/premises/properties/${propertyId}/contracts?page=${currentPage}`
    if (queries) {
      endpoint += `&type=${queries}`
    }
    if (searchKeyword) {
      endpoint += `&q=${searchKeyword}`
    }
    const initialRunningContracts = await get(endpoint)

    if (response.ok) {
      if (initialRunningContracts.data) {
        setLoading(false)
        setRunningContracts(initialRunningContracts.data)
        setPagination(initialRunningContracts.pagination)
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
    loadInitialRunningContracts()
    setSearchKeyword('')
  }

  function filter_callback(queries) {
    loadInitialRunningContracts(queries)
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
                  <CNavbarBrand href="/contracts">Contracts</CNavbarBrand>
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
                        onClick={loadInitialRunningContracts}
                        className="btn btn-outline-success custom_search_button "
                        type="submit"
                      >
                        <CIcon icon={freeSet.cilSearch} />
                      </button>
                    </div>
                    <FilterAccordionContract
                      filterCallback={filter_callback}
                      contracts_type={contract_type}
                    />
                    <AddContracts after_submit={refreshData} />
                  </div>
                </CContainer>
              </CNavbar>
              <hr className="p-0 m-0 text-secondary" />

              <div>
                <div className="mask d-flex align-items-center h-100">
                  <div className="w-100">
                    <div className="row justify-content-center">
                      <div className="col-12">
                        <div className="table-responsive bg-white">
                          <table className="table  table-striped mb-0">
                            <thead>
                              <tr>
                                <th className="pt-3 pb-3 border-0">Unit No</th>
                                <th className="pt-3 pb-3 border-0">Period</th>
                                <th className="pt-3 pb-3 border-0">Contract Type</th>
                                <th className="pt-3 pb-3 border-0">Member</th>
                                <th className="pt-3 pb-3 border-0">Notes</th>
                              </tr>
                            </thead>
                            <tbody>
                              {runningContracts.map((running_contracts) => (
                                <tr key={running_contracts.id}>
                                  <td className="pt-3">
                                    <NavLink className="mx-2" to={`${running_contracts.id}`}>
                                      {running_contracts.unit.unit_no || '-'}
                                    </NavLink>
                                  </td>
                                  <td>
                                    {formatdate(running_contracts.start_date) || '-'}
                                    {formatdate(running_contracts.end_date) || ' - Present'}{' '}
                                  </td>
                                  <td className="pt-3">
                                    {running_contracts.contract_type.replace(/_/g, ' ') || '-'}
                                  </td>
                                  <td className="pt-3">
                                    {running_contracts.contract_members.member_type || '-'}
                                  </td>
                                  <td className="pt-3">{running_contracts.notes || '-'}</td>
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

export default Contract
