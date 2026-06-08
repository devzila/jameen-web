import React, { useEffect, useState } from 'react'
import useFetch from 'use-http'
import { Dropdown } from 'react-bootstrap'
import { useParams, NavLink, Link } from 'react-router-dom'
import { Row, Col } from 'react-bootstrap'
import { BsThreeDots } from 'react-icons/bs'
import Paginate from 'src/components/Pagination'
import Loading from 'src/components/loading/loading'
import CustomDivToggle from 'src/components/CustomDivToggle'
import { CNavbar, CContainer, CNavbarBrand, CForm, CFormInput, CButton } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import AllotPropertyParking from './AllotPropertyParking'
import { status_color } from 'src/services/CommonFunctions'
function ParkingLot() {
  const { propertyId } = useParams()
  const { get, put, response, error } = useFetch()

  useEffect(() => {}, [])

  const [parkingLot, setParkingLot] = useState([])
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [errors, setErrors] = useState(false)
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const loadInitialParkingLot = async (searchTerm = '') => {
    let endpoint = `/v1/admin/premises/properties/${propertyId}/parkings?q[parking_number_cont]=${searchTerm}&page=${currentPage}`

    try {
      const initialParkingLot = await get(endpoint)
      setParkingLot(initialParkingLot.data)
      setPagination(initialParkingLot.pagination)
    } catch (error) {
      console.error('Error fetching parking lot data:', error)
      setErrors(true)
    } finally {
      setLoading(false)
    }
  }
  const filteredParkingLot = parkingLot.filter((parking) => {
    if (!statusFilter) return true
    return parking.unit?.status?.toLowerCase() === statusFilter
  })

  useEffect(() => {
    loadInitialParkingLot()
  }, [currentPage, searchKeyword])

  const handlePageClick = (e) => {
    setCurrentPage(e.selected + 1)
  }
  const refresh_data = () => {
    loadInitialParkingLot()

    setSearchKeyword('')
  }

  return (
    <>
      <div>
        {error && error.Error}
        <section style={{ width: '100%', padding: '0px' }}>
          <div>
            <div className="mask d-flex align-items-center h-100 mt-2">
              <div className="container-fluid">
                <CNavbar expand="lg" colorScheme="light" className="bg-white">
                  <CContainer fluid>
                    <CNavbarBrand href="#">Parkings</CNavbarBrand>
                    <div className="d-flex justify-content-end">
                      <AllotPropertyParking after_submit={loadInitialParkingLot} />
                      <select
                        className="form-select me-2"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="">All</option>
                        <option value="allotted">Allotted</option>
                        <option value="unallotted">Unallotted</option>
                      </select>
                      <div className="d-flex" role="search">
                        <input
                          value={searchKeyword}
                          onChange={(e) => setSearchKeyword(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              setCurrentPage(1)
                              loadInitialParkingLot(searchKeyword)
                            }
                          }}
                          className="form-control  custom_input"
                          type="search"
                          placeholder="Search"
                          aria-label="Search"
                        />
                        <button
                          onClick={() => {
                            setCurrentPage(1)
                            loadInitialParkingLot(searchKeyword)
                          }}
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
                            <th className="border-0">Parking Number</th>
                            <th className="border-0">Unit Number</th>
                            <th className="border-0">Vechile Number</th>
                            <th className="border-0  ">Status</th>
                          </tr>
                        </thead>

                        <tbody>
                          {filteredParkingLot.map((parking) => (
                            <tr key={parking.id}>
                              <td>{parking.parking_number}</td>
                              <td>
                                {parking.unit?.unit_no || '-'}
                                {parking.unit?.building?.name && ` (${parking.unit.building.name})`}
                              </td>
                              <td>{parking.vehicle?.registration_no}</td>
                              <td className="pt-3 pb-2 ">
                                <button className={`request-${status_color(parking.unit?.status)}`}>
                                  {parking.unit?.status || '-'}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {loading && <Loading />}
                      {errors && (
                        <p className="text-center small text-danger fst-italic">
                          {process.env.REACT_APP_ERROR_MESSAGE}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <CNavbar colorScheme="light" className="bg-light d-flex justify-content-center">
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

export default ParkingLot
