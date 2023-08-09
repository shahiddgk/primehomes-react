import { Add, Create, Delete, Edit } from '@mui/icons-material';
import { Button, Card, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, Grid, InputLabel, MenuItem, Paper, Select, TextField } from '@mui/material';
import axios from 'axios';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import DataTable from 'examples/Tables/DataTable';
import React, { useEffect, useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import Swal from 'sweetalert2';


export default function Announcement() {


  const AnnouncementColumn = [
    {
      Header: 'No',
      accessor: 'index',
      align: 'center',
      width: '60px',
    },
    {
      Header: 'Title',
      accessor: 'title',
      align: 'center',
      width: '12rem'
    },
    {
      Header: 'Description',
      accessor: 'description',
      align: 'center',
      width: '12rem'
    },
    {
      Header: 'Event Type',
      accessor: 'announcementType',
      align: 'center',
      width: '12rem'
    },
    {
      Header: 'Action',
      accessor: 'action',
      align: 'center',
      width: '80px'
    }
  ]

  const [modal, setModal] = useState({ show: false, forEdit: false });
  const [modalValue, setModalValue] = useState({
    title: '',
    description: '',
    announcementType: '',
    image: null,
  });
  const [selectedRadio, setSelectedRadio] = useState('all');
  const [roles, setRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);

  const [announcement, setAnnouncement] = useState([]);
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState(null);


  const handleRoleChange = (event) => {
    const { value } = event.target;

    setSelectedRoles((prevSelectedRoles) => {
      if (prevSelectedRoles.includes(value)) {
        return prevSelectedRoles.filter((role) => role !== value);
      } else {
        return [...prevSelectedRoles, value];
      }
    });
  };

  const handleRadioChange = (event) => {
    setSelectedRadio(event.target.value);
  };


  const handleEdit = (row) => {
    // Populate the modal form fields with the data of the selected announcement
    setModalValue({
      title: row.title,
      description: row.description,
      announcementType: row.announcementType,
      image: null, // Since we don't want to display the existing image, set it to null
    });

    // Set the selected announcement ID for updating
    setSelectedAnnouncementId(row._id);

    // Open the modal for editing
    setModal({ show: true, forEdit: true });
  };

  const handleDelete = (row) => {
    Swal.fire({
      title: `Are You Sure To Delete The Announcement?
          <i> ${row.title}</i>`,
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
        axios.delete(`announcements/${row._id}`)
          .then(async (response) => {
            console.log(response.data.data);
            Swal.fire('Deleted!', `${response.data.message}`, 'success');
            const res = await axios.get('announcements/');
            console.log(res.data.data);
            setAnnouncement(res.data.data.map((x, index) => {
              const editBtn = (
                <Button size="medium" onClick={() => handleEdit(x)}>
                  <Edit color="info" />
                </Button>
              );
              const deleteBtn = (
                <Button size="medium" onClick={() => handleDelete(x)}>
                  <Delete color="error" />
                </Button>
              );
              return {
                ...x,
                index: index + 1,
                name: x.title,
                action: (
                  <>
                    {editBtn} {deleteBtn}
                  </>
                ),
              };

            }));
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Your Data Is Safe :)', 'error');
      }
    });
  };

  const fetchData = async () => {
    try {
      const response = await axios.get('announcements/');
      console.log(response.data.data);
      setAnnouncement(response.data.data.map((x, index) => {
        const editBtn = (
          <Button size="medium" onClick={() => handleEdit(x)}>
            <Edit color="info" />
          </Button>
        );
        const deleteBtn = (
          <Button size="medium" onClick={() => handleDelete(x)}>
            <Delete color="error" />
          </Button>
        );
        return {
          ...x,
          index: index + 1,
          name: x.title,
          image: x.imageUrl,
          action: (
            <>
              {editBtn} {deleteBtn}
            </>
          ),
        };
      }));
    } catch (error) {
      console.log('Error fetching announcements:', error);
    }
  };

  const fetchRolesData = async () => {
    try {
      const response = await axios.get('/roles/role');
      setRoles(response.data.data);
    } catch (error) {
      console.log('Error fetching roles:', error);
    }
  };

  const handleClose = () => {
    setModal({ show: false, forEdit: false });
  };


  useEffect(() => {
    fetchData();
    fetchRolesData()


 
  }, []);

  const handleUpdate = () => {
    const formData = new FormData();
    formData.append('title', modalValue.title);
    formData.append('description', modalValue.description);
    formData.append('announcementType', modalValue.announcementType);
    formData.append('image', modalValue.image);

    // Make the API PUT request to update the announcement
    axios.patch(`announcements/${selectedAnnouncementId}`, formData)
      .then((response) => {
        console.log(response.data);
        fetchData();
        setModalValue({
          title: '',
          description: '',
          announcementType: '',
          image: null,
        });
        setModal({ show: false, forEdit: false });
        setSelectedAnnouncementId(null);
        Swal.fire('Updated!', `${response.data.message}`, 'success');
      })
      .catch((error) => {
        console.error(error);
        Swal.fire('Error', 'Unable to update the announcement, please try again later.', 'error');
      });
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append('title', modalValue.title);
    formData.append('description', modalValue.description);
    formData.append('announcementType', modalValue.announcementType);
     formData.append('image', modalValue.image);

    if (selectedRadio === 'all') {
    
      formData.append('audience', selectedRadio)
    } else if (selectedRadio === 'custom') {
      formData.append('audience', JSON.stringify(selectedRoles))
  
    }
    
    axios.post('announcements/', formData)
      .then((response) => {
        console.log(response.data);
        fetchData();
        setModalValue({
          title: '',
          description: '',
          announcementType: '',
          image: null,
        });
        setModal({ show: false, forEdit: false });
        setSelectedRadio('all'); // Reset radio button selection after submitting
        setSelectedRoles([]); // Reset selected roles after submitting
        Swal.fire('Created!', `${response.data.message}`, 'success');
      })
      .catch((error) => {
        console.error(error);
        Swal.fire('Error', 'Unable to create the announcement, please try again later.', 'error');
      });
  };
  
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Grid container spacing={6}>
        <Grid item xs={6} md={3}>
          <Button
            size="medium"
            variant="contained"
            color="info"
            sx={{ maxWidth: '240px', marginTop: '30px' }}
            onClick={() => setModal({ show: true, forEdit: false })}
          >
            <Add /> &nbsp;&nbsp; Add Announcement
          </Button>
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
                Announcement List
              </MDTypography>
            </MDBox>
            <MDBox pt={3}>

              <DataTable
                table={{ columns: AnnouncementColumn, rows: announcement }}
                isSorted
                entriAmenity={false}
                showTotalEntries
                pagination
              />
            </MDBox>
          </Card>
        </Grid>
      </Grid>
      <Dialog open={modal.show} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          {modal.forEdit ? 'Updating Announcement' : 'Creating New Announcement'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill out the details for the announcement.
          </DialogContentText>
          <form encType="multipart/form-data">
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              label="Title"
              name="title"
              value={modalValue.title}
              onChange={(e) => setModalValue({ ...modalValue, title: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              label="Description"
              multiline
              rows={3}
              name="description"
              value={modalValue.description}
              onChange={(e) => setModalValue({ ...modalValue, description: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              label="Announcement Type"
              name="announcementType"
              value={modalValue.announcementType}
              onChange={(e) => setModalValue({ ...modalValue, announcementType: e.target.value })}
              margin="normal"
            />
            <div>
              <br />
              <Paper elevation={3}>
                <InputLabel htmlFor="contained-button-file">
                  <Button
                    size='small'
                    variant="contained"
                    component="span"
                    color="white"
                  >
                    Upload Relevant Image
                  </Button>
                </InputLabel>
                <input
                  accept="image/*"
                  id="contained-button-file"
                  type="file"
                  name="image"
                  onChange={(e) => setModalValue({ ...modalValue, image: e.target.files[0] })}
                  style={{ display: 'none' }}
                />
              </Paper>
              <Row className='mt-4'>
                <Col>
                  <Form.Check
                    type='radio'
                    id='all'
                    name='audience'
                    label='All'
                    value='all'
                    checked={selectedRadio === 'all'}
                    onChange={handleRadioChange}
                  />
                </Col>
                <Col>
                  <Form.Check
                    type='radio'
                    name='audience'
                    id='custom'
                    label='Custom'
                    value='custom'
                    checked={selectedRadio === 'custom'}
                    onChange={handleRadioChange}
                  />
                </Col>
              </Row>
              {selectedRadio === 'custom' && (
                <Row className='mt-3'>
                  {roles.map((role) => (
                    <Col>
                      <FormControlLabel
                        key={role._id}
                        control={
                          <Checkbox
                            checked={selectedRoles.includes(role.name)}
                            onChange={handleRoleChange}
                            value={role.name}
                          />
                        }
                        label={role.name}
                      />
                    </Col>
                  ))}
                </Row>
              )}
            </div>
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            size="small"
            variant="contained"
            color="info"
            onClick={modal.forEdit ? handleUpdate : handleSubmit}
          >
            <Create /> &nbsp;&nbsp; {modal.forEdit ? 'Update Announcement' : 'Create Announcement'}
          </Button>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

