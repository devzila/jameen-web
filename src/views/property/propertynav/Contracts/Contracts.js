import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import { Dropdown, Row, Col } from 'react-bootstrap'
import { BsThreeDots } from 'react-icons/bs'
import Paginate from 'src/components/Pagination'
import Loading from 'src/components/loading/loading'
import CustomDivToggle from 'src/components/CustomDivToggle'
import { CNavbar, CContainer, CNavbarBrand } from '@coreui/react'
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
  const [contractTypeFilter, setContractTypeFilter] = useState('')

  useEffect(() => {
    loadInitialRunningContracts()
  }, [currentPage, searchKeyword, contractTypeFilter])

  async function loadInitialRunningContracts() {
    let endpoint = `/v1/admin/premises/properties/${propertyId}/units?page=${currentPage}`
    if (searchKeyword) {
      endpoint += `&q=${searchKeyword}`
    }
    if (contractTypeFilter) {
      endpoint += `&contract_type=${contractTypeFilter}`
    }
    const initialRunningContracts = await get(endpoint)
    console.log('Initial Running Contracts:', initialRunningContracts)

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
    setContractTypeFilter('')
  }

  return (
    <div>
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
                className="btn btn-outline-success custom_search_button"
                type="submit"
              >
                Search
              </button>
            </div>
            <FilterAccordionContract filterCallback={setContractTypeFilter} />
            <AddContracts after_submit={refreshData} />
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
                        <th className="pt-3 pb-3 border-0">ID</th>
                        <th className="pt-3 pb-3 border-0">Start Date</th>
                        <th className="pt-3 pb-3 border-0">Contract Type</th>
                        <th className="pt-3 pb-3 border-0">Notes</th>
                        <th className="pt-3 pb-3 border-0">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {runningContracts.map((data) =>
                        data.running_contracts.map((running_contracts) => (
                          <tr key={data.id}>
                            <td className="pt-3">{running_contracts.id || '-'}</td>
                            <td className="pt-3">{running_contracts.start_date || '-'}</td>
                            <td className="pt-3">{running_contracts.contract_type || '-'}</td>
                            <td className="pt-3">{running_contracts.notes || '-'}</td>
                            <td>
                              <Dropdown>
                                <Dropdown.Toggle as={CustomDivToggle} style={{ cursor: 'pointer' }}>
                                  <BsThreeDots />
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                  {/* <EditContracts ContractId={contract.id} after_submit={refresh_data} /> */}
                                </Dropdown.Menu>
                              </Dropdown>
                            </td>
                          </tr>
                        )),
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
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
    </div>
  )
}

export default Contract
