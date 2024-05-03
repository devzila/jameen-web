import { freeSet } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import React, { useEffect, useState, useRef } from 'react'
import { Col, Row } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { useFetch } from 'use-http'
import { Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js'
import TopCards from './Maintenance/TopCards'
import { CCard, CCol, CRow } from '@coreui/react'

export const Maintenance = () => {
  const { get, response } = useFetch()

  const [sot_data, setSot_data] = useState([])

  const [ticketCountByCategories, setTicketCountByCategory] = useState([])

  const [tcbStatus, setTcbStatus] = useState({})

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarElement,
  )

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

  useEffect(() => {
    satisfactionOverTime()
    loadticketbycategory()
    loadticketbyreqstatus()
  }, [])

  //linechart satisfaction over time
  const satisfactionOverTime = async () => {
    const api = await get('v1/admin/reports/maintenance_request/satisfaction_score_over_time')

    if (response.ok) {
      setSot_data(api.data)
    } else {
      toast.error('Something went wrong')
    }
  }

  const sotLine = {
    labels: sot_data.map((item) => item.yrmn),
    datasets: [
      {
        label: ``,
        data: sot_data.map((item) => item.rating),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  }

  //tickets by category count

  const loadticketbycategory = async () => {
    const api = await get('v1/admin/reports/maintenance_request/tickets_by_categories')
    console.log(api)
    if (response.ok) {
      setTicketCountByCategory(api.data)
    } else {
      // toast.error('Something went wrong')
    }
  }

  const tcbcategories_points = {
    labels: ticketCountByCategories ? Object.keys(ticketCountByCategories) : null,
    datasets: [
      {
        label: 'Tickets By Status',
        data: ticketCountByCategories ? Object.values(ticketCountByCategories) : null,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  }

  //tickets count by satisfaction score

  const loadticketbyreqstatus = async () => {
    const api = await get('v1/admin/reports/maintenance_request/tickets_by_status')
    console.log(api)

    if (response.ok) {
      setTcbStatus(api.data)
    } else {
      // toast.error('Something went wrong')
    }
  }

  const tcbstatus_points = {
    labels: tcbStatus ? Object.keys(tcbStatus) : null,
    datasets: [
      {
        label: 'Tickets By Status',
        data: tcbStatus ? Object.values(tcbStatus) : null,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  }

  //

  return (
    <>
      <TopCards />
      <CRow className="mt-3 ">
        <CCard className="p-3 my-3 border-0">
          <CCol md="12" sm="12" className="bg-white rounded-3">
            <Line options={options} data={sotLine} width={400} height={600} />
          </CCol>
        </CCard>
      </CRow>

      <CRow>
        <CCol md="6" sm="12">
          <CCard className="p-3 my-3 border-0">
            <Bar options={options} data={tcbcategories_points} />
          </CCard>
        </CCol>

        <CCol md="6" sm="12">
          <CCard className="p-3 my-3 border-0">
            <Bar options={options} data={tcbstatus_points} />
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}
