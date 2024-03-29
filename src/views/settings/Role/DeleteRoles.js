import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import PropTypes from 'prop-types'
import useFetch from 'use-http'

import { Button } from 'react-bootstrap'
import {
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CModalTitle,
  CContainer,
} from '@coreui/react'

export default function DeleteRoles({ roleId, after_submit }) {
  const [visible, setVisible] = useState(false)
  const { delete: deleteReq, response } = useFetch()

  const handle_roles_delete = async () => {
    const api = await deleteReq(`/v1/admin/roles/${roleId}`)
    if (response.ok) {
      toast('Role Deleted: Operation Successful')
      after_submit()
      setVisible(!visible)
    } else {
      toast(response.data?.message)
    }
  }

  return (
    <div>
      <button
        type="button"
        className="tooltip_button"
        data-mdb-ripple-init
        onClick={() => setVisible(!visible)}
      >
        Delete
      </button>

      <CModal
        alignment="center"
        size="lg"
        visible={visible}
        backdrop="static"
        onClose={() => setVisible(false)}
        aria-labelledby="StaticBackdropExampleLabel"
      >
        <CModalHeader>
          <CModalTitle id="StaticBackdropExampleLabel"> Delete </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CContainer>
            <p>Confirm Permanent Deletion?</p>
            <div className="text-center">
              <CModalFooter>
                <Button
                  data-mdb-ripple-init
                  type="submit"
                  className="btn  btn-primary btn-block"
                  onClick={handle_roles_delete}
                  style={{
                    marginTop: '5px',
                    color: 'white',
                    backgroundColor: 'red',
                    border: '0px',
                  }}
                >
                  Delete
                </Button>
                <CButton
                  color="secondary"
                  style={{ border: '0px', color: 'white' }}
                  onClick={() => setVisible(false)}
                >
                  Cancel
                </CButton>
              </CModalFooter>
            </div>
            <div className="clearfix"></div>
          </CContainer>
        </CModalBody>
      </CModal>
    </div>
  )
}

DeleteRoles.propTypes = {
  roleId: PropTypes.number,
  after_submit: PropTypes.func,
}
