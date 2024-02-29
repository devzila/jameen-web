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
import Paginate from '../../../components/Pagination'
import CustomDivToggle from 'src/components/CustomDivToggle'
import AddMaintenanceStaff from './AddMaintenanceStaff'
import EditMaintenanceStaff from './EditMaintenanceStaff'
import { BsThreeDots } from 'react-icons/bs'

import { formatdate } from 'src/services/CommonFunctions'

export default function MaintenanceStaff() {
  const [maintenanceData, setMaintenanceData] = useState([])
  const [errors, setErrors] = useState(false)
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const { get, response } = useFetch()
  const [unittype, setUnittype] = useState({})

  useEffect(() => {
    fetchMaintenanceStaff()
  }, [])

  async function fetchMaintenanceStaff() {
    try {
      const api = await get(`/v1/admin/maintenance_staffs`)

      console.log(api)
      if (api && api.data) {
        setLoading(false)
        setMaintenanceData(api.data)

        console.log(api)
      }
    } catch (error) {
      console.error('Error fetching billable items:', error)
    }
  }

  console.log(maintenanceData)
  function handlePageClick(e) {
    setCurrentPage(e.selected + 1)
  }

  function reload_callback() {
    fetchMaintenanceStaff()
  }

  return (
    <>
      <CCol>
        <div>
          <Card className="border-0 mt-3 p-2 rounded-1">
            <div className="d-flex  ms-2 justify-content-between">
              <div className="fs-4 border-0">Maintenance Staff</div>
              <div className=" me-4 border-0">
                <AddMaintenanceStaff after_submit={reload_callback} />
              </div>
            </div>
          </Card>

          <div className="mask d-flex align-items-center h-100 mt-1">
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
                          <th className="pt-3 pb-3 border-0">Name</th>
                          <th className="pt-3 pb-3 border-0">Status</th>
                          <th className="pt-3 pb-3 border-0">Email </th>
                          <th className="pt-3 pb-3 border-0">Mobile No.</th>
                        </tr>
                      </thead>

                      <tbody>
                        {maintenanceData.map((maintenanceData) => (
                          <tr key={maintenanceData.id}>
                            <th className="pt-3 " scope="row" style={{ color: '#666666' }}>
                              <NavLink>{maintenanceData.name}</NavLink>
                            </th>
                            <td className="pt-3 text-capitalize">
                              {maintenanceData.active ? 'Active' : 'Not Active' || '-'}
                            </td>
                            <td className="pt-3 text-capitalize">{maintenanceData.email || '-'}</td>
                            <td className="pt-3"> {maintenanceData.mobile_number || '-'}</td>

                            <td>
                              <Dropdown key={maintenanceData.id}>
                                <Dropdown.Toggle as={CustomDivToggle} style={{ cursor: 'pointer' }}>
                                  <BsThreeDots />
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                  <EditMaintenanceStaff
                                    id={maintenanceData.id}
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

MaintenanceStaff.propTypes = {
  residentId: PropTypes.number,
  show: PropTypes.bool,
  row_data: PropTypes.string,
}
