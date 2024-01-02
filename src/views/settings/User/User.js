import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import Paginate from '../../../components/Pagination'
import MultiValueListPop from 'src/components/MultiValueListPop'
import CustomDivToggle from 'src/components/CustomDivToggle'
import AddUser from './AddUser'
import EditUser from './EditUser'
import { CForm, CButton, CFormInput, CNavbar, CContainer, CNavbarBrand } from '@coreui/react'
import { BsThreeDots } from 'react-icons/bs'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Dropdown, Row, Col } from 'react-bootstrap'
import ShowUser from './ShowUser'

function Index() {
  const { companyId } = useParams()
  const [users, setusers] = useState([])
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchKeyword, setSearchKeyword] = useState(null)
  const { get, post, response, loading, error } = useFetch()
  useEffect(
    () => {
      loadInitialusers()
    },
    [currentPage],
    [EditUser],
    [AddUser],
  )

  const history = useNavigate()
  const addUser = () => {
    history(`/companies/${companyId}/users/add`)
  }

  async function loadInitialusers() {
    let endpoint = `/v1/admin/users?page=${currentPage}`
    if (searchKeyword) {
      endpoint += `&q[username_eq]=${searchKeyword}`
    }
    let initialusers = await get(endpoint)

    if (response.ok) {
      if (initialusers.data) {
        setusers(initialusers.data.users)
        setPagination(initialusers.data.pagination)
      }
    }
  }

  function handlePageClick(e) {
    setCurrentPage(e.selected + 1)
  }
  const handleSearch = (searchTerm) => {
    setSearchKeyword(searchTerm)
  }

  return (
    <div>
      {error && error.Error}
      {/* {loading && 'Loading...'} */}
      <section style={{ width: '100%', padding: '0px' }}>
        <CNavbar expand="lg" colorScheme="light" className="bg-light">
          <CContainer fluid>
            <CNavbarBrand href="#">User</CNavbarBrand>
            {/* <CButton color="success" variant="outline">
            Actions
          </CButton> */}
            <div className="d-flex justify-content-end">
              {/* <CContainer className="h-50 d-flex"> */}
              <CForm onSubmit={(e) => e.preventDefault()} className="input-group  d-flex ">
                {/* <Search listener={handleSearch} /> */}

                <CFormInput
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  type="search"
                  className="me-0"
                  placeholder="Search"
                />
                <CButton
                  onClick={loadInitialusers}
                  // color="success"
                  variant="outline"
                  className="btn btn-outline-success my-2 my-sm-0 "
                >
                  Search
                </CButton>
                {/* </CContainer> */}
                <br></br>
                <AddUser />
              </CForm>
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
                                  <EditUser userid={{ id: `${user.id}` }} />
                                  <ShowUser userid={{ id: `${user.id}` }} />
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
