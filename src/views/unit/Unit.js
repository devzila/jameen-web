import React, { useEffect, useState } from 'react'
import useFetch from 'use-http'
import { BsThreeDots } from 'react-icons/bs'
import { Container, Row, Button, Col, Card, Table } from 'react-bootstrap'
import Pagination from 'src/components/Pagination'
import { Dropdown } from 'react-bootstrap'
import CustomDivToggle from '../../components/CustomDivToggle'
import Search from '../../components/Search'
import '../../scss/_custom.scss'

function Unit() {
  const { get, response } = useFetch()

  useEffect(() => {}, [])

  const [units, setUnits] = useState([])
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchKeyword, setSearchKeyword] = useState('')

  useEffect(() => {
    loadInitialUnits()
  }, [currentPage, searchKeyword])

  async function loadInitialUnits() {
    let endpoint = `/v1/admin/premises/properties/1/units?page=${currentPage}`

    if (searchKeyword) {
      endpoint += `&q[unit_no_eq]=${searchKeyword}`
    }

    const initialUnits = await get(endpoint)

    if (response.ok) {
      setUnits(initialUnits.data.units)
      setPagination(initialUnits.data.pagination)
    }
  }

  const handlePageClick = (e) => {
    setCurrentPage(e.selected + 1)
  }

  const handleSearch = (searchTerm) => {
    setSearchKeyword(searchTerm)
  }

  return (
    <>
      <Container fluid className="full-width-container">
        <Row>
          <Col md="12" className="align-right"></Col>
        </Row>
        <br />
        <Row>
          <Col md="12">
            <Card className="strpied-tabled-with-hover custom-card">
              <Card.Header>
                <Row>
                  <Col md="8">
                    <Card.Title as="h4"> Units </Card.Title>
                    <Search listener={handleSearch} />
                  </Col>
                  <Col md="4">
                    <Button className="custom-button">Add Units</Button>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                <Table className="table-hover table-striped custom-table">
                  <thead>
                    <tr>
                      <th className="border-0">Unit Number</th>
                      <th className="border-0">Bedroom No</th>
                      <th className="border-0">Bathroom No</th>
                      <th className="border-0">Parking</th>
                      <th className="border-0">Year Built</th>
                      <th className="border-0">Status</th>
                      <th className="border-0">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {units.map((unit) => (
                      <tr key={unit.id}>
                        <td>{unit.unit_no}</td>
                        <td>{unit.bedrooms_number}</td>
                        <td>{unit.bathrooms_number}</td>
                        <td>{String(unit.has_parking)}</td>
                        <td>{unit.year_built}</td>
                        <td>{unit.status}</td>
                        <td>
                          <Dropdown key={unit.id}>
                            <Dropdown.Toggle as={CustomDivToggle} style={{ cursor: 'pointer' }}>
                              <BsThreeDots />
                            </Dropdown.Toggle>
                          </Dropdown>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
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

export default Unit
