import React, { Suspense } from 'react'
import { Route, Routes, useParams } from 'react-router-dom'

export default function NewsRoutes() {
  const NewsShow = React.lazy(() => import('./NewsShow'))
  // const ResNotes = React.lazy(() => import('./ResNotes'))

  return (
    <div>
      <Suspense>
        <Routes>
          <Route path="posts" name="News" element={<NewsShow />} />
        </Routes>
      </Suspense>
    </div>
  )
}
