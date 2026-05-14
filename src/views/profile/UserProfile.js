import React, { useContext } from 'react'
import { CAvatar, CButton, CCard, CCardBody, CCol, CRow } from '@coreui/react'
import { AuthContext } from 'src/contexts/AuthContext'
import defaultAvatar from 'src/assets/images/avatars/default.png'

function resolveUserAvatarSrc(user) {
  if (!user) return defaultAvatar
  const fromUrl =
    typeof user.avatar_url === 'string' && user.avatar_url.trim() !== ''
      ? user.avatar_url.trim()
      : null
  if (fromUrl) return fromUrl
  if (user.avatar?.path) return user.avatar.path
  return defaultAvatar
}

const UserProfile = () => {
  const { state } = useContext(AuthContext)
  const user = state.user

  const displayName =
    user?.name || [user?.first_name, user?.last_name].filter(Boolean).join(' ').trim() || '—'

  return (
    <div className="container-fluid py-4">
      <CRow className="justify-content-center">
        <CCol lg={8} xl={6}>
          <CCard className="border-0 shadow-sm">
            <CCardBody className="p-4">
              <CRow className="align-items-start g-4">
                <CCol xs="auto">
                  <CAvatar
                    src={resolveUserAvatarSrc(user)}
                    size="xl"
                    className="rounded-circle border"
                  />
                </CCol>
                <CCol>
                  <dl className="row mb-0">
                    <dt className="col-sm-3 text-secondary">Name</dt>
                    <dd className="col-sm-9">{displayName}</dd>

                    <dt className="col-sm-3 text-secondary">Email</dt>
                    <dd className="col-sm-9">{user?.email || '—'}</dd>

                    <dt className="col-sm-3 text-secondary">Mobile</dt>
                    <dd className="col-sm-9">{user?.mobile_number || '—'}</dd>

                    <dt className="col-sm-3 text-secondary">Role</dt>
                    <dd className="col-sm-9">{user?.role?.name || '—'}</dd>

                    <dt className="col-sm-3 text-secondary">Account</dt>
                    <dd className="col-sm-9">{user?.active === false ? 'Inactive' : 'Active'}</dd>
                  </dl>
                </CCol>
              </CRow>

              <hr className="border-secondary opacity-25 my-4" />

              <CRow className="align-items-center g-3">
                <CCol xs={12} md>
                  <p className="text-muted mb-0">Password reset link will be sent on your email.</p>
                </CCol>
                <CCol xs={12} md="auto" className="text-md-end">
                  <CButton type="button" color="primary">
                    Reset Password
                  </CButton>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}

export default UserProfile
