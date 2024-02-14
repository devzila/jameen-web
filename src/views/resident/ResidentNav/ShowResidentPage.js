import React from 'react'
import { Route, Routes, useParams } from 'react-router-dom'
import ResNav from './ResNav'
import ResNotes from './ResNotes'
import ResOverview from './ResOverview'

export default function ShowResidentPage() {
  const { residentID } = useParams()
  // const ResOverview = React.lazy(() => import('./ResOverview'))
  // const ResNotes = React.lazy(() => import('./ResNotes'))

  return (
    <div>
      <ResNav />
      <Routes>
        <Route path="overview" name="Resident Overview" element={<ResOverview />} />
        <Route path="notes" name="Resident Notes" element={<ResNotes />} />
      </Routes>
    </div>
  )
}
