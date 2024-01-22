import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'

import { toast } from 'react-toastify'
import Paginate from '../../../components/Pagination'
import Loading from 'src/components/loading/loading'
import CustomDivToggle from 'src/components/CustomDivToggle'

import { CNavbar, CContainer, CNavbarBrand } from '@coreui/react'
import { BsThreeDots } from 'react-icons/bs'
import { Dropdown, Row, Col } from 'react-bootstrap'
import AddRoles from './AddRoles'
import ShowRoles from './ShowRoles'
import EditRoles from './EditRoles'

export default function Role() {
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [errors, setErrors] = useState(false)
  const [loading, setLoading] = useState(true)

  const [roles, setRoles] = useState([])

  const [searchKeyword, setSearchKeyword] = useState(null)
  const { get, response } = useFetch()

  async function loadInitialroles() {
    let endpoint = `/v1/admin/roles?page=${currentPage}`
    if (searchKeyword) {
      endpoint += `&q[username_eq]=${searchKeyword}`
    }
    let initialroles = await get(endpoint)
    console.log(initialroles)

    if (response.ok) {
      if (initialroles.data) {
        setLoading(false)
        setRoles(initialroles.data)
        setPagination(initialroles.pagination)
      }
    } else {
      setErrors(true)
      setLoading(false)
    }
  }
  useEffect(() => {
    loadInitialroles()
  }, [currentPage])

  function handlePageClick(e) {
    setCurrentPage(e.selected + 1)
  }

  return (
    <div>
      <section style={{ width: '100%', padding: '0px' }}>
        <CNavbar expand="lg" colorScheme="light" className="bg-light">
          <CContainer fluid>
            <CNavbarBrand href="#">Role</CNavbarBrand>
            <div className="d-flex justify-content-end">
              <div className="d-flex" role="search">
                <input
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="form-control me-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                />
                <button
                  onClick={loadInitialroles}
                  className="btn btn-outline-success"
                  type="submit"
                >
                  Search
                </button>
              </div>
              <AddRoles />
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
                          <th className="pt-3 pb-3 border-0">Name</th>
                          <th className="pt-3 pb-3 border-0">Description</th>
                          <th className="pt-3 pb-3 border-0">User Type</th>
                          <th className="pt-3 pb-3 border-0">Privilages</th>
                          <th className="pt-3 pb-3 border-0">Created At </th>
                          <th className="pt-3 pb-3 border-0">Last Modified</th>
                        </tr>
                      </thead>

                      <tbody>
                        {roles.map((role) => (
                          <tr key={role.id}>
                            <th className="pt-3" scope="row" style={{ color: '#666666' }}>
                              {role.name}
                            </th>
                            <td className="pt-3">{role.description || '-'}</td>
                            <td className="pt-3">
                              {role.user_type.charAt(0).toUpperCase() +
                                role.user_type.slice(1).replace(/_/g, ' ')}
                            </td>
                            <td className="pt-3">{role.privileges || '-'}</td>
                            <td className="pt-3">
                              {role.created_at.replace('T', ' ').replace('Z', ' ').slice(0, 19)}
                            </td>
                            <td className="pt-3">
                              {role.updated_at.replace('T', ' ').replace('Z', ' ').slice(0, 19)}
                            </td>

                            <td>
                              <Dropdown key={role.id}>
                                <Dropdown.Toggle as={CustomDivToggle} style={{ cursor: 'pointer' }}>
                                  <BsThreeDots />
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                  <EditRoles roleId={role.id} />
                                  <ShowRoles roleId={role.id} />
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
