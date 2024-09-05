import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'

import { toast } from 'react-toastify'
import Paginate from '../../components/Pagination'

import Loading from 'src/components/loading/loading'
import CustomDivToggle from 'src/components/CustomDivToggle'

import { CNavbar, CContainer, CNavbarBrand } from '@coreui/react'
import { BsThreeDots } from 'react-icons/bs'
import { Dropdown, Row, Col } from 'react-bootstrap'
import AddVisitor from './AddVisitor'
import ShowVisitor from './ShowVisitor'
import EditVisitor from './EditVisitor'
import DeleteVisitor from './DeleteVisitor'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'

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
    let endpoint = `/v1/admin/visitors?page=${currentPage}`

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
              <AddVisitor />
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
                    <th className="pt-3 pb-3 border-0">Name</th>
                    <th className="pt-3 pb-3 border-0">Status</th>
                    <th className="pt-3 pb-3 border-0">Visit Date</th>
                    <th className="pt-3 pb-3 border-0">Phone No.</th>
                    <th className="pt-3 pb-3 border-0">Resident ID </th>
                    <th className="pt-3 pb-3 border-0">Unit ID </th>
                    <th className="pt-3 pb-3 border-0">Check In </th>
                    <th className="pt-3 pb-3 border-0">Check Out </th>
                  </tr>
                </thead>

                <tbody>
                  {visitor &&
                    visitor?.map((visitor) => (
                      <tr key={visitor.id}>
                        <th className="pt-3 border-0" scope="row" style={{ color: '#666666' }}>
                          {visitor.name}
                        </th>
                        <td className="pt-3">{visitor.status || '-'}</td>
                        <td className="pt-3">{visitor.visit_date}</td>
                        <td className="pt-3">{visitor.phone_number}</td>
                        <td className="pt-3">
                          {visitor.resident_id?.replace('T', ' ')?.replace('Z', ' ').slice(0, 19)}
                        </td>
                        <td className="pt-3">{visitor.unit_id}</td>
                        <td className="pt-3">
                          {visitor.checkin?.replace('T', ' ')?.replace('Z', ' ').slice(0, 19)}
                        </td>
                        <td className="pt-3">
                          {visitor.chackout?.replace('T', ' ')?.replace('Z', ' ').slice(0, 19)}
                        </td>

                        <td>
                          <Dropdown key={visitor.id}>
                            <Dropdown.Toggle as={CustomDivToggle} style={{ cursor: 'pointer' }}>
                              <BsThreeDots />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <EditVisitor visitorId={visitor.id} />
                              <ShowVisitor visitorId={visitor.id} />
                              <DeleteVisitor visitorId={visitor.id} />
                            </Dropdown.Menu>
                          </Dropdown>
                        </td>
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
