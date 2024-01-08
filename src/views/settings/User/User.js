import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import Paginate from '../../../components/Pagination'
import CustomDivToggle from 'src/components/CustomDivToggle'
import AddUser from './AddUser'
import EditUser from './EditUser'
import Loading from 'src/components/loading/loading'
import 'react-loading-skeleton/dist/skeleton.css'

import { CForm, CButton, CFormInput, CNavbar, CContainer, CNavbarBrand } from '@coreui/react'
import { BsThreeDots } from 'react-icons/bs'
import { Dropdown, Row, Col } from 'react-bootstrap'
import ShowUser from './ShowUser'

function Index() {
  const [users, setUsers] = useState([])
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [errors, setErrors] = useState(false)
  const [loading, setLoading] = useState(true)

  const [searchKeyword, setSearchKeyword] = useState(null)
  const { get, response } = useFetch()
  useEffect(() => {
    loadInitialusers()
  }, [currentPage])

  async function loadInitialusers() {
    let endpoint = `/v1/admin/users?page=${currentPage}`
    if (searchKeyword) {
      endpoint += `&q[username_eq]=${searchKeyword}`
    }
    let initialusers = await get(endpoint)

    console.log(initialusers)

    if (response.ok) {
      if (initialusers.data) {
        setLoading(false)
        setUsers(initialusers.data.users)
        setPagination(initialusers.data.pagination)
      }
    } else {
      setErrors(true)
      setLoading(false)
    }
  }

  function handlePageClick(e) {
    setCurrentPage(e.selected + 1)
  }

  return (
    <div>
      <section style={{ width: '100%', padding: '0px' }}>
        <CNavbar expand="lg" colorScheme="light" className="bg-light">
          <CContainer fluid>
            <CNavbarBrand href="#">User</CNavbarBrand>
            <div className="d-flex justify-content-end">
              <CForm onSubmit={(e) => e.preventDefault()} className="input-group  d-flex ">
                <CFormInput
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  type="search"
                  className="me-0 s-3 "
                  placeholder="Username"
                />
                <CButton
                  onClick={loadInitialusers}
                  variant="outline"
                  className="btn btn-outline-success "
                >
                  Search
                </CButton>
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
                        <tr style={{ color: 'pink' }}>
                          <th className="pt-3 pb-3 border-0">Name</th>
                          <th className="pt-3 pb-3 border-0">Email</th>
                          <th className="pt-3 pb-3 border-0">Phone Number</th>
                          <th className="pt-3 pb-3 border-0">Username</th>
                          <th className="pt-3 pb-3 border-0">Role</th>
                          <th className="pt-3 pb-3 border-0">Action </th>
                        </tr>
                      </thead>

                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id}>
                            <th className="pt-3" scope="row" style={{ color: '#666666' }}>
                              {user.name}
                            </th>
                            <td className="pt-3">{user.email}</td>
                            <td className="pt-3">{user.mobile_number}</td>
                            <td className="pt-3">{user.username}</td>
                            <td className="pt-3">{user.role.name}</td>

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
                    {loading && <Loading />}
                    {errors && (
                      <p
                        className="d-flex justify-content-cente"
                        style={{ color: 'red', fontSize: 'x-large', marginLeft: '30%' }}
                      >
                        We are facing a technical issue at our end.
                      </p>
                    )}
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
