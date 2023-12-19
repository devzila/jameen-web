import { useEffect, useState } from 'react';
import { Container, Row, Button, Col, Card, Table } from 'react-bootstrap'
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';

function userModal() {
  const [show, setShow] = useState(false);
  const [userdata,setUserdata]=useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile_number, setMobile_number] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(()=>{
    addUser()
  },)

 const addUser = async (e) => {
    // e.preventDefault();
    const endpoint = `/v1/admin/users/`

    try {
      const response = await axios.post(endpoint, {
        userdata
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Button variant="primary" onClick={handleShow}> Add User</Button>

      <Modal 
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter" >Enter User Details </Modal.Title>
        </Modal.Header>

        <Modal.Body>
        <Container>
          <Form>
            <Row>
              <Col>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={name}
                        placeholder="Name"
                        onChange={(e) => setName(e.target.value)}

                        autoFocus
                        />
                    </Form.Group>
                </Col>
              <Col>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                      <Form.Label>Email address</Form.Label>
                      <Form.Control
                        type="email"
                        value={email}
                        placeholder="name@example.com"
                        onChange={(e) => setEmail(e.target.value)}
                        autoFocus
                      />
                    </Form.Group>
            </Col>
            </Row>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Mobile Number</Form.Label>
              <Form.Control
                type="text"
                vlaue={mobile_number}
                placeholder="0123 456 789"
                onChange={(e) => setMobile_number(e.target.value)}
                autoFocus
              />
            </Form.Group>
          </Form>

         </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  );
}

export default userModal;