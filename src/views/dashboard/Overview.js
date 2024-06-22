import { freeSet } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import React, { useEffect, useState, useRef } from 'react'
import { Col, Row } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { useFetch } from 'use-http'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { CCard, CCol, CRow } from '@coreui/react'

export default function Overview() {
  const { get, response } = useFetch()

  const [overview_data, setOverview] = useState()

  useEffect(() => {
    loadOverviewRecords()
  }, [])

  const loadOverviewRecords = async () => {
    const api = await get('v1/admin/reports/overviews')

    console.log(api.data)
    if (response.ok) {
      setOverview(api.data)
      console.log(overview_data)
    } else {
      // toast.error('Something went wrong')
    }
  }

  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Maintenance Requests',
      },
    },
  }

  var size = { width: '600', height: '450' }

  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July']

  const data = {
    labels,
    datasets: [
      {
        label: '',
        data: [22, 3, 12, 55, 62, 6, 12],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  }
  return (
    <>
      <CRow>
        <CCol md="4" sm="12">
          <CCard className="p-3 my-3 border-0">
            <table>
              <thead>
                <tr className="text-center text-uppercase fw-bold">Residents</tr>
              </thead>
              <tbody>
                {overview_data
                  ? Object.entries(overview_data.resident).map((item) => (
                      <tr key={item} className="border-bottom ">
                        <td className="text-capitalize">{item[0].replace(/_/g, ' ')}</td>
                        <td>{item[1]}</td>
                        <hr />
                      </tr>
                    ))
                  : null}
              </tbody>
            </table>
          </CCard>
        </CCol>
        <CCol md="4" sm="12">
          <CCard className="p-3 my-3 border-0">
            <table>
              <thead>
                <tr className="text-center text-uppercase fw-bold">Maintenance Requests</tr>
              </thead>
              <tbody>
                {overview_data
                  ? Object.entries(overview_data.maintenance_requests).map((item) => (
                      <>
                        <tr key={item} className="border-bottom ">
                          <td className="text-capitalize">{item[0].replace(/_/g, ' ')}</td>
                          <td>{item[1]}</td>
                          <hr />
                        </tr>
                      </>
                    ))
                  : null}
              </tbody>
            </table>
          </CCard>
        </CCol>
        <CCol md="4" sm="12">
          <CCard className="p-3 my-3 border-0">
            <table>
              <thead>
                <tr className="text-center text-uppercase fw-bold">Maintenance Requests</tr>
              </thead>
              <tbody>
                {overview_data
                  ? Object.entries(overview_data.finance).map((item) => (
                      <tr key={item} className="border-bottom ">
                        <td className="text-capitalize">{item[0].replace(/_/g, ' ')}</td>
                        <td>{item[1]}</td>
                        <hr />
                      </tr>
                    ))
                  : null}
              </tbody>
            </table>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}
