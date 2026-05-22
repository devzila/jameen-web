import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import { NavLink, useParams } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import { CNavbar, CContainer, CNavbarBrand } from '@coreui/react'
import Loading from 'src/components/loading/loading'
import { toast } from 'react-toastify'
import Paginate from '../../../../components/Pagination'

import { formatdate } from '../../../../services/CommonFunctions'
import AddBuilding from './AddBuilding'

import { Row, Col } from 'react-bootstrap'

export default function Buildings() {
  const [buildings, setBuildings] = useState([])
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [errors, setErrors] = useState(false)
  const [loading, setLoading] = useState(true)

  const { propertyId } = useParams()

  const [searchKeyword, setSearchKeyword] = useState('')

  const { get, response } = useFetch()

  // ✅ SINGLE SOURCE OF TRUTH FETCH
  useEffect(() => {
    fetchBuildings()
  }, [propertyId, currentPage, searchKeyword])

  async function fetchBuildings() {
    setLoading(true)

    let endpoint = `/v1/admin/premises/properties/${propertyId}/buildings?page=${currentPage}`

    if (searchKeyword?.trim()) {
      endpoint += `&q[name_cont]=${encodeURIComponent(searchKeyword.trim())}`
    }

    try {
      const buildingsData = await get(endpoint)

      if (response.ok && buildingsData?.data) {
        setBuildings(buildingsData.data)
        setPagination(buildingsData.pagination)
        setErrors(false)
      } else {
        setErrors(true)
      }
    } catch (error) {
      console.error('API Error:', error)
      setErrors(true)
    } finally {
      setLoading(false)
    }
  }

  function handlePageClick(e) {
    setCurrentPage(e.selected + 1)
  }

  const handleInputChange = (event) => {
    setCurrentPage(1) // reset page on search
    setSearchKeyword(event.target.value)
  }

  function refresh_data() {
    fetchBuildings()
  }

  return (
    <section className="w-100 p-0 mt-2">
      <CNavbar expand="lg" colorScheme="light" className="bg-white">
        <CContainer fluid>
          <CNavbarBrand>Buildings</CNavbarBrand>

          <div className="d-flex justify-content-end">
            <div className="d-flex">
              <input
                value={searchKeyword}
                onChange={handleInputChange}
                className="form-control custom_input"
                type="search"
                placeholder="Search"
              />

              <button onClick={fetchBuildings} className="btn btn-outline-success" type="button">
                <CIcon icon={freeSet.cilSearch} />
              </button>
            </div>

            <AddBuilding after_submit={refresh_data} />
          </div>
        </CContainer>
      </CNavbar>

      <hr />

      <div className="table-responsive bg-white">
        <table className="table table-striped mb-0">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Created At</th>
            </tr>
          </thead>

          <tbody>
            {buildings.map((data) => (
              <tr key={data.id}>
                <td>
                  <NavLink to={`${data.id}`}>{data.name}</NavLink>
                </td>
                <td>{data.description}</td>
                <td>{formatdate(data.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {loading && <Loading />}

        {errors && toast('We are facing a technical issue at our end.')}
      </div>

      <CNavbar className="bg-light d-flex justify-content-center">
        <Row>
          <Col md="12">
            {pagination?.total_pages > 1 && (
              <Paginate
                onPageChange={handlePageClick}
                pageRangeDisplayed={pagination.per_page}
                pageCount={pagination.total_pages}
                forcePage={currentPage - 1}
              />
            )}
          </Col>
        </Row>
      </CNavbar>
    </section>
  )
}
