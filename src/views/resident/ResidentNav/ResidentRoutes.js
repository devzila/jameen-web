import React from 'react'
import { Route, Routes, useParams } from 'react-router-dom'
import ResNav from './ResNav'
import ResNotes from './ResNotes'
import ResOverview from './ResOverview'
import ResVehicles from './Vehicles/ResVehicles'
import ResHistory from './ResHistory'
import Residents from '../Residents'

export default function ShowResidentPage() {
  return (
    <div>
      <ResNav />
      <Routes path="/residents/:residentId" element={<Residents />}>
        <Route path="overview" name="Resident Overview" element={<ResOverview />} />
        <Route path="notes" name="Resident Notes" element={<ResNotes />} />
        <Route path="vehicles" name="Resident Vehicles" element={<ResVehicles />} />
        <Route path="history" name="Resident History" element={<ResHistory />} />
      </Routes>
    </div>
  )
}
