import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import { Button, Card, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Paper, Select, TextField } from '@mui/material';

import { Add, Edit, Delete } from '@mui/icons-material';
import { useUserRole } from 'PermissionsProvider';
import axios from 'axios';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import AccessDeniedMessage from 'layouts/authentication/components/BasicLayout/AccessDenied';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { DataGrid } from '@mui/x-data-grid';
import { Dropdown } from 'react-bootstrap';

export default function VisitorList() {
  const [visitorData, setVisitorData] = useState([]);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [status, setStatus] = useState('');
  const [showPopup, setShowPopup] = useState(false);


  const userRole = useUserRole();

  const handleEdit = (row) => {
    setSelectedVisitor(row);
    setStatus(row.status || ''); 
    setShowPopup(true);
  };


  const handlePopupClose = () => {
    setShowPopup(false);
    setSelectedVisitor(null);
    setStatus('');
  };
  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get('people/users/visitors');

      setVisitorData(
        response.data.data.reduce((acc, user) => {
          const userRow = {
            id: Date.now(),
            name: `${user.firstName} ${user.lastName}`,
            type: user.type,
          };

          user.visitors.forEach((visitor, index) => {
            const visitorRow = {
              id: visitor._id,
              representativeNames: userRow.name,
              representativeType: userRow.type,
              name: visitor.name,
              email: visitor.email,
              mobile: visitor.mobile,
              status: visitor.status 
            };
            acc.push(visitorRow);
          });

          return acc;
        }, [])
      );
    } catch (error) {
      console.log('Error fetching visitors:', error);
    }
  };

  const handleStatusUpdate = async () => {
    if (selectedVisitor && status) {
      try {
        const response = await axios.patch(`visitors/status/${selectedVisitor.id}`, {status});
        console.log(response.data);
        fetchData();
        Swal.fire({
          icon: 'success',
          title: 'Status Updated',
          text: 'Visitor status has been updated successfully!',
        });
      } catch (error) {
        console.error('Error updating status:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while updating visitor status.',
        });
      }

      handlePopupClose();
    }
  };

  const columns = [
    { field: 'representativeNames', headerName: 'Name', flex: 1, align: 'center' },
    { field: 'representativeType', headerName: 'Type', flex: 1, align: 'center' },
    { field: 'name', headerName: 'Visitor Name', width: 200, align: 'center' },
    { field: 'email', headerName: 'Email', width: 200, align: 'center' },
    { field: 'mobile', headerName: 'Mobile', width: 150, align: 'center' },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      align: 'center',
      sortable: false,
      renderCell: (params) => (
          <Button size="medium" onClick={() => handleEdit(params.row)}>
            {' '}
            <Edit color="info" />{' '}
          </Button>
      ),
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {userRole === 'Super admin' ? (
        <Grid container spacing={6}>
          <Grid item xs={12} height="80vh" sx={{ marginTop: '30px' }}>
            <Card style={{ my: '4rem' }}>
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
                <div style={{ height: 400, width: '100%' }}>
                  <DataGrid rows={visitorData} columns={columns} pageSize={10} />
                </div>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <AccessDeniedMessage />
      )}

      <Dialog open={showPopup} onClose={handlePopupClose} aria-labelledby="form-dialog-title" maxWidth="xs" fullWidth>
        <DialogTitle id="form-dialog-title">
          Update Visitor Status
        </DialogTitle>
        <DialogContent>
          <Card>
            <FormControl
              variant="filled"
              style={{
                marginLeft: '2rem',
                width: '90%',
                background: 'transparent',
                marginTop: '10px',
                paddingTop: '30px',
              }}
              color="dark"
            >
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                onChange={handleStatusChange}
                style={{ width: '80%', background:'transparent' }}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="suspended">Suspended</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
              </Select>
            </FormControl>

          </Card>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="white" onClick={handleStatusUpdate}>
            Update
          </Button>
          <Button variant="contained" color="white" onClick={handlePopupClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}
