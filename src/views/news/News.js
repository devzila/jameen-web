import React, { useState, useEffect } from 'react'
import { useFetch } from 'use-http'
import { toast } from 'react-toastify'
import { CNavbar, CContainer, CNavbarBrand } from '@coreui/react'
import { BsThreeDots } from 'react-icons/bs'
import { Dropdown, Row, Col } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import Loading from 'src/components/loading/loading'
import CustomDivToggle from '../../components/CustomDivToggle'
import Paginate from '../../components/Pagination'

function News() {
  const { get, response } = useFetch()

  const [errors, setErrors] = useState(false)
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  const [posts, setPosts] = useState([])
  const [searchKeyword, setSearchKeyword] = useState(null)

  useEffect(() => {
    loadInitialPosts()
  }, [currentPage])

  async function loadInitialPosts() {
    let endpoint = `/v1/admin/posts?page=${currentPage}`
    if (searchKeyword) {
      endpoint += `&q[title_eq]=${searchKeyword}`
    }
    const initialPosts = await get(endpoint)

    if (response.ok) {
      if (initialPosts.data) {
        setLoading(false)
        setPosts(initialPosts.data)
        setPagination(initialPosts.pagination)
      }
    } else {
      setErrors(true)
      setLoading(false)
    }
  }

  function handlePageClick(e) {
    setCurrentPage(e.selected + 1)
  }

  return (
    <div>
      <CNavbar expand="lg" colorScheme="light" className="bg-white">
        <CContainer fluid>
          <CNavbarBrand href="/news">News</CNavbarBrand>
          <div className="d-flex justify-content-end">
            <div className="d-flex" role="search">
              <input
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="form-control  custom_input"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button
                onClick={loadInitialPosts}
                className="btn btn-outline-success custom_search_button"
                type="submit"
              >
                <CIcon icon={freeSet.cilSearch} />
              </button>
            </div>
            {/* Add News button goes here */}
          </div>
        </CContainer>
      </CNavbar>
      <hr className=" text-secondary m-0" />

      <div>
        <div className="mask d-flex align-items-center h-100">
          <div className="w-100">
            <div className="row justify-content-center">
              <div className="">
                <div className="table-responsive bg-white">
                  <table className="table table-striped mb-0 ">
                    <thead>
                      <tr>
                        <th className="pt-3 pb-3 border-0">Title</th>
                        <th className="pt-3 pb-3 border-0">Category</th>
                        <th className="pt-3 pb-3 border-0">View Count</th>
                        <th className="pt-3 pb-3 border-0">Like Count</th>
                        <th className="pt-3 pb-3 border-0">Content Name</th>
                        <th className="pt-3 pb-3 border-0">Content Body</th>
                        <th className="pt-3 pb-3 border-0">Content Record</th>
                        <th className="pt-3 pb-3 border-0">Status</th>
                        <th className="pt-3 pb-3 border-0">User ID</th>
                        <th className="pt-3 pb-3 border-0">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {posts.map((post) => (
                        <tr key={post.id}>
                          <th className="pt-3 border-0" scope="row">
                            <NavLink to={`${post.id}/posts`}>{post.title}</NavLink>
                          </th>
                          <td className="pt-3">{post.category}</td>
                          <td className="pt-3">{post.view_count}</td>
                          <td className="pt-3">{post.likes_count}</td>
                          <td className="pt-3">{post.content.name}</td>
                          <td className="pt-3">{post.content.body}</td>
                          <td className="pt-3">{post.content.record_type}</td>
                          <td className="pt-3">{post.status}</td>
                          <td className="pt-3">{post.user_id}</td>
                          <td>
                            <Dropdown key={post.id}>
                              <Dropdown.Toggle as={CustomDivToggle} style={{ cursor: 'pointer' }}>
                                <BsThreeDots />
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                {/* Add dropdown menu items as necessary */}
                              </Dropdown.Menu>
                            </Dropdown>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {loading && <Loading />}
                  {errors && toast('Unable To Load data')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
      <CNavbar colorScheme="light" className="bg-light d-flex justify-content-center">
        <Row>
          <Col md="12">
            {pagination ? (
              <Paginate
                onPageChange={handlePageClick}
                pageRangeDisplayed={pagination.per_page}
                pageCount={pagination.total_pages}
                forcePage={currentPage - 1}
              />
            ) : (
              <br />
            )}
          </Col>
        </Row>
      </CNavbar>
    </div>
  )
}

export default News
