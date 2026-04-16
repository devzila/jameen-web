import React, { Suspense } from 'react'
import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import ResNav from './ResNav'
import ResNotes from './ResNotes'
import ResOverview from './ResOverview'
import ResVehicles from './Vehicles/ResVehicles'
import ResHistory from './ResHistory'
import Residents from '../Residents'
import ShowContract from 'src/views/property/propertynav/Contracts/ShowContracts/ShowContract'

export default function ShowResidentPage() {
  return (
    <div>
      <ResNav />
      <Suspense>
        <Routes>
          <Route path="*" name="Resident Overview" element={<Navigate to={'/resident'} />} />
          <Route path="overview" name="Resident Overview" element={<ResOverview />} />
          <Route path="notes" name="Resident Notes" element={<ResNotes />} />
          <Route path="vehicles" name="Resident Vehicles" element={<ResVehicles />} />
          <Route path="history" name="Resident History" element={<ResHistory />} />
          <Route
            path="property/:propertyId/allotment/:contractId"
            name="Contracts"
            element={<ShowContract />}
          />
          <Route
            path="property/:propertyId/moving_in/:contractId"
            name="Contracts"
            element={<ShowContract />}
          />
        </Routes>
      </Suspense>
    </div>
  )
}
