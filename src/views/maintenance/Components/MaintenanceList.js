import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { CContainer, CNavbar, CNavbarBrand } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import { Col, Row } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import MaintenanceTable from './MaintenanceTable'
import MaintenanceCard from './MaintenanceCard'
import AddMaintenance from './AddMaintenance'

export default function MaintenanceList({ data }) {
  console.log(data)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [table_view, setTableView] = useState(true)

  return (
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
                <div className="d-flex justify-content-end bg-light">
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
                      onClick={null}
                      className="btn btn-outline-success custom_search_button "
                      type="submit"
                    >
                      <CIcon icon={freeSet.cilSearch} />
                    </button>
                  </div>
                  <AddMaintenance />
                  {/* <FilterAccordion filter_callback={filter_callback} units_type={unit_type} /> */}
                </div>
              </div>
            </CContainer>
          </CNavbar>
          <hr className="p-0 m-0 text-secondary" />
          <div>
            {table_view ? <MaintenanceTable data={data} /> : <MaintenanceCard data={data} />}
          </div>
        </div>
      </div>
      <CNavbar colorScheme="light" className="bg-light d-flex justify-content-center">
        <Row>
          {/* <Col md="12">
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
            </Col> */}
        </Row>
      </CNavbar>
    </>
  )
}

MaintenanceList.propTypes = {
  data: PropTypes.array,
}
