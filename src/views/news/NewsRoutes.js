import React from 'react'
import { Route, Routes, useParams } from 'react-router-dom'
import PostIndex from './PostIndex'

export default function NewsRoutes() {
  // const PostIndex = React.lazy(() => import('./PostIndex'))
  // const ResNotes = React.lazy(() => import('./ResNotes'))

  return (
    <div>
      <Routes>
        <Route path="posts" name="PostIndex" element={<PostIndex />} />
      </Routes>
    </div>
  )
}
