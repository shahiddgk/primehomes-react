import React, { useEffect, useState } from 'react';
import toastr from "toastr";
import axios from 'axios';
import DataTable from 'examples/Tables/DataTable';
import MDBox from 'components/MDBox';
import { Button, Card, Grid } from '@mui/material';
import { Add, Create, Delete, Edit } from '@mui/icons-material';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import Swal from 'sweetalert2';
import MDInput from 'components/MDInput';
import MDButton from 'components/MDButton';
import { Form, Modal, Row, Tab } from "react-bootstrap";
import MDTypography from 'components/MDTypography';


const PeopleColumn = [
    {
        Header: 'No',
        accessor: 'index',
        align: 'center',
        width: '60px',
      },  
    {
      Header: 'Full Name',
      accessor: 'name',
      align: 'center',
      width: '12rem'
    },
    {
      Header: 'Email',
      accessor: 'email',
      align: 'center',
      width: '110px'
    },
    {
      Header: 'role',
      accessor: 'role',
      align: 'center',
      width: '110px'
    },
    {
      Header: 'Action',
      accessor: 'action',
      align: 'center',
      width: '80px'
    },
  ]
export default function Users() {
    const [usersData, setUsersData] = useState([]);
    const [adminFlag, setAdminFlag] = useState(false);
    const [modal, setModal] = useState({show: false, forEdit: false})
    const [modalValue, setModalValue] = useState({
        type: '',
        name: '',
        primaryEmail: '',
      });
    

      const editPerson = (row) => {
        setModal({ show: true, forEdit: true });
        setModalValue({
          ...row,
        });
      };
    
      const deletePerson = row => {
       const newName = row.name || `${row.firstName} ${row.middleName} ${row.lastName}`
        Swal.fire({
          title: `Are You Sure To Delete The User?
          <i> ${newName}</i>`,
          text: 'You will not be able to recover this data!',
          icon: `question`,
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'No, cancel!',
          color: 'dark',
          confirmButtonColor: 'maroon',
          reverseButtons: true
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const response = await axios.delete(`users/user/${row._id}`);
              Swal.fire(
                'Deleted!',
                `${response.data.message}`,
                'success'
              )
              const res = await axios.get(`/users`)
              setUsersData(res.data.data.map((x, index) => {
                const editBtn =  <Button  size="medium" onClick={() => editPerson(x)}> <Edit color="info" /> </Button>
                const deleteBtn =  <Button onClick={() => deletePerson(x)} size="medium"> <Delete color="error" /> </Button>
                return{
                    ...x,
                    index:index+1,
                    name: x.name || `${x.firstName} ${x.middleName} ${x.lastName}`,
                    email: x.email || x.primaryEmail,
                    role: x.role || x.type,
                    action: <>{editBtn} {deleteBtn} </>
                }
              }))
            } catch (error) {
              toastr.clear();
              toastr.error(error?.response?.data?.message);
            }
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire(
              'Cancelled',
              'Your Data Is Safe :)',
              'error'
            )
          }
        })
      }


      const updatePersonHandler = async () => {
        try {
          let updateData;
          if (adminFlag) {
            updateData = {
              adminFlag,
              name: modalValue.name,
              email: modalValue.email,
              role: modalValue.role,
            };
          } else {
            updateData = {
              adminFlag, 
              firstName: modalValue.firstName,
              middleName: modalValue.middleName,
              lastName: modalValue.lastName,
              primaryEmail: modalValue.primaryEmail,
              type: modalValue.type,
            };
          }
      
          const res = await axios.patch(`/users/update/${modalValue._id}`, updateData);
          const response = await axios.get(`/users`)
          setUsersData(response.data.data.map((x, index) => {
            const editBtn =  <Button  size="medium" onClick={() => editPerson(x)}> <Edit color="info" /> </Button>
            const deleteBtn =  <Button onClick={() => deletePerson(x)} size="medium"> <Delete color="error" /> </Button>
            return{
                ...x,
                index:index+1,
                name: x.name || `${x.firstName} ${x.middleName} ${x.lastName}`,
                email: x.email || x.primaryEmail,
                role: x.role || x.type,
                action: <>{editBtn} {deleteBtn} </>
            }
          }))
      
          setModal({ show: false, forEdit: false });
          alert(res.data.message);
        } catch (err) {
          alert(err?.response?.data?.message);
        }
      };
    
  
    useEffect(() => {
 
      axios.get('/users')
        .then(response => {
            console.log(response.data.data);
          setUsersData(response.data.data.map((x,index) => {
            const editBtn =  <Button  size="medium" onClick={() => editPerson(x)}> <Edit color="info" /> </Button>
            const deleteBtn =  <Button  size="medium" onClick={() => deletePerson(x)}> <Delete color="error" /> </Button>
            
            return{
              ...x,
              index:index+1,
              name: x.name || `${x.firstName} ${x.middleName} ${x.lastName}`,
              email: x.email || x.primaryEmail,
              role: x.role || x.type,
              action: <>{editBtn} {deleteBtn} </>
            }
          }))
        })
        .catch(error => {
          console.log('Error fetching users:', error);
        });
    }, []);
    return (

        <DashboardLayout>
        <DashboardNavbar />
        <MDButton
            size='medium'
            variant = "contained"
            color= 'info'
            sx={{ maxWidth: '240px', marginTop: '30px' }}
            > 
            <Add /> &nbsp;&nbsp; Add Building 
            </MDButton>
        <Grid container justifyContent="center" > 
      
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
                  Users Table
                </MDTypography>
              </MDBox>
        <MDBox pt={3}>
        
        <DataTable
          table={{ columns: PeopleColumn, rows: usersData }}
          isSorted
          entriesPerPage={false}
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
      onHide={() => {setModal({show:false, forEdit: false})}}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
        {modal.forEdit ? 'Updating ' : 'Creating New '} {Tab}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{backgroundColor: 'ButtonFace'}}>
        <Form>
       
        {
        modalValue.name ? <> 
        <MDInput focused variant="filled"    onFocus={() => setAdminFlag(true)}  value={modalValue.name} onChange={e => setModalValue({...modalValue, name: e.target.value})} style={{marginLeft: '2rem', width: '65%', background:'white'}}  label="Name" color="dark" />
        <MDInput focused variant="filled" value={modalValue.email} onChange={e => setModalValue({...modalValue, email: e.target.value})} style={{marginLeft: '2rem', width: '65%', background:'white'}}  label="Email" color="dark" />
        <MDInput focused variant="filled" value={modalValue.role} onChange={e => setModalValue({...modalValue, role: e.target.value})} style={{marginLeft: '2rem', width: '65%', background:'white'}}  label="role" color="dark" />
        { console.log('checking admin flag',adminFlag)}
         </>:
         <> <MDInput focused variant="filled"   onFocus={() => setAdminFlag(false)} value={modalValue.firstName} onChange={e => setModalValue({...modalValue, firstName: e.target.value})} style={{marginLeft: '2rem', width: '65%', background:'white'}}  label="First Name" color="dark" />
          
          <MDInput focused variant="filled" value={modalValue.middleName} onChange={e => setModalValue({...modalValue, middleName: e.target.value})} style={{width: '45%', background:'white'}}  label="Middle Name" color="dark" />
          <MDInput focused variant="filled" value={modalValue.lastName} onChange={e => setModalValue({...modalValue, lastName: e.target.value})} style={{marginLeft: '2rem', width: '45%', background:'white'}}  label="Last Name" color="dark" />
          
          <MDInput focused variant="filled" value={modalValue.primaryEmail} onChange={e => setModalValue({...modalValue, email: e.target.value})} style={{marginRight: '50%', width: '45%', background:'white'}}  label="Primary Email" color="dark" />
          <MDInput focused variant="filled" value={modalValue.type} onChange={e => setModalValue({...modalValue, type: e.target.value})} style={{marginRight: '50%', width: '45%', background:'white'}}  label="Type" color="dark" /></>}
           
          

         </Form>
      </Modal.Body>
      <Modal.Footer>
        <MDButton
          size='small'
          variant = "contained"
          color= 'info'
          onClick={modal.forEdit ? updatePersonHandler : "createPersonHandler"}
          > 
          <Create /> &nbsp;&nbsp; {modal.forEdit ? 'Update' :  'Create Person'} 
        </MDButton>
        <Button onClick={() => {setModal({show:false, forEdit: false})}}>Close</Button>
      </Modal.Footer>
      </Modal>
      </DashboardLayout>

    )
  }
  