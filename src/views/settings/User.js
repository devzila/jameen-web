import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import Paginate from '../../components/Pagination'
import MultiValueListPop from 'src/components/MultiValueListPop'
import CustomDivToggle from 'src/components/CustomDivToggle'
import AddUser from './AddUser'
import { CForm, CButton, CFormInput, CNavbar, CContainer, CNavbarBrand } from '@coreui/react'
import { BsThreeDots } from 'react-icons/bs'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Dropdown, Row, Col } from 'react-bootstrap'

function Index() {
  const { companyId } = useParams()
  const [users, setusers] = useState([])
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [userid, setUserid] = useState(null)
  const { get, post, response, loading, error } = useFetch()
  useEffect(() => {
    loadInitialusers()
  }, [currentPage])
  const history = useNavigate()
  const addUser = () => {
    history(`/companies/${companyId}/users/add`)
  }

  async function loadInitialusers() {
    const initialusers = await get(`/v1/admin/users/`)
    if (response.ok) {
      setusers(initialusers.data.users)
      setPagination(initialusers.data.pagination)
    }
  }

  function handlePageClick(e) {
    setCurrentPage(e.selected + 1)
  }

  return (
    <div>
      {error && error.Error}
      {loading && 'Loading...'}
      <section style={{ width: '100%', padding: '0px' }}>
        <CNavbar expand="lg" colorScheme="light" className="bg-light">
          <CContainer fluid>
            <CNavbarBrand href="#">User</CNavbarBrand>
            {/* <CButton color="success" variant="outline">
            Actions
          </CButton> */}
            <div className="d-flex justify-content-end">
              <CForm className="d-flex">
                <CFormInput
                  onChange={(e) => setUserid(e.target.value)}
                  type="search"
                  className="me-2"
                  placeholder="Search"
                />
                <CButton onClick={loadInitialusers} color="success" variant="outline">
                  Search
                </CButton>
              </CForm>
              <br></br>
              <AddUser />
            </div>
          </CContainer>
        </CNavbar>
        <div>
          <div className="mask d-flex align-items-center h-100">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-12">
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
                          <th className="border-0">Name</th>
                          <th className="border-0">Email</th>
                          <th className="border-0">Phone Number</th>
                          <th className="border-0">Username</th>
                          <th className="border-0">Role</th>
                          <th className="border-0">Assigned Properties</th>
                          <th className="border-0">Action </th>
                          <th className="border-0"> </th>
                        </tr>
                      </thead>

                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id}>
                            <th scope="row" style={{ color: '#666666' }}>
                              {user.name}
                            </th>
                            <td>{user.email}</td>
                            <td>{user.mobile_number}</td>
                            <td>{user.username}</td>
                            <td>{user.role.name}</td>
                            <td>
                              {/* <AssignedPropertiesPop prop={user.assigned_properties} /> */}
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
                    </table>
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
  )
}

export default Index
