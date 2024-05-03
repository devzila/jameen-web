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
      // toast.error('Something went wrong')
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
  return <></>
}
