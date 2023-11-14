import React, { useEffect, useState } from 'react'
import { useFetch } from 'use-http'
import { BsThreeDots } from 'react-icons/bs'
import { Container, Row, Col, Table, Button, Card, Dropdown } from 'react-bootstrap'
import Pagination from 'src/components/Pagination'
import CustomDivToggle from '../../components/CustomDivToggle'

function News() {
  const { get, response } = useFetch()

  useEffect(() => {}, [])

  const [posts, setPosts] = useState([])
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    loadInitialPosts()
  }, [currentPage])

  async function loadInitialPosts() {
    const initialPosts = await get(`/v1/admin/posts?page=${currentPage}`)
    if (response.ok) {
      setPosts(initialPosts.data.posts)
      setPagination(initialPosts.data.pagination)
    }
  }

  function handlePageClick(e) {
    setCurrentPage(e.selected + 1)
  }

  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Card className="strpied-tabled-with-hover">
              <Card.Header>
                <Row>
                  <Col md="8">
                    <Card.Title as="h4"> Properties </Card.Title>
                  </Col>
                  <Col md="4" className="align-right">
                    <Button>Add Properties</Button>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                <Table className="table-hover table-striped">
                  <thead>
                    <tr>
                      <th className="border-0">NEWS ID</th>
                      <th className="border-0">TITLE</th>
                      <th className="border-0">CONTENT</th>
                      <th className="border-0">CATEGORY</th>
                      <th className="border-0">VIEW COUNT</th>
                      <th className="border-0">LIKE COUNT</th>
                      <th className="border-0">PUBLISH DATE</th>
                      <th className="border-0">STATUS</th>
                      <th className="border-0">USER ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map((post) => (
                      <tr key={post.id}>
                        <td>{post.title}</td>
                        <td>{post.content}</td>
                        <td>{post.category}</td>
                        <td>{post.view_count}</td>
                        <td>{post.like_count}</td>
                        <td>{post.publish_date}</td>
                        <td>{post.status}</td>
                        <td>{post.user_id}</td>
                        <td>
                          <Dropdown key={post.id}>
                            <Dropdown.Toggle as={CustomDivToggle} style={{ cursor: 'pointer' }}>
                              <BsThreeDots />
                            </Dropdown.Toggle>
                          </Dropdown>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            {pagination ? (
              <Pagination
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
      </Container>
    </>
  )
}

export default News
