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

export default function Overview() {
  const { get, response } = useFetch()

  const [ratings, setRatings] = useState()

  useEffect(() => {
    loadSatisfactionScores()
  }, [])
  const loadSatisfactionScores = async () => {
    const api = await get('v1/admin/reports/maintenance_requests')
    if (response.ok) {
      setRatings(api.data[0])
    } else {
      toast.error('Something went wrong')
    }
  }

  const loadGraph = async () => {
    const api = await get('v1/admin/reports/maintenance_requests')
    if (response.ok) {
      setRatings(api.data[0])
    } else {
      toast.error('Something went wrong')
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

  const chartContainer = useRef(null)

  console.log(ratings)
  return (
    <>
      <Row className="mt-4 text-uppercase text-center">
        <Col className="bg-white mx-1 rounded-3 shadow-lg p-3 text-nowrap mt-2 ">
          <div className="d-flex justify-content-center">
            <CIcon
              icon={freeSet.cilSmile}
              size="3xl"
              className={`d-block mb-2  ${
                ratings?.satisfaction_score >= 50 ? 'text-success' : 'text-danger'
              }`}
            />
          </div>

          <div>Satisfaction Score : {ratings?.satisfaction_score | 0}</div>
        </Col>
        <Col className="bg-white mx-1 rounded-3 shadow-lg p-3 text-nowrap mt-2 ">
          <div className="d-flex justify-content-center">
            <CIcon icon={freeSet.cilSmile} size="3xl" className="d-block  mb-2 text-success" />
          </div>
          <div>Good Ratings : {ratings?.good_ratings || 0}</div>
        </Col>
        <Col className="bg-white mx-1 rounded-3 shadow-lg p-3 text-nowrap mt-2 ">
          <div className="d-flex justify-content-center">
            <CIcon icon={freeSet.cilMeh} size="3xl" className="d-block  mb-2 text-warning  " />
          </div>
          <div>Average Ratings : {ratings?.average_ratings || 0}</div>
        </Col>
        <Col className="bg-white mx-1 rounded-3 shadow-lg p-3 text-nowrap mt-2 ">
          <div className="d-flex justify-content-center">
            <CIcon icon={freeSet.cilSad} size="3xl" className="d-block  mb-2 text-danger" />
          </div>
          <div>Bad Ratings : {ratings?.bad_ratings || 0}</div>
        </Col>
        <Col className="bg-white mx-1 rounded-3 shadow-lg p-3 text-nowrap mt-2 ">
          <div className="d-flex justify-content-center">
            <CIcon icon={freeSet.cilLibrary} size="3xl" className="d-block  mb-2 text-secondary" />{' '}
          </div>
          <div>Total Ratings : {ratings?.total_ratings || 0}</div>
        </Col>
      </Row>

      <div className="bg-white  shadow-lg rounded-3 p-3  w-100 h-100 my-3 mx-0">
        <Line options={options} data={data} width={400} height={600} />
      </div>
    </>
  )
}
