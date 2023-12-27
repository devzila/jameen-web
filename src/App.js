import React, { Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './scss/style.scss'
import IndexUnit from '/src/views/unit/Index.js'
import AddUnit from 'src/views/unit/Add.js'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={loading}>
        <Routes>
        <Route exact path="/properties/:id/units" name="/units" element={<IndexUnit />} />
          <Route exact path="/properties/:id/units/add" name="/units" element={<AddUnit />} />
          <Route exact path="/500" name="Page 500" element={<Page500 />} />
          <Route path="*" name="Home" element={<DefaultLayout />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
