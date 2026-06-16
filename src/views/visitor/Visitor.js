import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'

import { toast } from 'react-toastify'
import Paginate from '../../components/Pagination'

import Loading from 'src/components/loading/loading'

import { CNavbar, CContainer, CNavbarBrand } from '@coreui/react'
import { Row, Col } from 'react-bootstrap'
import AddVisitor from './AddVisitor'
import ShowVisitor from './ShowVisitor'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import CheckPermissions from 'src/permissions/CheckPermissions'

function firstVisitorName(visit) {
  const first = Array.isArray(visit?.visitors) ? visit.visitors[0] : null
  if (first) {
    const fullName = [first.first_name, first.last_name].filter(Boolean).join(' ').trim()
    return first.name || fullName || '-'
  }
  return visit?.name || '-'
}

function unitLabel(visit) {
  const unitNo = visit?.unit_no ?? visit?.unit?.unit_no
  const buildingName = visit?.building_name ?? visit?.building?.name ?? visit?.unit?.building?.name
  if (unitNo && buildingName) return `${unitNo} (${buildingName})`
  return unitNo || buildingName || '-'
}

function formatDateTime(value) {
  if (!value) return '-'
  return String(value).replace('T', ' ').replace('Z', ' ').slice(0, 19)
}

export default function Visitor() {
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [errors, setErrors] = useState(false)
  const [loading, setLoading] = useState(true)

  const [visitor, setVisitor] = useState([])

  const [searchKeyword, setSearchKeyword] = useState(null)
  const { get, response } = useFetch()

  //Ladiong Data
  async function loadInitialVisitor() {
    let endpoint = `/v1/admin/visits?page=${currentPage}`

    if (searchKeyword) {
      endpoint += `&q[name_cont]=${searchKeyword}&q[or][email_cont]=${searchKeyword}&q[or][phone_number_cont]=${searchKeyword}`
    }
    let initialVisitor = await get(endpoint)

    if (response.ok) {
      if (initialVisitor.data) {
        setLoading(false)
        setVisitor(initialVisitor.data)
        setPagination(initialVisitor.pagination)
      }
    } else {
      toast('We are facing a technical issue at our end.')

      setLoading(false)
    }
  }
  useEffect(() => {
    loadInitialVisitor()
  }, [currentPage])

  function handlePageClick(e) {
    setCurrentPage(e.selected + 1)
  }

  return (
    <div>
      <section className="w-100 p-0 bg-white">
        <CNavbar expand="lg" colorScheme="light" className="bg-white">
          <CContainer fluid>
            <CNavbarBrand href="/residents">Visitors</CNavbarBrand>
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
                  onClick={loadInitialVisitor}
                  className="btn btn-outline-success custom_search_button"
                  type="submit"
                >
                  <CIcon icon={freeSet.cilSearch} />
                </button>
              </div>

              <CheckPermissions component={<AddVisitor />} keys={['visitor', 'create']} />
            </div>
          </CContainer>
        </CNavbar>
        <hr className=" text-secondary m-0" />

        <div>
          <div className="mask d-flex align-items-center w-100 h-100">
            <div className="table-responsive bg-white w-100">
              <table className="table mb-0 table-striped">
                <thead
                  style={{
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overFlow: 'hidden',
                  }}
                >
                  <tr>
                    <th className="pt-3 pb-3 border-0">Visitor Name</th>
                    <th className="pt-3 pb-3 border-0">Unit No.</th>
                    <th className="pt-3 pb-3 border-0">Vehicle Number</th>
                    <th className="pt-3 pb-3 border-0">No. of Visitors</th>
                    <th className="pt-3 pb-3 border-0">Purpose</th>
                    <th className="pt-3 pb-3 border-0">Expected Arrival Time</th>
                    <th className="pt-3 pb-3 border-0">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {visitor &&
                    visitor?.map((visit) => (
                      <tr key={visit.id}>
                        <th className="pt-3 border-0" scope="row">
                          <ShowVisitor visit={visit} label={firstVisitorName(visit)} />
                        </th>
                        <td className="pt-3">{unitLabel(visit)}</td>
                        <td className="pt-3">{visit.vehicle_number || '-'}</td>
                        <td className="pt-3">{visit.no_of_visitors ?? '-'}</td>
                        <td className="pt-3">{visit.purpose || '-'}</td>
                        <td className="pt-3">{formatDateTime(visit.expected_arrival_time)}</td>
                        <td className="pt-3">{visit.status || '-'}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {loading && <Loading />}
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
      </section>
    </div>
  )
}
