import React, { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'

export default function NewsRoutes() {
  const NewsShow = React.lazy(() => import('./NewsShow'))

  return (
    <div>
      <Suspense>
        <Routes>
          <Route path="view" name="News" element={<NewsShow />} />
        </Routes>
      </Suspense>
    </div>
  )
}
