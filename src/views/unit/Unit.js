import React, { useEffect, useState } from 'react'
import useFetch from 'use-http'
import { BsThreeDots } from 'react-icons/bs'
import useApi from '../../hooks/useApi'
import { getUnits } from './../../api/unit'
import { Container, Row, Button, Col, Card, Table } from 'react-bootstrap'
import Pagination from 'src/components/Pagination'
import { Dropdown } from 'react-bootstrap'
import CustomDivToggle from '../../components/CustomDivToggle'

function Unit() {
  const { get, response } = useFetch()
  const getUnitsApi = useApi(getUnits)

  useEffect(() => {
    getUnitsApi.request()
  }, [])

  const [units, setUnits] = useState([])
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    loadInitialUnits()
  }, [currentPage])

  async function loadInitialUnits() {
    const initialUnits = await get(`/v1/admin/premises/properties/1/units?page=${currentPage}`)
    if (response.ok) {
      setUnits(initialUnits.data.units)
      setPagination(initialUnits.data.pagination)
    }
  }

  function handlePageClick(e) {
    setCurrentPage(e.selected + 1)
  }

  return (
    <>
      {getUnitsApi.loading && <p>Posts are loading!</p>}
      {getUnitsApi.error && <p>{getUnitsApi.error}</p>}

      <Container fluid>
        <Row>
          <Col md="12">
            <Card className="strpied-tabled-with-hover">
              <Card.Header>
                <Row>
                  <Col md="8">
                    <Card.Title as="h4"> Units </Card.Title>
                  </Col>
                  <Col md="4" className="align-right">
                    <Button>Add Units</Button>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                <Table className="table-hover table-striped">
                  <thead>
                    <tr>
                      <th className="border-0">Unit Number</th>
                      <th className="border-0">Bedroom No</th>
                      <th className="border-0">Bathroom No</th>
                      <th className="border-0">Parking</th>
                      <th className="border-0">Year Built</th>
                      <th className="border-0">Status</th>
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
