import React, { useState, useEffect } from "react";
import { Button, Modal, Row, Col, Form, InputGroup, FloatingLabel } from 'react-bootstrap';
import axios from 'axios'

import Swal from 'sweetalert2'

function ViewDetailModal({ show, setShow, getHouses, id, houses }) {
    const handleClose = () => {
        //clear form
        setName(""); setDesc(""); setPrice(""); setPostCode("");
        setShow(false);
    }

    const [validated, setValidated] = useState(false);

    //form
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [price, setPrice] = useState("");
    const [postCode, setPostCode] = useState("");

    function setDetail() {
        if (houses) {
            let find = houses.find(item => item.id == id)
            setName(find?.name)
            setDesc(find?.desc)
            setPrice(find?.price)
            setPostCode(find?.post_code)
        }
    }

    useEffect(() => {
        setDetail();
    }, [id])

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {

            setValidated(true);
            event.preventDefault();
            axios.patch(`https://test-backend.baania.dev/home/${id}`, { name, desc, price, post_code: postCode })
                .then(async () => {
                    handleClose();
                    await getHouses();
                    Swal.fire(
                        'Success',
                        'Update successful!',
                        'success'
                    )
                })
                .catch(err => {
                    alert(err)
                })
        }
        setValidated(true);
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Item Detail - {id}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Row className="mb-3">
                        <Form.Group as={Col} md="4" controlId="validationCustom01">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="Name"
                                value={name || ""}
                                onChange={e => setName(e.target.value)}
                            />
                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} md="4" controlId="validationCustom02">
                            <Form.Label>Postcode</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="Postcode"
                                value={postCode || ""}
                                onChange={e => setPostCode(e.target.value)}
                            />
                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} md="4" controlId="validationCustomUsername">
                            <Form.Label>Price</Form.Label>
                            <InputGroup hasValidation>
                                <Form.Control
                                    type="text"
                                    placeholder="Price"
                                    required
                                    value={price || ""}
                                    onChange={e => setPrice(e.target.value)}
                                />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group as={Col} md="" controlId="validationCustom03">
                            <FloatingLabel controlId="floatingTextarea2" label="Description">
                                <Form.Control
                                    as="textarea"
                                    placeholder="Description here"
                                    style={{ height: '100px' }}
                                    required
                                    value={desc || ""}
                                    onChange={e => setDesc(e.target.value)}
                                />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            </FloatingLabel>

                        </Form.Group>
                    </Row>
                    <div style={{ display: 'flex', justifyContent: "center" }}>
                        <Button className="m-1" variant="" onClick={handleClose}>CANCEL</Button>
                        <Button className="m-1" type="submit" variant="warning">UPDATE</Button>
                    </div>

                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default ViewDetailModal