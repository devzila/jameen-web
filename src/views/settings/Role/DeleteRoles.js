import React, { useState } from 'react'
import { toast } from 'react-toastify'
import PropTypes from 'prop-types'
import useFetch from 'use-http'
import { Modal, Button } from 'react-bootstrap'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'

export default function DeleteRoles({ roleId, after_submit }) {
  const [visible, setVisible] = useState(false)
  const { delete: deleteReq, response } = useFetch()

  const handle_roles_delete = async () => {
    await deleteReq(`/v1/admin/roles/${roleId}`)
    if (response.ok) {
      toast.success('Role deleted successfully')
      after_submit()
      setVisible(false)
    } else {
      toast.error(response.data?.message || 'Unable to delete role')
    }
  }

  return (
    <>
      <button type="button" className="tooltip_button" onClick={() => setVisible(true)}>
        Delete
      </button>

      <Modal
        show={visible}
        onHide={() => setVisible(false)}
        centered
        backdrop="static"
        contentClassName="border-0 overflow-hidden rounded-4"
      >
        <Modal.Header
          closeButton
          style={{
            border: 'none',
            padding: '24px 24px 0',
          }}
        >
          <div className="d-flex align-items-center w-100" style={{ gap: '14px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: '#fdeaea',
                color: '#e03131',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <CIcon icon={freeSet.cilTrash} size="lg" />
            </div>
            <div>
              <h5 className="mb-1" style={{ fontWeight: 700, color: '#1f2933' }}>
                Delete Role
              </h5>
              <p className="mb-0" style={{ color: '#8a94a6', fontSize: '14px' }}>
                This action cannot be undone. Confirm permanent deletion?
              </p>
            </div>
          </div>
        </Modal.Header>

        <Modal.Body style={{ padding: '16px 24px 24px' }}>
          <div className="d-flex justify-content-end" style={{ gap: '10px' }}>
            <Button
              variant="light"
              onClick={() => setVisible(false)}
              style={{ borderRadius: '8px', fontWeight: 600 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handle_roles_delete}
              style={{
                background: '#e03131',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
              }}
            >
              Delete
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}

DeleteRoles.propTypes = {
  roleId: PropTypes.number,
  after_submit: PropTypes.func,
}
