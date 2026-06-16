import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useParams, useNavigate } from 'react-router-dom'
import useFetch from 'use-http'
import { toast } from 'react-toastify'
import Loading from 'src/components/loading/loading'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import { formatdate } from 'src/services/CommonFunctions'

const THEME_COLOR = '#00bfcc'

function statusBadgeStyle(isVoided) {
  const colors = isVoided
    ? { bg: '#fdeaea', color: '#e03131' }
    : { bg: '#e6f9ec', color: '#1a9e54' }
  return {
    background: colors.bg,
    color: colors.color,
    padding: '4px 14px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 600,
    textTransform: 'capitalize',
    display: 'inline-block',
  }
}

const cardStyle = {
  background: '#fff',
  borderRadius: '16px',
  boxShadow: '0 2px 12px rgba(0,0,0,.05)',
  overflow: 'hidden',
}

function SectionTitle({ children }) {
  return (
    <h6
      style={{
        fontWeight: 700,
        color: '#1f2933',
        marginBottom: '16px',
        borderLeft: `3px solid ${THEME_COLOR}`,
        paddingLeft: '10px',
      }}
    >
      {children}
    </h6>
  )
}

SectionTitle.propTypes = {
  children: PropTypes.node,
}

function InfoTile({ label, value, valueColor }) {
  return (
    <div
      style={{
        background: '#f8fafc',
        border: '1px solid #eef1f5',
        borderRadius: '12px',
        padding: '14px 16px',
        height: '100%',
      }}
    >
      <div
        style={{
          color: '#8a94a6',
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          marginBottom: '6px',
        }}
      >
        {label}
      </div>
      <div style={{ fontWeight: 600, color: valueColor || '#1f2933' }}>{value || '-'}</div>
    </div>
  )
}

InfoTile.propTypes = {
  label: PropTypes.node,
  value: PropTypes.node,
  valueColor: PropTypes.string,
}

const tileGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: '14px',
}

const ShowCreditNote = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { get, response } = useFetch()

  const [loading, setLoading] = useState(true)
  const [creditNote, setCreditNote] = useState(null)

  useEffect(() => {
    loadCreditNote()
  }, [])

  async function loadCreditNote() {
    setLoading(true)

    const api = await get(`/v1/admin/credit_notes/${id}`)

    if (response.ok) {
      setCreditNote(api.data || api)
    } else {
      toast.error('Unable To Load Credit Note')
    }

    setLoading(false)
  }

  if (loading) {
    return <Loading />
  }

  if (!creditNote) {
    return null
  }

  const availableAmount = (creditNote.amount || 0) - (creditNote.consumed_amount || 0)
  const createdBy =
    creditNote.created_by?.name || creditNote.user?.name || creditNote.creator?.name || '-'

  return (
    <div style={{ padding: '20px' }}>
      {/* Hero */}
      <div
        style={{
          ...cardStyle,
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div className="d-flex align-items-center" style={{ gap: '16px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: `linear-gradient(135deg, ${THEME_COLOR} 0%, #0098a3 100%)`,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CIcon icon={freeSet.cilNotes} size="xl" />
          </div>
          <div>
            <div className="d-flex align-items-center" style={{ gap: '10px' }}>
              <h4 className="mb-0" style={{ fontWeight: 700, color: '#1f2933' }}>
                Credit Note #{creditNote.credit_note_number || creditNote.id}
              </h4>
              <span style={statusBadgeStyle(creditNote.is_voided)}>
                {creditNote.is_voided ? 'Voided' : 'Active'}
              </span>
            </div>
            <div style={{ color: '#8a94a6', marginTop: '4px' }}>
              ₹ {creditNote.amount || 0} total · ₹ {availableAmount} available
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/finance/credit-notes')}
          className="btn d-flex align-items-center"
          style={{
            gap: '6px',
            background: '#f5f7fb',
            color: '#495057',
            border: 'none',
            borderRadius: '10px',
            height: '40px',
            fontWeight: 600,
          }}
        >
          <CIcon icon={freeSet.cilArrowLeft} size="sm" />
          Back
        </button>
      </div>

      {/* Credit Note Information */}
      <div style={{ ...cardStyle, padding: '24px', marginTop: '16px' }}>
        <SectionTitle>Credit Note Information</SectionTitle>
        <div style={tileGridStyle}>
          <InfoTile label="Credit Note Number" value={creditNote.credit_note_number} />
          <InfoTile label="Amount" value={`₹ ${creditNote.amount || 0}`} valueColor="#1a9e54" />
          <InfoTile
            label="Consumed Amount"
            value={`₹ ${creditNote.consumed_amount || 0}`}
            valueColor="#e8590c"
          />
          <InfoTile
            label="Available Amount"
            value={`₹ ${availableAmount}`}
            valueColor={THEME_COLOR}
          />
          <InfoTile label="Created By" value={createdBy} />
          <InfoTile
            label="Created At"
            value={creditNote.created_at ? formatdate(creditNote.created_at) : '-'}
          />
          <InfoTile
            label="Updated At"
            value={creditNote.updated_at ? formatdate(creditNote.updated_at) : '-'}
          />
        </div>

        <div style={{ marginTop: '14px' }}>
          <InfoTile label="Description" value={creditNote.description} />
        </div>
      </div>

      {/* Contract Information */}
      <div style={{ ...cardStyle, padding: '24px', marginTop: '16px' }}>
        <SectionTitle>Contract Information</SectionTitle>
        <div style={tileGridStyle}>
          <InfoTile label="Contract ID" value={creditNote.contract?.id} />
          <InfoTile label="Unit Number" value={creditNote.contract?.unit?.unit_no} />
          <InfoTile label="Building" value={creditNote.contract?.unit?.building?.name} />
          <InfoTile label="Property" value={creditNote.contract?.unit?.building?.property?.name} />
        </div>
      </div>
    </div>
  )
}

export default ShowCreditNote
