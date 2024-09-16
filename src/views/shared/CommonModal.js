import React from 'react'
import PropTypes from 'prop-types'

import { CModal, CModalHeader, CModalBody } from '@coreui/react'

export default function CommonModal({ component, data, body, visible, handleClose }) {
  return (
    <div>
      {component}
      <CModal
        alignment="center"
        visible={visible}
        size={data.size}
        backdrop="static"
        onClose={handleClose}
        aria-labelledby="StaticBackdropExampleLabel"
      >
        <CModalHeader>
          <div className="px-3 d-flex justify-content-between w-100">
            <div className=" d-flex text-secondary">
              <h4>{data.header}</h4>
            </div>
            <div className="theme_color">
              <p>{''}</p>
            </div>
          </div>
        </CModalHeader>
        <CModalBody className="p-0">
          <div>{body}</div>
        </CModalBody>
      </CModal>
    </div>
  )
}

CommonModal.propTypes = {
  component: PropTypes.element,
  body: PropTypes.element,
  data: PropTypes.object,
  visible: PropTypes.bool,
  handleClose: PropTypes.func,
}
