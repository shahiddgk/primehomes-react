import { Add, Create, Delete, Edit } from '@mui/icons-material'
import { Button, Card, FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material'
import { usePermissions } from 'PermissionsProvider'
import axios from 'axios'
import MDBox from 'components/MDBox'
import MDButton from 'components/MDButton'
import MDInput from 'components/MDInput'
import MDTypography from 'components/MDTypography'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import DataTable from 'examples/Tables/DataTable'
import AccessDeniedMessage from 'layouts/authentication/components/BasicLayout/AccessDenied'
import React, { useEffect, useState } from 'react'
import { Form, Modal } from 'react-bootstrap'
import Swal from 'sweetalert2'



export default function Amenity() {
  const [modal, setModal] = useState({ show: false, forEdit: false })
  const [modalValue, setModalValue] = useState({
    name: '',
    dues: '',
    charges: '',
  });
  const [amenity, setAmenity] = useState([]);
  const [selectedAmenityId, setSelectedAmenityId] = useState(null);
  const userPermissions = usePermissions()

  const canEdit = userPermissions.includes('edit-amenities');
  const canDelete = userPermissions.includes('delete-amenities');

  const PeopleColumn = [
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
      width: '12rem'
    },
    {
      Header: 'Dues',
      accessor: 'dues',
      align: 'center',
      width: '12rem'
    },
    {
      Header: 'Charges',
      accessor: 'charges',
      align: 'center',
      width: '12rem'
    },
    ...(canEdit || canDelete) ?
      [
        {
          Header: 'Action',
          accessor: 'action',
          align: 'center',
          width: '80px'
        },
      ] : []
  ]

  const handleEdit = (row) => {
    console.log('checking row', row);
    // Populate the modal form fields with the data of the selected amenity
    setModalValue({
      name: row.name,
      dues: row.dues,
      charges: row.charges,
    });
    console.log(row._id);
    // Set the selected amenity ID for updating
    setSelectedAmenityId(row._id);

    // Open the modal for editing
    setModal({ show: true, forEdit: true });
  };
  const handleDelete = (row) => {
    Swal.fire({
      title: `Are You Sure To Delete The User?
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
        axios.delete(`amenities/${row._id}`)
          .then(async (response) => {
            console.log(response.data.data);
            Swal.fire('Deleted!', `${response.data.message}`, 'success');
            try {
              const res = await axios.get('amenities/');
              setAmenity(res.data.data.map((x, index) => {
                const editBtn = canEdit ? (
                  <Button size="medium" onClick={() => handleEdit(x)}>
                    <Edit color="info" />
                  </Button>
                ) : null;
                const deleteBtn = canDelete ? <Button size="medium" onClick={() => handleDelete(x)}> <Delete color="error" /> </Button> : null;
                return {
                  ...x,
                  index: index + 1,
                  name: x.name,
                  action: <>{editBtn} {deleteBtn}</>
                };
              }));
            } catch (error) {
              console.log('Error fetching roles:', error);
            }
          })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Your Data Is Safe :)', 'error');
      }
    })
  };



  const fetchData = async () => {
    try {
      const response = await axios.get('amenities/');
      console.log(response.data.data);
      setAmenity(response.data.data.map((x, index) => {
        const editBtn = canEdit ? (
          <Button size="medium" onClick={() => handleEdit(x)}>
            <Edit color="info" />
          </Button>
        ) : null;
        const deleteBtn = canDelete ? <Button size="medium" onClick={() => handleDelete(x)}> <Delete color="error" /> </Button> : null;
        return {
          ...x,
          index: index + 1,
          name: x.name,
          action: <>{editBtn} {deleteBtn}</>
        };
      }));
    } catch (error) {
      console.log('Error fetching roles:', error);
    }
  };
  const handleUpdate = () => {
    const formData = {
      name: modalValue.name,
      dues: modalValue.dues,
      charges: modalValue.charges,
    };
    console.log('form', formData);

    // Make the API PUT request to update the amenity
    axios.patch(`amenities/${selectedAmenityId}`, formData)
      .then((response) => {
        console.log(response.data);
        fetchData();
        setModalValue({
          name: '',
          dues: '',
          charges: '',
        });
        setModal({ show: false, forEdit: false });
        setSelectedAmenityId(null);
      })
      .catch((error) => {
        console.error(error);
      });
  };




  useEffect(() => {
    fetchData();
  }, []);


  const createAmenityBtn = () => {
    setModal({ show: true, forEdit: false })
  }

  const handleSubmit = () => {
    const formData = {
      name: modalValue.name,
      dues: modalValue.dues,
      charges: modalValue.charges,
    };
    console.log('form', formData);
    axios.post('amenities/', formData
    )
      .then((response) => {
        Swal.fire('Created!', `${response.data.message}`, 'success');
        console.log(response.data);
        fetchData();
        setModalValue({
          name: '',
          dues: '',
          charges: '',
        });
        setModal({ show: false, forEdit: false });
      })
      .catch((error) => {
        console.error(error);
      });
  };



  return (
    <DashboardLayout>
      <DashboardNavbar />
      {userPermissions.includes('list-amenities') ?
        <Grid container spacing={6}>
          {userPermissions.includes('create-amenities') ?
            <Grid item xs={6} md={3}>
              <MDButton
                size='medium'
                variant="contained"
                color='info'
                sx={{ maxWidth: '240px', marginTop: '30px' }}
                onClick={createAmenityBtn}
              >
                <Add /> &nbsp;&nbsp; Add Amenities
              </MDButton>
            </Grid>
            : null}

          <Grid item xs={12} height='80vh'>
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
                  Amenity Table
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>

                <DataTable
                  table={{ columns: PeopleColumn, rows: amenity }}
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
            backdrop='static'
            onHide={() => { setModal({ show: false, forEdit: false }) }}
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Creating New Amenity
              </Modal.Title>
            </Modal.Header>

            <Modal.Body style={{ backgroundColor: 'ButtonFace' }}>
              <Form>

                <MDInput focused variant="filled" value={modalValue.name} onChange={e => setModalValue({ ...modalValue, name: e.target.value })} style={{ marginLeft: '2rem', width: '65%', background: 'white' }} label="Name" color="dark" />
                <MDInput focused variant="filled" type="number" value={modalValue.dues} onChange={e => setModalValue({ ...modalValue, dues: e.target.value })} style={{ marginLeft: '2rem', width: '65%', background: 'white' }} label="Amenity Dues" color="dark" placeholder="Put 0 for free" sx={{
                  '&::placeholder': {
                    fontSize: '10px', // Adjust the font size as per your requirement
                  },
                }} /><br />
                <FormControl variant="filled" style={{ marginLeft: '2rem', width: '65%', background: 'transparent', marginTop: '10px', paddingTop: '30px' }} color="dark">
                  <InputLabel htmlFor="select-option">Charges</InputLabel>
                  <Select
                    id="select-option"
                    value={modalValue.charges}
                    onChange={e => setModalValue({ ...modalValue, charges: e.target.value })}
                    style={{ background: 'transparent' }}
                    focused variant="filled"
                  >
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="yearly">Yearly</MenuItem>
                  </Select>
                </FormControl>


              </Form>
            </Modal.Body>
            <Modal.Footer>
              <MDButton
                size='small'
                variant="contained"
                color='info'
                onClick={modal.forEdit ? handleUpdate : handleSubmit}
              >
                <Create /> &nbsp;&nbsp; {modal.forEdit ? 'Update Amenity' : 'Create Amenity'}
              </MDButton>
              <Button onClick={() => { setModal({ show: false, forEdit: false }) }}>Close</Button>
            </Modal.Footer>

          </Modal>


        </Grid>: <AccessDeniedMessage />}

  </DashboardLayout>


  )
}

