import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'react-bootstrap'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import MaintenanceForm from './MaintenanceForm'

const THEME_COLOR = '#00bfcc'

export default function AddEditMaintenance({ type, id, refreshData, api_endpoint }) {
  const [visible, setVisible] = useState(false)
  const isEdit = type === 'edit'

  function handleClose() {
    setVisible(false)
  }

  function openModal() {
    setVisible(true)
  }

  return (
    <>
      {isEdit ? (
        <button type="button" className="dropdown-item" onClick={openModal}>
          Edit
        </button>
      ) : (
        <button
          type="button"
          className="btn d-flex align-items-center"
          onClick={openModal}
          style={{
            gap: '6px',
            background: THEME_COLOR,
            color: '#fff',
            borderRadius: '10px',
            height: '38px',
            fontWeight: 600,
            border: 'none',
          }}
        >
          <CIcon icon={freeSet.cilPlus} size="sm" />
          Create Request
        </button>
      )}

      <Modal
        show={visible}
        onHide={handleClose}
        centered
        size="xl"
        backdrop="static"
        contentClassName="border-0 overflow-hidden rounded-4"
      >
        <Modal.Header
          closeButton
          closeVariant="white"
          style={{
            background: `linear-gradient(135deg, ${THEME_COLOR} 0%, #0098a3 100%)`,
            border: 'none',
            padding: '20px 24px',
            borderTopLeftRadius: 'inherit',
            borderTopRightRadius: 'inherit',
          }}
        >
          <Modal.Title style={{ color: '#fff' }}>
            <div className="d-flex align-items-center" style={{ gap: '14px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CIcon icon={freeSet.cilTask} size="lg" />
              </div>
              <div className="d-flex flex-column">
                <span style={{ fontSize: '18px', fontWeight: 700, lineHeight: 1.2 }}>
                  {isEdit ? 'Edit Request' : 'Create Request'}
                </span>
                <span style={{ fontSize: '12px', fontWeight: 400, opacity: 0.9 }}>
                  {isEdit
                    ? 'Update maintenance request details'
                    : 'Submit a new maintenance request'}
                </span>
              </div>
            </div>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ padding: '22px' }}>
          <MaintenanceForm
            handleClose={handleClose}
            data_array={[type, id]}
            refreshData={refreshData}
            api_endpoint={api_endpoint}
          />
        </Modal.Body>
      </Modal>
    </>
  )
}

AddEditMaintenance.propTypes = {
  type: PropTypes.string,
  id: PropTypes.number,
  refreshData: PropTypes.func,
  api_endpoint: PropTypes.func,
}
