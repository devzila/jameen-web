// Property.js
import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import useFetch from 'use-http'
import { BsThreeDots } from 'react-icons/bs'
import { Container, Row, Button, Col, Card, Table } from 'react-bootstrap'
import Pagination from 'src/components/Pagination'
import { Dropdown } from 'react-bootstrap'
import CustomDivToggle from '../../components/CustomDivToggle'
import Search from 'src/components/Search'
import { Link } from 'react-router-dom'
import Loading from 'src/components/loading/loading'

function Property() {
  const { get, response } = useFetch()

  useEffect(() => {}, [])

  const [properties, setProperties] = useState([])
  const [filteredProperties, setFilteredProperties] = useState([])
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
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
  }, [currentPage])

  const handlePageClick = (e) => {
    setCurrentPage(e.selected + 1)
  }

  const handleSearch = (searchTerm) => {
    loadInitialProperties(searchTerm)
  }

  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Card className="strpied-tabled-with-hover">
              <Card.Header>
                <Row>
                  <Col md="8">
                    <Card.Title as="h4"> Properties </Card.Title>
                  </Col>
                  <Col md="4" className="align-right">
                    {/* Use the Search component here */}
                    <Search onSearch={handleSearch} />
                    <Button>Add Properties</Button>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                <Table className="table-hover table-striped">
                  <thead>
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
                            <Dropdown.Toggle as={CustomDivToggle} style={{ cursor: 'pointer' }}>
                              <Dropdown.Menu>
                                <Dropdown.Item
                                  key={`edit-${property.id}`}
                                  as={Link}
                                  to={`/properties/${property.id}/units/add`}
                                >
                                  Add
                                </Dropdown.Item>
                              </Dropdown.Menu>
                              <BsThreeDots />
                            </Dropdown.Toggle>
                          </Dropdown>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                {loading && <Loading />}
                {errors && (
                  <p
                    className="d-flex justify-content-cente"
                    style={{ color: 'red', fontSize: 'x-large', marginLeft: '30%' }}
                  >
                    There is a technical issue in Backened
                  </p>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            {pagination ? (
              <Pagination
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
      </Container>
    </>
  )
}

export default Property
