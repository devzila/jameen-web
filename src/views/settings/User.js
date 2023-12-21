import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import Paginate from '../../components/Pagination'
import AssignedPropertiesPop from 'src/components/AssignedPropertiesPop'
import { useNavigate } from 'react-router-dom'
import { BsThreeDots } from 'react-icons/bs'
import { Dropdown } from 'react-bootstrap'
import CustomDivToggle from 'src/components/CustomDivToggle'
import { Link, useParams } from 'react-router-dom'

// react-bootstrap components
import { Badge, Button, Card, Navbar, Nav, Table, Container, Row, Col } from 'react-bootstrap'

function Index() {
  const { companyId } = useParams()
  const [users, setusers] = useState([])
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const { get, post, response, loading, error } = useFetch()
  useEffect(() => {
    loadInitialusers()
  }, [currentPage])
  const history = useNavigate()
  const addUser = () => {
    history(`/companies/${companyId}/users/add`)
  }

  async function loadInitialusers() {
    const initialusers = await get(`/v1/admin/users?page=${currentPage}`)
    if (response.ok) {
      setusers(initialusers.data.users)
      setPagination(initialusers.data.pagination)
    }
  }

  function handlePageClick(e) {
    setCurrentPage(e.selected + 1)
  }

  return (
    <>
      {error && error.Error}
      {loading && 'Loading...'}

      <Container className="container-fluid">
        <Row>
          <Col md="12">
            <Card className="table">
              <Card.Header>
                <Row>
                  <Col md="12">
                    <Card.Title as="h4"> Users </Card.Title>
                    <p className="card-category">List of Users </p>
                  </Col>
                  <Col md="4" className="align-right">
                    <Button onClick={addUser}>Add User</Button>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                <Table className="table">
                  <thead>
                    <tr>
                      <th className="border-0">Name</th>
                      <th className="border-0">Email</th>
                      <th className="border-0">Phone Number</th>
                      <th className="border-0">Username</th>
                      <th className="border-0">Role ID</th>
                      <th className="border-0">Assigned Properties</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.mobile_number}</td>
                        <td>{user.username}</td>
                        <td>{user.role.name}</td>
                        <td>
                          <AssignedPropertiesPop prop={user.assigned_properties} />
                        </td>

                        <td>
                          <Dropdown key={user.id}>
                            <Dropdown.Toggle as={CustomDivToggle} style={{ cursor: 'pointer' }}>
                              <BsThreeDots />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item
                                key={`edit-${user.id}`}
                                as={Link}
                                to={`/companies/${companyId}/users/${user.id}/edit`}
                              >
                                Edit
                              </Dropdown.Item>

                              <Dropdown.Item
                                key={`user-show-${user.id}`}
                                as={Link}
                                to={`/companies/${companyId}/users/${user.id}`}
                              >
                                User Show
                              </Dropdown.Item>
                            </Dropdown.Menu>
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
      </Container>
    </>
  )
}

export default Index
