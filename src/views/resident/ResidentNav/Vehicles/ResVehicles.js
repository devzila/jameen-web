import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import PropTypes from 'prop-types'
import { useParams, NavLink } from 'react-router-dom'
import { toast } from 'react-toastify'

import {
  CNavbar,
  CContainer,
  CNavbarBrand,
  CCol,
  CCard,
  CListGroupItem,
  CRow,
  CCardText,
} from '@coreui/react'
import { freeSet } from '@coreui/icons'
import Loading from 'src/components/loading/loading'
import { Dropdown, Row, Col, Card } from 'react-bootstrap'
import Paginate from '../../../../components/Pagination'
import CustomDivToggle from 'src/components/CustomDivToggle'
import AddVehicles from './AddVehicles'
import EditVehices from './EditVehicles'
import CIcon from '@coreui/icons-react'
import { BsThreeDots } from 'react-icons/bs'

import { formatdate } from 'src/services/CommonFunctions'

export default function ResVehicles() {
  const [resvehicles, setResvehicles] = useState([])
  const [errors, setErrors] = useState(false)
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const { get, response } = useFetch()
  const { residentId } = useParams()

  useEffect(() => {
    fetchMemberVehicles()
  }, [residentId])

  async function fetchMemberVehicles() {
    try {
      const api = await get(`/v1/admin/members//${residentId}/vehicles`)
      console.log(api)
      if (api && api.data) {
        setLoading(false)
        setResvehicles(api.data)
      }
    } catch (error) {
      console.error('Error fetching billable items:', error)
    }
  }

  function handlePageClick(e) {
    setCurrentPage(e.selected + 1)
  }

  function reload_callback() {
    fetchMemberVehicles()
  }

  return (
    <>
      <CCol>
        <div>
          <Card className="border-0 mt-3 p-2 rounded-1">
            <div className="d-flex  ms-2  align-items-center justify-content-between">
              <div className="fs-5 border-0 d-flex ">Vehicles</div>
              <div className=" mx-2 border-0">
                <AddVehicles after_submit={reload_callback} residentId={residentId} />
              </div>
            </div>
            <hr className=" text-secondary" />

            <div className="mask d-flex align-items-center h-100 mt-2">
              <div className="w-100">
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
                            <th className="pt-1 border-0">Name</th>
                            <th className="pt-1 border-0">Registration No.</th>
                            <th className="pt-1 border-0">Year Built </th>
                            <th className="pt-1 border-0">Tag</th>
                          </tr>
                        </thead>

                        <tbody>
                          {resvehicles.map((resvehicles) => (
                            <tr key={resvehicles.id}>
                              <th className="pt-3 " scope="row" style={{ color: '#666666' }}>
                                <NavLink>{resvehicles.brand_name}</NavLink>
                              </th>
                              <td className="pt-3 text-capitalize">
                                {resvehicles.registration_no || '-'}
                              </td>
                              <td className="pt-3 text-capitalize">
                                {resvehicles.year_built || '-'}
                              </td>
                              <td className="pt-3"> {resvehicles.tag || '-'}</td>

                              <td>
                                <Dropdown key={resvehicles.id}>
                                  <Dropdown.Toggle
                                    as={CustomDivToggle}
                                    style={{ cursor: 'pointer' }}
                                  >
                                    <BsThreeDots />
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <EditVehices
                                      id={resvehicles.id}
                                      after_submit={reload_callback}
                                    />
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
          </Card>
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
      </CCol>
    </>
  )
}

ResVehicles.propTypes = {
  residentId: PropTypes.number,
  show: PropTypes.bool,
  row_data: PropTypes.string,
}
