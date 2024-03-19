import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import { toast } from 'react-toastify'
import AddResidents from './AddResidents'
import EditResidents from './EditResidents'
import ShowResidents from './ShowResidents'
import Paginate from '../../components/Pagination'
import Loading from 'src/components/loading/loading'
import CustomDivToggle from 'src/components/CustomDivToggle'

import { CNavbar, CContainer, CNavbarBrand } from '@coreui/react'
import { BsThreeDots } from 'react-icons/bs'
import { Dropdown, Row, Col } from 'react-bootstrap'
import { Link, NavLink } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'

const Residents = () => {
  const { get, response } = useFetch()

  const [errors, setErrors] = useState(false)
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  const [residents, setResidents] = useState([])
  const [searchKeyword, setSearchKeyword] = useState(null)

  useEffect(() => {
    loadInitialResidents()
  }, [currentPage])

  async function loadInitialResidents() {
    let endpoint = `/v1/admin/members?page=${currentPage}`
    if (searchKeyword) {
      endpoint += `&q[username_eq]=${searchKeyword}`
    }
    const initialResidents = await get(endpoint)

    if (response.ok) {
      if (initialResidents.data) {
        setLoading(false)
        setResidents(initialResidents.data)
        setPagination(initialResidents.pagination)
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
      <CNavbar expand="lg" colorScheme="light" className="bg-white">
        <CContainer fluid>
          <CNavbarBrand href="/residents">Residents</CNavbarBrand>
          <div className="d-flex justify-content-end">
            <div className="d-flex" role="search">
              <input
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="form-control  custom_input"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button
                onClick={loadInitialResidents}
                className="btn btn-outline-success custom_search_button"
                type="submit"
              >
                <CIcon icon={freeSet.cilSearch} />
              </button>
            </div>
            <AddResidents />
          </div>
        </CContainer>
      </CNavbar>
      <hr className=" text-secondary m-0" />

      <div>
        <div className="mask d-flex align-items-center h-100">
          <div className="w-100">
            <div className="row justify-content-center">
              <div className="">
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
                        <th className="pt-3 pb-3 border-0">DOB</th>
                        <th className="pt-3 pb-3 border-0">Username </th>
                        <th className="pt-3 pb-3 border-0">Gender</th>
                        <th className="pt-3 pb-3 border-0">Email</th>
                        <th className="pt-3 pb-3 border-0">Mobile Number </th>
                      </tr>
                    </thead>

                    <tbody>
                      {residents.map((residents) => (
                        <tr key={residents.id}>
                          <th className="pt-3" scope="row" style={{ color: '#666666' }}>
                            <NavLink to={`/resident/${residents.id}/overview`}>
                              {residents.first_name + ' ' + residents.last_name}
                            </NavLink>
                          </th>
                          <td className="pt-3">{residents.dob}</td>
                          <td className="pt-3">{residents.username}</td>
                          <td className="pt-3">
                            {residents.gender.charAt(0).toUpperCase() + residents.gender.slice(1)}
                          </td>
                          <td className="pt-3">{residents.email}</td>
                          <td className="pt-3">
                            {residents.phone_number
                              .replace('(', ' ')
                              .replace(')', ' ')
                              .replace('.', ' ')
                              .replace(/-/g, ' ')}
                          </td>

                          <td>
                            <Dropdown key={residents.id}>
                              <Dropdown.Toggle as={CustomDivToggle} style={{ cursor: 'pointer' }}>
                                <BsThreeDots />
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <EditResidents id={residents.id} />
                                <ShowResidents id={residents.id} />
                              </Dropdown.Menu>
                            </Dropdown>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {loading && <Loading />}
                  {errors && toast('Unable To Load data')}
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
    </div>
  )
}
export default Residents
