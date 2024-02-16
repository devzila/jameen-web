import React, { useEffect, useState } from 'react'
import useFetch from 'use-http'
import AddProperty from './AddProperty'
import { Dropdown } from 'react-bootstrap'
import { NavLink, Link } from 'react-router-dom'
import { Row, Col } from 'react-bootstrap'
import { BsThreeDots } from 'react-icons/bs'
import Paginate from 'src/components/Pagination'
import Loading from 'src/components/loading/loading'
import CustomDivToggle from '../../components/CustomDivToggle'
import { CNavbar, CContainer, CNavbarBrand, CForm, CFormInput, CButton } from '@coreui/react'
import ShowProperty from './ShowProperty'
import EditProperty from './EditProperty'

function Property() {
  const { get, response, error } = useFetch()

  useEffect(() => {}, [])

  const [properties, setProperties] = useState([])
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [refresh, setRefresh] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [errors, setErrors] = useState(false)
  const [loading, setLoading] = useState(true)

  const loadInitialProperties = async (searchTerm = '') => {
    let endpoint = `/v1/admin/premises/properties?page=${currentPage}&search=${searchTerm}`

    const initialProperties = await get(endpoint)
    if (response.ok) {
      setLoading(false)
      setProperties(initialProperties.data)
      setPagination(initialProperties.pagination)
    } else {
      setErrors(true)
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInitialProperties()
  }, [currentPage, searchKeyword])

  const handlePageClick = (e) => {
    setCurrentPage(e.selected + 1)
  }
  const refresh_data = () => {
    console.log('called')
    loadInitialProperties()

    setSearchKeyword('')
  }

  return (
    <>
      <div>
        {error && error.Error}
        <section style={{ width: '100%', padding: '0px' }}>
          <CNavbar expand="lg" colorScheme="light" className="bg-light">
            <CContainer fluid>
              <CNavbarBrand href="#">Property</CNavbarBrand>

              <div className="d-flex justify-content-end">
                <CForm onSubmit={(e) => e.preventDefault()} className="input-group  d-flex ">
                  <CFormInput
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    type="search"
                    className="me-0 custom_input"
                    placeholder="Search"
                  />
                  <CButton
                    onClick={loadInitialProperties}
                    variant="outline"
                    className="btn btn-outline-success my-2 my-sm-0 "
                  >
                    Search
                  </CButton>
                  <br></br>
                  <AddProperty />
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
                            <th className="border-0">NAME</th>
                            <th className="border-0">CITY</th>
                            <th className="border-0">USE TYPE</th>
                            <th className="border-0">UNIT COUNT</th>
                            <th className="border-0">PAYMENT TERM</th>
                            <th className="border-0">ACTIONS</th>
                          </tr>
                        </thead>

                        <tbody>
                          {properties.map((property) => (
                            <tr key={property.id}>
                              <td style={{ textTransform: 'capitalize' }}>
                                <NavLink to={`/properties/${property.id}`}>{property.name}</NavLink>
                              </td>
                              <td>{property.city}</td>
                              <td style={{ textTransform: 'uppercase' }}>{property.use_type}</td>
                              <td align="center">
                                <NavLink to={`/properties/${property.id}/units`}>
                                  {property.units_count}
                                </NavLink>
                              </td>
                              <td style={{ textTransform: 'capitalize' }}>
                                {property.payment_term?.replace('_', ' ')}
                              </td>
                              <td>
                                <Dropdown key={property.id}>
                                  <Dropdown.Toggle
                                    as={CustomDivToggle}
                                    style={{ cursor: 'pointer' }}
                                  >
                                    <Dropdown.Menu>
                                      <EditProperty
                                        propertyId={property.id}
                                        after_submit={refresh_data}
                                      />
                                      <ShowProperty propertyId={property.id} />
                                    </Dropdown.Menu>
                                    <BsThreeDots />
                                  </Dropdown.Toggle>
                                </Dropdown>
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
          <br></br>
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
        </section>
      </div>
    </>
  )
}

export default Property
