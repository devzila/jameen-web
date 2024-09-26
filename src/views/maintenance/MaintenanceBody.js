import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import { Row, Col } from 'react-bootstrap'
import { CNavbar, CContainer, CNavbarBrand } from '@coreui/react'
import CustomDivToggle from '../../components/CustomDivToggle'
import Loader from 'src/components/loading/loading'
import Paginate from 'src/components/Pagination'
import { useParams } from 'react-router-dom'

import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'

import MaintenanceTable from './Components/MaintenanceTable'
import MaintenanceCard from './Components/MaintenanceCard'
import AddEditMaintenance from './Components/AddEditMaintenance'
import MaintenanceaFilter from './Components/MaintenanceaFilter'
import MaintenanceSort from './Components/MaintenanceSort'
import PropTypes from 'prop-types'

export default function MaintanceBody({ api_endpoint }) {
  const { get, response, error } = useFetch()
  const [maintenance, setMaintenance] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [table_view, setTableView] = useState(true)
  useEffect(() => {
    loaddMaintenanceRequests()
  }, [currentPage])

  function handlePageClick(e) {
    setCurrentPage(e.selected + 1)
  }

  async function loaddMaintenanceRequests(query) {
    let api = api_endpoint + `?page=${currentPage}`
    if (searchKeyword) {
      api += `&q[title_cont]=${searchKeyword}`
    }
    if (query) {
      api += query
    }
    let endpoint = await get(api)
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
          <div className="mask d-flex align-items-center h-100 p-0 mt-2 w-100">
            <div className="w-100">
              <CNavbar expand="lg" colorScheme="light" className="bg-white">
                <CContainer fluid>
                  <div className="d-flex justify-content-between w-100">
                    <div className="d-flex align-items-center">
                      <CNavbarBrand href="#">Maintenance Requests</CNavbarBrand>
                      <CIcon
                        onClick={() => setTableView(!table_view)}
                        icon={table_view ? freeSet.cilShortText : freeSet.cilColumns}
                        size="xxl"
                        title={table_view ? 'Card View' : 'Table View'}
                        className="mt-0 p-0 theme_color"
                      />
                    </div>
                    <div className="d-flex justify-content-end ">
                      <MaintenanceaFilter filter_callback={loaddMaintenanceRequests} />
                      <MaintenanceSort filter_callback={loaddMaintenanceRequests} />
                      <div className="d-flex" role="search">
                        <input
                          value={searchKeyword}
                          onChange={(e) => setSearchKeyword(e.target.value)}
                          className="form-control me-0 custom_input  "
                          type="text"
                          placeholder="Search"
                          aria-label="Search"
                        />
                        <button
                          onClick={loaddMaintenanceRequests}
                          className="btn btn-outline-success custom_search_button bg-light "
                          type="submit"
                        >
                          <CIcon icon={freeSet.cilSearch} />
                        </button>
                      </div>

                      <AddEditMaintenance
                        type="add"
                        id={0}
                        refreshData={loaddMaintenanceRequests}
                      />
                    </div>
                  </div>
                </CContainer>
              </CNavbar>
              <hr className="p-0 m-0 text-secondary" />
              <div>
                {table_view ? (
                  <MaintenanceTable data={maintenance} refreshData={loaddMaintenanceRequests} />
                ) : (
                  <MaintenanceCard data={maintenance} />
                )}
              </div>
            </div>
          </div>
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

MaintanceBody.propTypes = {
  api_endpoint: PropTypes.string,
}
