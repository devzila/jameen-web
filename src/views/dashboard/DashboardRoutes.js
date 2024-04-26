import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Overview from './Overview'
import Finance from './Finance'
import { Container } from 'react-bootstrap'
import { Maintenance } from './Maintenance'

export default function DashboardRoutes() {
  return (
    <Container>
      <Routes>
        <Route path="overview" element={<Overview />} />
        <Route path="finance" element={<Finance />} />
        <Route path="maintenance" element={<Maintenance />} />
      </Routes>
    </Container>
  )
}
