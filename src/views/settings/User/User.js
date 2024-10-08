import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import AddUser from './AddUser'
import ShowUser from './ShowUser'
import EditUser from './EditUser'
import { toast } from 'react-toastify'
import Paginate from '../../../components/Pagination'
import Loading from 'src/components/loading/loading'
import CustomDivToggle from 'src/components/CustomDivToggle'

import { CNavbar, CContainer, CNavbarBrand, CCard } from '@coreui/react'
import { BsThreeDots } from 'react-icons/bs'
import { Dropdown, Row, Col } from 'react-bootstrap'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'

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
      endpoint += `&q[username_cont]=${searchKeyword}`
    }
    let initialusers = await get(endpoint)

    if (response.ok) {
      if (initialusers.data) {
        setLoading(false)
        setUsers(initialusers.data)
        setPagination(initialusers.pagination)
      }
    } else {
      setErrors(true)
      setLoading(false)
    }
  }

  function handlePageClick(e) {
    setCurrentPage(e.selected + 1)
  }

  const refresh_data = () => {
    loadInitialusers()
  }

  return (
    <div>
      <section>
        <div>
          <div className="mask d-flex align-items-center h-100 mt-3 ">
            <div className="w-100">
              <div className="row justify-content-center">
                <div className="col-12">
                  <CNavbar expand="lg" colorScheme="light" className="bg-white">
                    <CContainer fluid>
                      <CNavbarBrand href="#">User</CNavbarBrand>
                      <div className="d-flex justify-content-end">
                        <div className="d-flex" role="search">
                          <input
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            onReset={loadInitialusers}
                            className="form-control  custom_input"
                            type="search"
                            placeholder="Search"
                            aria-label="Search"
                          />
                          <button
                            onClick={loadInitialusers}
                            className="btn btn-outline-success custom_search_button"
                            type="submit"
                          >
                            <CIcon icon={freeSet.cilSearch} />
                          </button>
                        </div>
                        <AddUser after_submit={refresh_data} />
                      </div>
                    </CContainer>
                  </CNavbar>
                  <hr className="p-0 m-0 text-secondary" />

                  <div className="table-responsive bg-white">
                    <table className="table table-striped mb-1">
                      <thead
                        style={{
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          overFlow: 'hidden',
                        }}
                      >
                        <tr>
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
                            <th className="pt-3 border-0" scope="row" style={{ color: '#666666' }}>
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
                                  <EditUser userId={user.id} after_submit={refresh_data} />
                                  <ShowUser userId={user.id} />
                                </Dropdown.Menu>
                              </Dropdown>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {loading && <Loading />}
                    {errors == true ? toast('We are facing a technical issue at our end.') : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <br></br>
        <CNavbar colorScheme="light" className="bg-light d-flex justify-content-center">
          <Row>
            <Col md="12">
              {pagination?.total_pages > 1 ? (
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
