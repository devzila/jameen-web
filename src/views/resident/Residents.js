import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import { toast } from 'react-toastify'
import AddResidents from './AddResidents'

import Paginate from '../../components/Pagination'
import Loading from 'src/components/loading/loading'

import { CNavbar, CContainer, CNavbarBrand } from '@coreui/react'
import { Row, Col } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import ResidentUnitPicker from './ResidentNav/ResidentUnitPicker'
import ResidentFIlters from './ResidentFIlters'

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

  async function loadInitialResidents(query) {
    let endpoint = `/v1/admin/members?page=${currentPage}`
    if (searchKeyword) {
      endpoint += `&q[username_cont]=${searchKeyword}`
    }
    console.log(query)
    if (typeof query === 'string') {
      // endpoint += query
    }

    endpoint += `q[dob_gteq]=2005-02-07}`
    const initialResidents = await get(endpoint)

    if (response.ok) {
      if (initialResidents.data) {
        setLoading(false)
        setResidents(initialResidents.data)
        setPagination(initialResidents.pagination)
        console.log(initialResidents.data)
        if (initialResidents.data.length == 0) {
          toast.warn('No data found!')
        }
      }
    } else {
      setErrors(true)
      setLoading(false)
    }
  }
  function handlePageClick(e) {
    setResidents([])
    setLoading(true)
    setCurrentPage(e.selected + 1)
  }

  return (
    <div>
      <CNavbar expand="lg" colorScheme="light" className="bg-white">
        <CContainer fluid>
          <CNavbarBrand href="/residents">Residents</CNavbarBrand>
          <div className="d-flex justify-content-end">
            <ResidentFIlters filter_callback={loadInitialResidents} />
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
                  <table className="table table-striped mb-0 ">
                    <thead
                      style={{
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        overFlow: 'hidden',
                      }}
                    >
                      <tr>
                        <th className="pt-3 pb-3 border-0">Name</th>
                        <th className="pt-3 pb-3 border-0">Username </th>
                        <th className="pt-3 pb-3 border-0">Gender</th>
                        <th className="pt-3 pb-3 border-0">Unit(s)</th>
                      </tr>
                    </thead>

                    <tbody>
                      {residents.map((resident) => (
                        <tr key={resident.id}>
                          <th className="pt-3 border-0 text-nowrap" scope="row">
                            <NavLink to={`/resident/${resident.id}/overview`}>
                              {resident.first_name + ' ' + resident.last_name}
                            </NavLink>
                          </th>
                          <td className="pt-3">{resident.username}</td>
                          <td className="pt-3">
                            {resident.gender?.charAt(0)?.toUpperCase() + resident.gender?.slice(1)}
                          </td>{' '}
                          <td className="pt-3">{ResidentUnitPicker(resident)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {loading && <Loading />}
                  {errors ?? toast('Unable To Load data')}
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
