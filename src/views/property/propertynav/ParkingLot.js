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

function ParkingLot() {
  const { propertyId } = useParams()
  const { get, put, response, error } = useFetch()

  useEffect(() => {}, [])

  const [parkingLot, setParkingLot] = useState([])
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [refresh, setRefresh] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [errors, setErrors] = useState(false)
  const [loading, setLoading] = useState(true)
  const [editable, setEditable] = useState({})

  const loadInitialParkingLot = async (searchTerm = '') => {
    let endpoint = `/v1/admin/premises/properties/${propertyId}/parkings?page=${currentPage}&search=${searchTerm}`

    console.log(endpoint)
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

  const toggleEditable = (id) => {
    setEditable((prevEditable) => ({
      ...prevEditable,
      [id]: !prevEditable[id],
    }))
  }

  const handleInputChange = (e, id) => {
    const { name, value } = e.target
    setParkingLot((prevParkingLot) =>
      prevParkingLot.map((item) => (item.id === id ? { ...item, [name]: value } : item)),
    )
  }

  const saveChanges = async (id) => {
    const parking_ = parkingLot.find((item) => item.id === id)

    await put(`/v1/admin/premises/properties/${propertyId}/parkings/${id}`, { parking: parking_ })

    if (response.ok) {
      toggleEditable(id)
    }
  }

  const cancelEditing = (id) => {
    const originalParking = parkingLot.find((item) => item.id === id)
    setParkingLot((prevParkingLot) =>
      prevParkingLot.map((item) => (item.id === id ? originalParking : item)),
    )
    toggleEditable(id)
  }

  return (
    <>
      <div>
        {error && error.Error}
        <section style={{ width: '100%', padding: '0px' }}>
          <CNavbar expand="lg" colorScheme="light" className="bg-light">
            <CContainer fluid>
              <CNavbarBrand href="#">Parking Lot</CNavbarBrand>

              <div className="d-flex justify-content-end">
                <CForm onSubmit={(e) => e.preventDefault()} className="input-group  d-flex ">
                  <CFormInput
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    type="search"
                    className="me-0 custom_input"
                    placeholder="Search"
                  />
                  <CButton
                    onClick={loadInitialParkingLot}
                    variant="outline"
                    className="btn btn-outline-success my-2 my-sm-0 "
                  >
                    <CIcon icon={freeSet.cilSearch} />
                  </CButton>
                  <br></br>
                  {/* <AddParkingLot />  */}
                </CForm>
              </div>
            </CContainer>
          </CNavbar>
          <div>
            <div className="mask d-flex align-items-center h-100">
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-16">
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
                            <th className="border-0">Parking Number</th>
                            <th className="border-0">Unit Number</th>
                            <th className="border-0">Vechile Number</th>
                            <th className="border-0">ACTIONS</th>
                          </tr>
                        </thead>

                        <tbody>
                          {parkingLot.map((parking) => (
                            <tr key={parking.id}>
                              <td>
                                {editable[parking.id] ? (
                                  <input
                                    type="text"
                                    name="parking_number"
                                    value={parking.parking_number}
                                    onChange={(e) => handleInputChange(e, parking.id)}
                                  />
                                ) : (
                                  parking.parking_number
                                )}
                              </td>
                              <td>{parking.unit.unit_no}</td>
                              <td>{parking.vehicle?.registration_no}</td>
                              <td>
                                {editable[parking.id] ? (
                                  <>
                                    <button
                                      onClick={() => saveChanges(parking.id)}
                                      className="btn btn-success btn-sm me-2"
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={() => cancelEditing(parking.id)}
                                      className="btn btn-danger btn-sm"
                                    >
                                      Cancel
                                    </button>
                                  </>
                                ) : (
                                  <Dropdown key={parking.id}>
                                    <Dropdown.Toggle
                                      as={CustomDivToggle}
                                      style={{ cursor: 'pointer' }}
                                    >
                                      <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => toggleEditable(parking.id)}>
                                          Edit
                                        </Dropdown.Item>
                                        {/* <ShowProperty propertyId={property.id} /> */}
                                      </Dropdown.Menu>
                                      <BsThreeDots />
                                    </Dropdown.Toggle>
                                  </Dropdown>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {loading && <Loading />}
                      {errors && (
                        <p
                          className="d-flex justify-content-cente"
                          style={{ color: 'red', fontSize: 'x-large', marginLeft: '30%' }}
                        >
                          There is a technical issue at Backend
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
