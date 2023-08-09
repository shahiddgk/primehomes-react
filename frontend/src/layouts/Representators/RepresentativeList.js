import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import { Card, Grid } from '@mui/material'
import { useUserRole } from 'PermissionsProvider'
import axios from 'axios'
import MDBox from 'components/MDBox'
import MDTypography from 'components/MDTypography'
import AccessDeniedMessage from 'layouts/authentication/components/BasicLayout/AccessDenied'
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import AddTaskIcon from '@mui/icons-material/AddTask';
import { DataGrid } from '@mui/x-data-grid';

export default function RepresentativesList() {
  const [people, setPeople] = useState([]);

  const userRole = useUserRole();
  
  const columns = [
    { field: 'id', headerName: 'No', width: 60, align: 'center' },
    { field: 'name', headerName: 'Name', width: 200, align: 'center' },
    { field: 'type', headerName: 'Type', width: 150, align: 'center' },
    { field: 'representativeNames', headerName: 'Representatives Name', flex: 1, align: 'center' },
    { field: 'representativeEmails', headerName: 'Representatives Email', flex: 1, align: 'center' },
  ];

  const fetchData = async () => {
    try {
      const response = await axios.get('people/users/representatives');
      console.log(response.data);
      setPeople(
        response.data.data.map((person, index) => {
          const representativeNames = person.representatives.map(rep => rep.name).join(', ');
          const representativeEmails = person.representatives.map(rep => rep.email).join(', ');

          return {
            id: index + 1,
            name: `${person.firstName} ${person.lastName}`,
            type: person.type, // Adjust this field as needed
            representativeNames,
            representativeEmails,
          };
        })
      );
    } catch (error) {
      console.log('Error fetching people:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {userRole === 'Super admin'? (
      <Grid container spacing={6}>
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
                People Table
              </MDTypography>
            </MDBox>
            <MDBox pt={3}>
              <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                  rows={people}
                  columns={columns}
                  pageSize={10}
                />
              </div>
            </MDBox>
          </Card>
        </Grid>
      </Grid>) : <AccessDeniedMessage /> }
    </DashboardLayout>
  );
}
