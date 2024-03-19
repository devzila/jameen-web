import { Row, Col, Form } from 'react-bootstrap'
import React from 'react'
import { PropTypes } from 'prop-types'

const propTypes = {
  register: PropTypes.func,
}

export const PaymentField = (type, register) => {
  console.log(type)
  switch (type) {
    case 'cash':
      return <Cash register={register} />
    case 'cheque':
      return <Cheque register={register} />
    case 'card':
      return <Card register={register} />
    default:
      return null
  }
}

const Cash = ({ register }) => (
  <Row>
    <Col className="pr-1 mt-3" md="12">
      <Form.Group>
        <Form.Control type="text" value="cash" {...register('payment_type')} hidden></Form.Control>
      </Form.Group>
    </Col>
    <Col>
      <Form.Group>
        <label>Reference No. </label>
        <Form.Control
          required
          placeholder="- - - - - - - - -"
          type="text"
          {...register('cash_transactions_attributes[0].transaction_reference_number')}
        ></Form.Control>
      </Form.Group>
    </Col>
    <Col>
      <Form.Group>
        <label>Voucher No. </label>
        <Form.Control
          required
          placeholder="- - - - - - - - -"
          type="text"
          {...register('cash_transactions_attributes[0].voucher_number')}
        ></Form.Control>
      </Form.Group>
    </Col>
  </Row>
)

const Card = ({ register }) => (
  <Row>
    <Col className="pr-1 mt-3" md="12">
      <Form.Group>
        <Form.Control type="text" value="card" {...register('payment_type')} hidden></Form.Control>
      </Form.Group>
    </Col>
    <Col>
      <Form.Group>
        <label>Reference No. </label>
        <Form.Control
          required
          placeholder="- - - - - - - - -"
          type="text"
          {...register('card_transactions_attributes[0].transaction_reference_number')}
        ></Form.Control>
      </Form.Group>
    </Col>
    <Col>
      <Form.Group>
        <label>Card No. </label>
        <Form.Control
          required
          placeholder="- - - - - - - - -"
          type="text"
          {...register('card_transactions_attributes[0].voucher_number')}
        ></Form.Control>
      </Form.Group>
    </Col>
  </Row>
)

const Cheque = ({ register }) => (
  <Row>
    <Col className="pr-1 mt-3" md="12">
      <Form.Group>
        <Form.Control
          type="text"
          value="cheque"
          {...register('payment_type')}
          hidden
        ></Form.Control>
      </Form.Group>
    </Col>
    <Col>
      <Form.Group>
        <label>Reference No. </label>
        <Form.Control
          required
          placeholder="- - - - - - - - -"
          type="text"
          {...register('cheque_transactions_attributes[0].transaction_reference_number')}
        ></Form.Control>
      </Form.Group>
    </Col>
    <Col>
      <Form.Group>
        <label>Cheque No. </label>
        <Form.Control
          required
          placeholder="- - - - - - - - -"
          type="text"
          {...register('cheque_transactions_attributes[0].cheque_number')}
        ></Form.Control>
      </Form.Group>
    </Col>
  </Row>
)

Cash.propTypes = propTypes
Card.propTypes = propTypes
Cheque.propTypes = propTypes
