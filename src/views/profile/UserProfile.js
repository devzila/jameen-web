import React, { useContext, useRef, useState } from 'react'
import { CAvatar, CButton, CCard, CCardBody, CCol, CRow, CSpinner } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil } from '@coreui/icons'
import { toast } from 'react-toastify'
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
  const fileInputRef = useRef(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const { state, dispatch } = useContext(AuthContext)
  const user = state.user

  const displayName =
    user?.name || [user?.first_name, user?.last_name].filter(Boolean).join(' ').trim() || '—'

  const openAvatarPicker = () => {
    if (!uploadingAvatar) {
      fileInputRef.current?.click()
    }
  }

  const handleAvatarFileChange = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    const formData = new FormData()
    formData.append('me[avatar]', file)

    setUploadingAvatar(true)
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/v1/admin/me`, {
        method: 'PUT',
        headers: {
          Authorization: localStorage.getItem('token'),
          'company-slug': window.location.hostname.split('.')[0],
        },
        body: formData,
      })

      const result = await response.json().catch(() => ({}))

      if (response.ok) {
        const updatedUser = result.data ?? result.object ?? result
        dispatch({ type: 'UPDATE_USER', payload: updatedUser })
        toast.success('Avatar updated successfully')
      } else {
        toast.error(result.message || 'Failed to update avatar')
      }
    } catch {
      toast.error('Failed to update avatar')
    } finally {
      setUploadingAvatar(false)
    }
  }

  return (
    <div className="container-fluid py-4">
      <CRow className="justify-content-center">
        <CCol lg={8} xl={6}>
          <CCard className="border-0 shadow-sm">
            <CCardBody className="p-4">
              <CRow className="align-items-start g-4">
                <CCol xs="auto">
                  <div className="position-relative d-inline-block">
                    <CAvatar
                      src={resolveUserAvatarSrc(user)}
                      size="xl"
                      className="rounded-circle border"
                    />
                    {uploadingAvatar ? (
                      <div
                        className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center rounded-circle bg-dark bg-opacity-50"
                        style={{ pointerEvents: 'none' }}
                      >
                        <CSpinner size="sm" color="light" />
                      </div>
                    ) : null}
                    <button
                      type="button"
                      className="position-absolute bottom-0 end-0 border-0 rounded-circle bg-primary text-white d-flex align-items-center justify-content-center shadow-sm"
                      style={{ width: 32, height: 32 }}
                      onClick={openAvatarPicker}
                      disabled={uploadingAvatar}
                      aria-label="Edit avatar"
                    >
                      <CIcon icon={cilPencil} size="sm" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      className="d-none"
                      onChange={handleAvatarFileChange}
                    />
                  </div>
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

              <div>
                <h2 className="h6 text-secondary mb-3">Assigned properties</h2>
                {Array.isArray(user?.properties) && user.properties.length > 0 ? (
                  <ul className="list-unstyled mb-0">
                    {user.properties.map((p) => (
                      <li key={p.id} className="mb-1">
                        {p.name || '—'}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted mb-0">—</p>
                )}
              </div>

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
