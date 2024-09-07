import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { CContainer, CNavbar, CNavbarBrand } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import { Col, Row } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'

export default function MaintenanceList({ data }) {
  console.log(data)
  const [searchKeyword, setSearchKeyword] = useState('')

  return (
    <>
      <section className="w-100 p-0 mt-2">
        <div className="mask d-flex align-items-center h-100 p-0 m-0 w-100">
          <div className="w-100">
            <CNavbar expand="lg" colorScheme="light" className="bg-white">
              <CContainer fluid>
                <CNavbarBrand href="#">Maintenance Requests</CNavbarBrand>
                <div className="d-flex justify-content-end bg-light">
                  <div className="d-flex  " role="search">
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
                  {/* <FilterAccordion filter_callback={filter_callback} units_type={unit_type} /> */}
                </div>
              </CContainer>
            </CNavbar>
            <hr className="p-0 m-0 text-secondary" />

            <div className="row justify-content-center">
              <div className="col-16">
                <div className="table-responsive bg-white">
                  <table className="table  table-striped mb-0">
                    <thead
                      style={{
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        overFlow: 'hidden',
                      }}
                    >
                      <tr>
                        <th className="pt-3 pb-3 border-0  ">Name</th>
                        <th className="pt-3 pb-3 border-0  "> ID </th>
                        <th className="pt-3 pb-3 border-0  ">Category</th>
                        <th className="pt-3 pb-3 border-0  ">Status</th>
                        <th className="pt-3 pb-3 border-0  ">Asignee</th>
                        <th className="pt-3 pb-3 border-0  ">Date</th>
                        <th className="pt-3 pb-3 border-0  ">Expected Handover Date</th>
                        <th className="pt-3 pb-3 border-0  "> Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {data?.map((item) => (
                        <tr key={item.id}>
                          <td className="pt-3 pb-2">
                            <NavLink className="mx-2 p-0">{item.name || '-'}</NavLink>
                          </td>
                          <td className="pt-3 pb-2">{item.id || '-'}</td>

                          <td className="pt-3 pb-2">{item.category.name || '-'}</td>
                          <td className="pt-3 pb-2">{item.status || '-'}</td>
                          <td className="pt-3 pb-2">{null || '-'}</td>
                          <td className="pt-3 pb-2">{null || '-'}</td>

                          <td className="pt-3 pb-2">{null || '-'}</td>
                          <td className="pt-3 pb-2 ">{null || '...'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {/* {loading && <Loading />}
                    {errors && (
                      <p className="text-center small text-danger fst-italic">
                        {process.env.REACT_APP_ERROR_MESSAGE}
                      </p>
                    )} */}
                </div>
              </div>
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
      </section>
    </>
  )
}

MaintenanceList.propTypes = {
  data: PropTypes.array,
}
