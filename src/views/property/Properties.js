// Property.js
import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import useFetch from 'use-http'
import { BsThreeDots } from 'react-icons/bs'
import { Container, Row, Button, Col, Card, Table } from 'react-bootstrap'
import Paginate from 'src/components/Pagination'
import { CForm, CButton, CFormInput, CNavbar, CContainer, CNavbarBrand } from '@coreui/react'
import Loading from 'src/components/loading/loading'
import { Dropdown } from 'react-bootstrap'
import CustomDivToggle from '../../components/CustomDivToggle'
import Search from 'src/components/Search'
import { Link } from 'react-router-dom'
import AddProperty from './AddProperty'

function Property() {
  const { get, response, error } = useFetch()

  useEffect(() => {}, [])

  const [properties, setProperties] = useState([])
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
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
                    className="me-0"
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
                              <td>
                                <NavLink to={`/properties/${property.id}`}>{property.name}</NavLink>
                              </td>
                              <td>{property.city}</td>
                              <td>{property.use_type}</td>
                              <td align="center">
                                <NavLink to={`/properties/${property.id}/units`}>
                                  {property.unit_count}
                                </NavLink>
                              </td>
                              <td>{property.payment_term}</td>
                              <td>
                                <Dropdown key={property.id}>
                                  <Dropdown.Toggle
                                    as={CustomDivToggle}
                                    style={{ cursor: 'pointer' }}
                                  >
                                    <Dropdown.Menu>
                                      <Dropdown.Item
                                        key={`edit-${property.id}`}
                                        as={Link}
                                        to={`/properties/${property.id}/units/edit`}
                                      >
                                        Edit
                                      </Dropdown.Item>
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
                          There is a technical issue in Backened
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
