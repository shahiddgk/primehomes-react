import React, { useState, useEffect } from 'react';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import { Add, Create, Delete, Edit } from '@mui/icons-material';
import { Button, Card, Grid } from '@mui/material';
import { useUserRole } from 'PermissionsProvider';
import axios from 'axios';
import MDBox from 'components/MDBox';
import MDButton from 'components/MDButton';
import MDTypography from 'components/MDTypography';
import DataTable from 'examples/Tables/DataTable';
import AccessDeniedMessage from 'layouts/authentication/components/BasicLayout/AccessDenied';
import { Modal, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import MDInput from 'components/MDInput';

export default function Visitors() {
    const [modal, setModal] = useState({ show: false, forEdit: false });
    const [modalValue, setModalValue] = useState({
        name: '',
        email: '',
        mobile: '',
        image: null,
    });
    const [visitors, setVisitors] = useState([]);
    const [selectedVisitorId, setSelectedVisitorId] = useState(null);

    const userRole = useUserRole();
    const VisitorsColumn = [
        {
            Header: 'No',
            accessor: 'index',
            align: 'center',
            width: '60px',
        },
        {
            Header: 'Name',
            accessor: 'name',
            align: 'center',
            width: '12rem',
        },
        {
            Header: 'Email',
            accessor: 'email',
            align: 'center',
            width: '12rem',
        },
        {
            Header: 'Mobile',
            accessor: 'mobile',
            align: 'center',
            width: '12rem',
        },
        {
            Header: 'Status',
            accessor: 'status',
            align: 'center',
            width: '12rem',
        },
        {
            Header: 'Action',
            accessor: 'action',
            align: 'center',
            width: '80px',
        },
    ];

    const handleEdit = (row) => {
        setModalValue({
            name: row.name,
            email: row.email,
            mobile: row.mobile,
        });

        setSelectedVisitorId(row._id);

        setModal({ show: true, forEdit: true });
    };

    const handleDelete = (row) => {
        Swal.fire({
            title: `Are You Sure To Delete The Visitor?
            <i> ${row.name}</i>`,
            text: 'You will not be able to recover this data!',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            color: 'dark',
            confirmButtonColor: 'maroon',
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                axios.patch(`visitors/visitor/${row._id}`).then(async (response) => {
                    Swal.fire('Deleted!', `${response.data.message}`, 'success');
                    try {
                        const res = await axios.get('visitors/');
                        setVisitors(
                            res.data.data.map((x, index) => {
                                const editBtn = (
                                    <Button size="medium" onClick={() => handleEdit(x)}>
                                        <Edit color="info" />
                                    </Button>
                                );

                                const deleteBtn = (
                                    <Button size="medium" onClick={() => handleDelete(x)}>
                                        {' '}
                                        <Delete color="error" />{' '}
                                    </Button>
                                );

                                return {
                                    ...x,
                                    index: index + 1,
                                    name: x.name,
                                    action: (
                                        <>
                                            {editBtn} {deleteBtn}
                                        </>
                                    ),
                                };
                            })
                        );
                    } catch (error) {
                        console.log('Error fetching visitors:', error);
                    }
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire('Cancelled', 'Your Data Is Safe :)', 'error');
            }
        });
    };

    const fetchData = async () => {
        try {
            const response = await axios.get('visitors/');
            setVisitors(
                response.data.data.map((x, index) => {
                    const editBtn = (
                        <Button size="medium" onClick={() => handleEdit(x)}>
                            <Edit color="info" />
                        </Button>
                    );

                    const deleteBtn = (
                        <Button size="medium" onClick={() => handleDelete(x)}>
                            {' '}
                            <Delete color="error" />{' '}
                        </Button>
                    );

                    return {
                        ...x,
                        index: index + 1,
                        name: x.name,
                        action: (
                            <>
                                {editBtn} {deleteBtn}
                            </>
                        ),
                    };
                })
            );
        } catch (error) {
            console.log('Error fetching visitors:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const createVisitorBtn = () => {
        setModal({ show: true, forEdit: false });
    };

    const handleUpdate = () => {
        const formData = new FormData();
        formData.append('name', modalValue.name);
        formData.append('email', modalValue.email);
        formData.append('mobile', modalValue.mobile);
        formData.append('image', modalValue.image);

        axios
            .patch(`visitors/${selectedVisitorId}`, formData)
            .then((response) => {
                console.log(response.data);
                fetchData();
                setModalValue({
                    name: '',
                    email: '',
                    mobile: '',
                    image: null,
                });
                setModal({ show: false, forEdit: false });
                setSelectedVisitorId(null);
                Swal.fire({
                    title: 'Success!',
                    text: 'Visitor updated successfully.',
                    icon: 'success',
                    confirmButtonColor: 'green',
                });
            })
            .catch((error) => {
                console.error(error);
                Swal.fire({
                    title: 'Error!',
                    text: 'An error occurred while updating the visitor.',
                    icon: 'error',
                    confirmButtonColor: 'red',
                });
            });
    };

    const handleSubmit = () => {
        const formData = new FormData();
        formData.append('name', modalValue.name);
        formData.append('email', modalValue.email);
        formData.append('mobile', modalValue.mobile);
        formData.append('image', modalValue.image);

        axios
            .post(`visitors/`, formData)
            .then((response) => {
                Swal.fire('Created!', `${response.data.message}`, 'success');
                fetchData();
                setModalValue({
                    name: '',
                    email: '',
                    mobile: '',
                    image: null,
                });
                setModal({ show: false, forEdit: false });
            })
            .catch((error) => {
                Swal.fire({
                    title: 'Error!',
                    text: `${error.response.data.message || 'An error occurred while creating the visitor.'}`,
                    icon: 'error',
                    confirmButtonColor: 'red',
                });
                console.error(error);
            });
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            {userRole === 'Owner' || userRole === 'Tenant' ? (
                <Grid container spacing={6}>
                    <Grid item xs={6} md={3}>
                        <MDButton
                            size="medium"
                            variant="contained"
                            color="info"
                            sx={{ maxWidth: '240px', marginTop: '30px' }}
                            onClick={createVisitorBtn}
                        >
                            <Add /> &nbsp;&nbsp; Add Visitor
                        </MDButton>
                    </Grid>
                    <Grid item xs={12} height="80vh">
                        <Card sx={{ my: 4 }}>
                            <MDBox
                                mx={2}
                                mt={-3}
                                py={3}
                                px={2}
                                variant="gradient"
                                bgColor="info"
                                borderRadius="lg"
                                coloredShadow="info"
                            >
                                <MDTypography variant="h6" color="white">
                                    Visitor Table
                                </MDTypography>
                            </MDBox>
                            <MDBox pt={3}>
                                <DataTable
                                    table={{
                                        columns: VisitorsColumn,
                                        rows: visitors,
                                    }}
                                    isSorted
                                    entriAmenity={false}
                                    showTotalEntries
                                    pagination
                                />
                            </MDBox>
                        </Card>
                    </Grid>
                    <Modal
                        size="lg"
                        show={modal.show}
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                        backdrop="static"
                        onHide={() => setModal({ show: false, forEdit: false })}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title id="contained-modal-title-vcenter">
                                {modal.forEdit ? 'Edit Visitor' : 'Create New Visitor'}
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{ backgroundColor: 'ButtonFace' }}>
                            <Form encType="multipart/form-data">
                                <MDInput
                                    focused
                                    variant="filled"
                                    value={modalValue.name}
                                    onChange={(e) =>
                                        setModalValue({ ...modalValue, name: e.target.value })
                                    }
                                    style={{ marginLeft: '2rem', width: '65%', background: 'white' }}
                                    label="Name"
                                    color="dark"
                                />
                                <MDInput
                                    focused
                                    variant="filled"
                                    value={modalValue.email}
                                    onChange={(e) =>
                                        setModalValue({ ...modalValue, email: e.target.value })
                                    }
                                    style={{ marginLeft: '2rem', width: '65%', background: 'white' }}
                                    label="Email"
                                    color="dark"
                                />
                                <MDInput
                                    focused
                                    variant="filled"
                                    value={modalValue.mobile}
                                    onChange={(e) =>
                                        setModalValue({ ...modalValue, mobile: e.target.value })
                                    }
                                    style={{ marginLeft: '2rem', width: '65%', background: 'white' }}
                                    label="Mobile"
                                    color="dark"
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setModalValue({ ...modalValue, image: e.target.files[0] })
                                    }
                                    style={{
                                        marginLeft: '2rem',
                                        width: '65%',
                                        marginTop: '10px',
                                        background: 'transparent',
                                    }}
                                />
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <MDButton
                                size="small"
                                variant="contained"
                                color="info"
                                onClick={modal.forEdit ? handleUpdate : handleSubmit}
                            >
                                <Create /> &nbsp;&nbsp;
                                {modal.forEdit ? 'Update Visitor' : 'Create Visitor'}
                            </MDButton>
                            <Button onClick={() => setModal({ show: false, forEdit: false })}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Grid>
            ) : (
                <AccessDeniedMessage />
            )}
        </DashboardLayout>
    );
}
