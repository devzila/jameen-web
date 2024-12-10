import { freeSet } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CCard, CRow, CCol, CListGroupItem, CCardText } from '@coreui/react'
import React, { useState, useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { formatdate, formatNumberCount } from 'src/services/CommonFunctions'
import useFetch from 'use-http'

function NewsShow() {
  const { postId } = useParams()
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    fetchPost()
  }, [])
  const { get, response } = useFetch()

  const fetchPost = async () => {
    const endpoint = await get(`v1/admin/posts/${postId}`)

    if (response.ok) {
      setData(endpoint.data)
    }
  }

  return (
    <>
      <div className="d-flex justify-content-end">
        <button className="btn custom_theme_button">Edit</button>
        <button className="btn custom_theme_button">Publish</button>
        <button className="btn custom_red_button">Delete</button>
      </div>
      <Row>
        <CCol md="3">
          <CCol md="12">
            <CCard className="p-3 my-3 rounded-0 border-0">
              <CListGroupItem>
                <CIcon icon={freeSet.cilGraph} size="lg" className="me-2 theme_color" />
                <strong>Stats</strong>
                <hr className="text-secondary" />
              </CListGroupItem>
              <CRow>
                <div className="d-flex align-items-center justify-content-around">
                  <p className="m-0">
                    <CIcon icon={freeSet.cilChart} size="lg" className="me-2 theme_color" />{' '}
                    {formatNumberCount(data?.view_count) || 0}
                  </p>
                  <p className="mx-2 my-0">
                    <CIcon icon={freeSet.cilHeart} size="lg" className="me-2 theme_color" />{' '}
                    {formatNumberCount(data?.likes_count) || 0}
                  </p>
                  <p className="mx-2 my-0">
                    <CIcon icon={freeSet.cilCommentSquare} size="lg" className="me-2 theme_color" />{' '}
                    {formatNumberCount(data?.comments?.length) || 0}
                  </p>
                </div>
              </CRow>
            </CCard>
          </CCol>
          <CCol md="12">
            <CCard className=" p-3 my-3rounded-0 border-0">
              <CListGroupItem>
                <CIcon icon={freeSet.cilTags} size="lg" className="me-2 theme_color" />
                <strong>Tags</strong>
                <hr className="text-secondary" />
              </CListGroupItem>
            </CCard>
          </CCol>

          <CCol md="12">
            <CCard className=" p-3 my-3 rounded-0 border-0">
              <CListGroupItem>
                <CIcon icon={freeSet.cilCommentSquare} size="lg" className="me-2 theme_color" />
                <strong>Comments</strong>
                <hr className="text-secondary" />
              </CListGroupItem>
              <CRow>
                {data?.comments?.length > 0 ? (
                  data.comments.map((comment, index) => (
                    <p key={index}>{comment?.comment || '-'}</p>
                  ))
                ) : (
                  <small className="fst-italic text-center text-secondary">No comment found.</small>
                )}
              </CRow>
            </CCard>
          </CCol>

          <CCol md="12" sm="12">
            <CCard className=" p-3 my-3 rounded-0 border-0">
              <CListGroupItem>
                <CIcon icon={freeSet.cilLineStyle} size="lg" className="me-2 theme_color" />
                <strong>Property Info.</strong>
                <hr className="text-secondary" />
              </CListGroupItem>
              <CRow>
                <CCol className="p-3 mt-0 fw-light theme_color">Name</CCol>
                <CCol className="p-3 mt-0 fw-light theme_color">City</CCol>
              </CRow>
              {data?.properties?.map((property) => (
                <CRow className="" key={property.id}>
                  <CCol className="p-3 mt-0 fw-light theme_color">
                    <CCardText className="fw-normal text-black text-capitalize">
                      {property?.name || '-'}
                    </CCardText>
                  </CCol>
                  <CCol className="p-3 mt-0 fw-light theme_color">
                    <CCardText className="fw-normal  text-black text-capitalize">
                      {property?.property?.city || '-'}
                    </CCardText>
                  </CCol>
                </CRow>
              ))}

              <CRow></CRow>
            </CCard>
          </CCol>
        </CCol>

        <CCol md="9">
          <CCard className="my-3 rounded-0 bg-white border-0 p-3">
            <div>
              <div>
                <h3 className="theme_color p-0 m-0">{data.title}</h3>
                <div className="d-flex justify-content-end">
                  <small className="fst-italic text-secondary">
                    {formatdate(data?.content?.created_at)}
                  </small>
                </div>
              </div>
              <hr className="text-seocndary" />
              <div style={{ minHeight: '60vh' }}>
                <p>{data?.content?.body}</p>
              </div>
            </div>
          </CCard>
        </CCol>
        <CCol md="2"></CCol>
      </Row>
    </>
  )
}
export default NewsShow
