import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import { Button, Card, Grid } from '@mui/material'
import {  useUserRole } from 'PermissionsProvider'
import axios from 'axios'
import MDBox from 'components/MDBox'
import MDTypography from 'components/MDTypography'
import DataTable from 'examples/Tables/DataTable'
import AccessDeniedMessage from 'layouts/authentication/components/BasicLayout/AccessDenied'
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import AddTaskIcon from '@mui/icons-material/AddTask';


export default function OccupantRequests() {

  const [occupants, setOccupants] = useState([]);

  const userRole = useUserRole(); 
  const OccupantsColumn = [
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
        Header: 'Action',
        accessor: 'action',
        align: 'center',
        width: '80px',
      },     
  ];

  const handleEdit = (row) => {
    axios
    .patch(`occupants/request/${row._id}`)
    .then(async (response) => {
      console.log(response.data);
        // Display success alert

          Swal.fire({
            title: 'Success!',
            text: 'Occupant updated successfully.',
            icon: 'success',
            confirmButtonColor: 'green',
          });

      
      const res= await axios.get('occupants/unapprove');
      console.log(res.data.data);
      setOccupants(
        res.data.data.map((x, index) => {
          const editBtn =
            <Button size="medium" onClick={() => handleEdit(x)}>
              <AddTaskIcon style={{color:'red'}}/>
            </Button>

          return {
            ...x,
            index: index + 1,
            name: x.name,
            action: (
                editBtn 
            ),
          };
        })
      );

    
    })
    .catch((error) => {
      console.error(error);
      Swal.fire({
        title: 'Error!',
        text: 'An error occurred while updating the occupant.',
        icon: 'error',
        confirmButtonColor: 'red',
      });
    });
  };

  const fetchData = async () => {
    try {
      const response = await axios.get('occupants/unapprove');
      console.log(response.data.data);
      setOccupants(
        response.data.data.map((x, index) => {
          const editBtn =
            <Button size="medium" onClick={() => handleEdit(x)}>
              <AddTaskIcon style={{color:'red'}}/>
            </Button>

          return {
            ...x,
            index: index + 1,
            name: x.name,
            action: (
                editBtn 
            ),
          };
        })
      );
    } catch (error) {
      console.log('Error fetching occupants:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);



  return (
    <DashboardLayout>
      <DashboardNavbar />
        {/* { (userRole === 'Owner' || userRole === 'Tenant') ? */}
        <Grid container spacing={6}>

      
        {/* Manage Occupants  */}
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
                  Occupant Table
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{
                    columns: OccupantsColumn,
                    rows: occupants,
                  }}
                  isSorted
                  entriAmenity={false}
                  showTotalEntries
                  pagination
                />
              </MDBox>
            </Card>
          </Grid>

        </Grid>
         {/* : <AccessDeniedMessage />} */}
   
    </DashboardLayout>
  );
}
