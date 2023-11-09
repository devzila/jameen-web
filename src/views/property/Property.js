import React, { useEffect, useState } from 'react'
import useFetch from 'use-http'
import { BsThreeDots } from 'react-icons/bs'
import { Container, Row, Button, Col, Card, Table } from 'react-bootstrap'
import Pagination from 'src/components/Pagination'
import { Dropdown } from 'react-bootstrap'
import CustomDivToggle from '../../components/CustomDivToggle'

function Property() {
  const { get, response } = useFetch()

  useEffect(() => {}, [])

  const [properties, setProperties] = useState([])
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    loadInitialProperties()
  }, [currentPage])

  async function loadInitialProperties() {
    const initialProperties = await get(
  `/v1/admin/premises/properties?page=${currentPage}`
)
    if (response.ok) {
      setProperties(initialProperties.data.properties)
      setPagination(initialProperties.data.pagination)
    }
  }

  function handlePageClick(e) {
    setCurrentPage(e.selected + 1)
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
                    <Button>Add Properties</Button>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                <Table className="table-hover table-striped">
                  <thead>
                    <tr>
                      <th className="border-0">Property Number</th>
                      <th className="border-0">NAME</th>
                      <th className="border-0">ADDRESS</th>
                      <th className="border-0">CITY</th>
                      <th className="border-0">SHORT NAME</th>
                      <th className="border-0">VAT NO</th>
                      <th className="border-0">INVOICE NO</th>
                      <th className="border-0">USE TYPE</th>
                      <th className="border-0">OVERVIEW DAYS</th>
                      <th className="border-0">CHARGE AMOUNT</th>
                      <th className="border-0">PAYMENT TERM</th>
                      <th className="border-0">INVOICE DAY</th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map((property) => (
                      <tr key={property.id}>
                        <td>{property.name}</td>
                        <td>{property.address}</td>
                        <td>{property.city}</td>
                        <td>{property.short_name}</td>
                        <td>{property.vat_no}</td>
                        <td>{property.invoice_no_prefix}</td>
                        <td>{property.use_type}</td>
                        <td>{property.invoice_overdue_days}</td>
                        <td>{property.overdue_charge_amount}</td>
                        <td>{property.payment_term}</td>
                        <td>{property.invoice_day}</td>
                        <td>
                          <Dropdown key={property.id}>
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

export default Property
