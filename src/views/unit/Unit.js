import React, { useEffect, useState } from 'react'
import useFetch from 'use-http'
import useApi from '../../hooks/useApi'
import { getUnits } from './../../api/unit'
import { Container, Row, Col, Card, Table } from 'react-bootstrap'
import Pagination from 'src/components/Pagination'

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
                <Card.Title as="h4">units</Card.Title>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                <Table className="table-hover table-striped">
                  <thead>
                    <tr>
                      <th className="border-0">Unit_no</th>
                      <th className="border-0">Unit_Type</th>
                      <th className="border-0">Bedroom No</th>
                      <th className="border-0">Bathroom No</th>
                      <th className="border-0">Parking</th>
                      <th className="border-0">Year Built</th>
                      <th className="border-0">Electricity Account Number</th>
                      <th className="border-0">Water Account Number</th>
                      <th className="border-0">Internal Extension Number</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getUnitsApi.data?.map((unit) => (
                      <tr key={unit.id}>
                        <td>{unit.unit_no}</td>
                        <td>{unit.unit_type_id}</td>
                        <td>{unit.bedrooms_number}</td>
                        <td>{unit.bathrooms_number}</td>
                        <td>{unit.has_parking}</td>
                        <td>{unit.year_built}</td>
                        <td>{unit.electricity_account_number}</td>
                        <td>{unit.water_account_number}</td>
                        <td>{unit.internal_extension_number}</td>
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
