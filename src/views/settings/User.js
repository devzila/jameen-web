import React, { useEffect, useState } from 'react'
import { Container, Row, Button, Col, Card, Table } from 'react-bootstrap'
import useFetch from 'use-http'
import UserForm from './UserForm'

export default function User() {
  const { get, response } = useFetch()
  const [users, setUsers] = useState([])
  const [user_properties, setUser_properties] = useState([])

  useEffect(() => {
    loadInitialUsers()
  }, [])

  async function loadInitialUsers() {
    const endpoint = `/v1/admin/users/`
    const initialUser = await get(endpoint)
    if (response.ok) {
      setUsers(initialUser.data.users)
      console.log(initialUser.data.users)

      setUser_properties(initialUser.data.users.assigned_properties)
      console.log(user_properties)
    }
  }
  return (
    <>
      <UserForm />
      <Container fluid>
        <Row>
          <Col md="12">
            <Card className="strpied-tabled-with-hover ">
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
                      <th className="border-0">Role</th>
                      <th className="border-0">Assigned Properties</th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.map((User) => (
                      <tr key={User.id}>
                        <td>{User.name}</td>
                        <td>{User.email}</td>
                        <td>{User.mobile_number}</td>
                        <td>{User.role.name}</td>
                        <td></td>
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
