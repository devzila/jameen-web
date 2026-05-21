import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import useFetch from 'use-http'
import { toast } from 'react-toastify'

export default function InvoiceChequePaymentForm({ invoiceId, onSuccess }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { payment_type: 'cheque' },
  })
  const { post, response, loading } = useFetch()
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(data) {
    setSubmitting(true)
    await post(`/v1/admin/invoices/${invoiceId}/paymants`, {
      payment: {
        amount: data.amount,
        cheque_number: data.cheque_number,
        transaction_notes: data.transaction_notes,
        payment_type: data.payment_type,
      },
    })

    if (response.ok) {
      onSuccess?.()
    } else {
      toast.error(response.data?.message || 'Unable to record payment.')
    }
    setSubmitting(false)
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="cheque-payment-form">
      <input type="hidden" {...register('payment_type')} value="cheque" />

      <Form.Group className="mb-2">
        <Form.Label className="small mb-1">
          Amount <span className="text-danger">*</span>
        </Form.Label>
        <Form.Control
          size="sm"
          type="number"
          step="any"
          min="0"
          placeholder="Amount"
          isInvalid={!!errors.amount}
          {...register('amount', { required: 'Amount is required' })}
        />
        <Form.Control.Feedback type="invalid">{errors.amount?.message}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label className="small mb-1">
          Cheque number <span className="text-danger">*</span>
        </Form.Label>
        <Form.Control
          size="sm"
          type="text"
          placeholder="Cheque number"
          isInvalid={!!errors.cheque_number}
          {...register('cheque_number', { required: 'Cheque number is required' })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.cheque_number?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label className="small mb-1">
          Transaction notes <span className="text-danger">*</span>
        </Form.Label>
        <Form.Control
          size="sm"
          as="textarea"
          rows={2}
          placeholder="Transaction notes"
          isInvalid={!!errors.transaction_notes}
          {...register('transaction_notes', { required: 'Transaction notes are required' })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.transaction_notes?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Button
        type="submit"
        size="sm"
        className="btn custom_theme_button w-100"
        disabled={submitting || loading}
      >
        Record payment
      </Button>
    </Form>
  )
}

InvoiceChequePaymentForm.propTypes = {
  invoiceId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  onSuccess: PropTypes.func,
}
