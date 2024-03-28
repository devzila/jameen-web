import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { CCol } from '@coreui/react'
import Loading from 'src/components/loading/loading'
import { Dropdown, Row, Col, Card } from 'react-bootstrap'
import CustomDivToggle from 'src/components/CustomDivToggle'
import AddVehicles from './AddVehicles'
import EditVehices from './EditVehicles'
import { BsThreeDots } from 'react-icons/bs'

export default function ResVehicles() {
  const [resvehicles, setResvehicles] = useState([])
  const [errors, setErrors] = useState(false)
  const [loading, setLoading] = useState(true)
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

  function reload_callback() {
    fetchMemberVehicles()
  }

  return (
    <>
      <CCol>
        <div>
          <Card className="border-0 mt-3 py-2 rounded-1">
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
                      <table className="table table-striped mb-0">
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
                              <th className="pt-3 border-0" scope="row">
                                {resvehicles.brand_name}
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
      </CCol>
    </>
  )
}

ResVehicles.propTypes = {
  residentId: PropTypes.number,
  show: PropTypes.bool,
  row_data: PropTypes.string,
}
