import React, { useEffect, useState } from 'react'
import useFetch from 'use-http'
import { Container, Row, Button, Col, Card, Table } from 'react-bootstrap'
import Pagination from 'src/components/Pagination'
import Search from 'src/components/search'
import UnitGridView from './UnitGridView'
import UnitListView from './UnitListView'

function Unit() {
  const { get, response } = useFetch()

  const [units, setUnits] = useState([])
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [gridView, setGridView] = useState(false)

  useEffect(() => {
    loadInitialUnits()
  }, [currentPage, searchKeyword, gridView])

  async function loadInitialUnits() {
    const endpoint = `/v1/admin/premises/properties/1/units?page=${currentPage}&search=${searchKeyword}`
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

  const toggleViewMode = () => {
    setGridView((prevgridView) => !prevgridView)
  }

  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12" className="align-right">
            <Search listener={handleSearch} />
          </Col>
        </Row>
        <br />
        <Row>
          <Col md="12">
            <Card className="strpied-tabled-with-hover">
              <Card.Header>
                <Row>
                  <Col md="8">
                    <Card.Title as="h4"> Units </Card.Title>
                  </Col>
                  <Col md="4">
                    <Button>Add Units</Button>
                    <Button onClick={toggleViewMode}>
                      Switch to {gridView ? 'List View' : 'Grid View'}
                    </Button>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                {gridView ? <UnitGridView units={units} /> : <UnitListView units={units} />}
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
                forcePage={currentPage}
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
