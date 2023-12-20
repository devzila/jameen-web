import React, { useEffect, useState } from 'react'
import { Container, Row, Button, Col, Card, Table } from 'react-bootstrap'
import useFetch from 'use-http'

export default function User() {
  const { get, response } = useFetch()
  const [users, setUsers] = useState([])

  useEffect(() => {
    loadInitialUsers()
  }, [])

  async function loadInitialUsers() {
    const endpoint = `/v1/admin/users/`
    const initialUser = await get(endpoint)

    if (response.ok) {
      setUsers(initialUser.data.users)
    }
  }
  return (
    <>
      <UserModal />
      <Container fluid>
        <Row>
          <Col md="12">
            <Card className="strpied-tabled-with-hover">
              <Card.Header>
                <Row>
                  <Col md="8">
                    <Card.Title as="h4"> User </Card.Title>
                  </Col>
                  <Col md="4" className="align-right">
                    {/* Use the Search component here */}
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                <Table className="table-hover table-striped">
                  <thead>
                    <tr>
                      <th className="border-0">NAME</th>
                      <th className="border-0">EMAIL</th>
                      <th className="border-0">MOBILE NO.</th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.map((User) => (
                      <tr key={User.id}>
                        <td>{User.name}</td>
                        <td>{User.email}</td>
                        <td>{User.mobile_number}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )
}
