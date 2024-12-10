import { freeSet } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CCard, CRow, CCol, CListGroupItem } from '@coreui/react'
import React from 'react'
import PropTypes from 'prop-types'

import { formatdate, formatNumberCount } from 'src/services/CommonFunctions'

export default function ShowLeftBar({ data }) {
  return (
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
          <small className="fst-italic text-center text-secondary p-2 ">No Tags found.</small>
        </CCard>
      </CCol>
      <CCol md="12" sm="12">
        <CCard className=" p-3 my-3 rounded-0 border-0">
          <CListGroupItem>
            <CIcon icon={freeSet.cilLineStyle} size="lg" className="me-2 theme_color" />
            <strong>Properties Tagged</strong>
            <hr className="text-secondary" />
          </CListGroupItem>

          {data?.properties?.map((property) => (
            <button
              key={property.id}
              className="request-gray mt-1 w-100 fw-normal text-black text-capitalize"
              title={property?.name}
            >
              <CIcon icon={freeSet.cilBuilding} className="mx-2 text-secondary" />
              {property?.name?.slice(0, 50) || '-'}
            </button>
          ))}

          <CRow></CRow>
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
              data.comments.map((comment, index) => <p key={index}>{comment?.comment || '-'}</p>)
            ) : (
              <small className="fst-italic text-center text-secondary p-5 m-4">
                No comment found.
              </small>
            )}
          </CRow>
        </CCard>
      </CCol>
    </CCol>
  )
}
ShowLeftBar.propTypes = {
  data: PropTypes.object,
}
