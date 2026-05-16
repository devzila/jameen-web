import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import { NavLink, useParams } from 'react-router-dom'
import { Row, Col } from 'react-bootstrap'
import Paginate from 'src/components/Pagination'
import { CNavbar, CContainer, CNavbarBrand } from '@coreui/react'
import { formatdate } from '../../../../services/CommonFunctions'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import AddContracts from './AddContracts'
import PickOwner from '../../unit/UnitFunctions/PickOwner'

const Contract = () => {
  const { get, response } = useFetch()

  const { propertyId } = useParams()

  const [runningContracts, setRunningContracts] = useState([])
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState(false)
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [contractType, setContractType] = useState('')

  // ✅ AUTO FETCH
  useEffect(() => {
    loadInitialRunningContracts()
  }, [currentPage, searchKeyword, contractType])

  async function loadInitialRunningContracts() {
    setLoading(true)

    let endpoint = `/v1/admin/premises/properties/${propertyId}/allotments?page=${currentPage}`

    // ✅ FILTER
    if (contractType) {
      endpoint += `&type=${contractType}`
    }

    // ✅ SEARCH
    if (searchKeyword?.trim()) {
      endpoint += `&q[unit_unit_no_cont]=${encodeURIComponent(searchKeyword.trim())}`
    }

    console.log('API ENDPOINT:', endpoint)

    try {
      const initialRunningContracts = await get(endpoint)

      console.log('API RESPONSE:', initialRunningContracts)

      if (response.ok && initialRunningContracts?.data) {
        setRunningContracts(initialRunningContracts.data)
        setPagination(initialRunningContracts.pagination)
        setErrors(false)
      } else {
        setErrors(true)
      }
    } catch (error) {
      console.error('API ERROR:', error)
      setErrors(true)
    } finally {
      setLoading(false)
    }
  }

  function handlePageClick(e) {
    setCurrentPage(e.selected + 1)
  }

  const handleSearch = (e) => {
    setCurrentPage(1)
    setSearchKeyword(e.target.value)
  }

  const refreshData = () => {
    setSearchKeyword('')
    loadInitialRunningContracts()
  }

  return (
    <>
      <section className="w-100 p-0 mt-2">
        <div className="container-fluid">
          <CNavbar expand="lg" colorScheme="light" className="bg-white">
            <CContainer fluid>
              <CNavbarBrand href="/contracts">Contracts</CNavbarBrand>

              <div className="d-flex justify-content-end">
                <div className="d-flex" role="search">
                  <input
                    value={searchKeyword}
                    onChange={handleSearch}
                    className="form-control custom_input"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                  />

                  <button
                    onClick={loadInitialRunningContracts}
                    className="btn btn-outline-success custom_search_button"
                    type="button"
                  >
                    <CIcon icon={freeSet.cilSearch} />
                  </button>
                </div>

                <AddContracts after_submit={refreshData} />
              </div>
            </CContainer>
          </CNavbar>

          <hr className="p-0 m-0 text-secondary" />

          <div className="table-responsive bg-white">
            <table className="table table-striped mb-0">
              <thead>
                <tr>
                  <th className="py-3 border-0">Unit No</th>
                  <th className="py-3 border-0">Period</th>
                  <th className="py-3 border-0">Contract Type</th>
                  <th className="py-3 border-0">Member</th>
                </tr>
              </thead>

              <tbody>
                {runningContracts.length > 0 ? (
                  runningContracts.map((running_contracts) => (
                    <tr key={running_contracts.id}>
                      <td className="py-2">
                        <NavLink className="mx-2" to={`${running_contracts.id}`}>
                          {running_contracts.unit?.unit_no || '-'}
                        </NavLink>
                      </td>

                      <td className="py-2">
                        {formatdate(running_contracts.start_date) || '-'} -
                        {formatdate(running_contracts.end_date) || 'Present'}
                      </td>

                      <td className="py-2">
                        {running_contracts.contract_type?.replace(/_/g, ' ') || '-'}
                      </td>

                      <td className="py-2">
                        {PickOwner(running_contracts.contract_members) || '-'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      No Contracts Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <br />

          <CNavbar colorScheme="light" className="bg-light d-flex justify-content-center">
            <Row>
              <Col md="12">
                {pagination?.total_pages > 1 && (
                  <Paginate
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={pagination.per_page}
                    pageCount={pagination.total_pages}
                    forcePage={currentPage - 1}
                  />
                )}
              </Col>
            </Row>
          </CNavbar>
        </div>
      </section>
    </>
  )
}

export default Contract
