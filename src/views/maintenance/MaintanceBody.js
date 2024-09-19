import MaintenanceList from './Components/MaintenanceList'
import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import { Row, Col } from 'react-bootstrap'
import { CNavbar, CContainer, CNavbarBrand } from '@coreui/react'
import CustomDivToggle from '../../components/CustomDivToggle'
// import FilterAccordion from './UnitFunctions/FilterAccordioan'
import Loader from 'src/components/loading/loading'
import Paginate from 'src/components/Pagination'

export default function MaintanceBody() {
  const { get, response, error } = useFetch()
  const [maintenance, setMaintenance] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({})
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    loaddMaintenanceRequests()
  }, [currentPage])

  function handlePageClick(e) {
    setCurrentPage(e.selected + 1)
  }

  async function loaddMaintenanceRequests() {
    let endpoint = await get(`/v1/admin/maintenance/requests?page=${currentPage}`)
    if (response.ok) {
      setLoading(false)
      setMaintenance(endpoint.data)
      setPagination(endpoint.pagination)
    }
  }
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MaintenanceList data={maintenance} />
          <CNavbar colorScheme="light" className="bg-light d-flex justify-content-center my-3">
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
        </>
      )}
    </>
  )
}
