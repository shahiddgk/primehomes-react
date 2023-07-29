// @mui material components
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { Button, Card, Grid} from "@mui/material";
import { Add, Create, Delete, Download, Edit } from "@mui/icons-material";
import { Form, Modal, Row, Tab, Tabs } from "react-bootstrap";

// Data

import DataTable from "examples/Tables/DataTable";
import toastr from "toastr";
import MDTypography from "components/MDTypography";
import { CSVLink } from "react-csv";
import { usePermissions } from "PermissionsProvider";

import AccessDeniedMessage from "layouts/authentication/components/BasicLayout/AccessDenied";
import axios from "../../config/server.config";





function Users() {
  const [tab, setTab] = useState('Owner')
  const [userData, setUserData] = useState([])
  const [modal, setModal] = useState({show: false, forEdit: false})
  const [modalValue, setModalValue] = useState({
    type: '',
    code: '',
    title: 'Mr.',
    firstName: '',
    lastName: '',
    middleName: '',
    primaryEmail: '',
    secondaryEmail: '',
    alternateEmail: '',
    landline: '',
    primaryMobile: '',
    secondaryMobile: '',
    isAuthorized : 'true'
  })

  const userPermissions = usePermissions()
  const requiredPermissions = ['edit-owner','delete-owner','edit-tenants','delete-tenants']; 
  const peopleViewPermissions = ['owner-list','tenants-list']; 
  const hasModificationPermission = userPermissions.some((permission) => requiredPermissions.includes(permission));
  const hasVeiwPermission = userPermissions.some((permission) => peopleViewPermissions.includes(permission));
  const PeopleColumn = [
    {
      Header: 'Code',
      accessor: 'code',
      align: 'center',
      width: '60px'
    },
    {
      Header: 'Full Name',
      accessor: 'name',
      align: 'center',
      width: '12rem'
    },
    {
      Header: 'Primary Email',
      accessor: 'primaryEmail',
      align: 'center',
      width: '110px'
    },
    {
      Header: 'Secondary Email',
      accessor: 'secondaryEmail',
      align: 'center',
      width: '110px'
    },
    {
      Header: 'Alternate Email',
      accessor: 'alternateEmail',
      align: 'center',
      width: '110px'
    },
    {
      Header: 'Landline',
      accessor: 'landline',
      align: 'center',
      width: '110px'
    },
    {
      Header: 'Primary Mobile',
      accessor: 'primaryMobile',
      align: 'center',
      width: '110px'
    },
    {
      Header: 'Secondary Mobile',
      accessor: 'secondaryMobile',
      align: 'center',
      width: '110px'
    },
    {
      Header: 'Authorized',
      accessor: 'isAuthorized',
      align: 'center',
      width: '40px'
    },
    ...(userPermissions.includes('edit-owner') || userPermissions.includes('delete-owner') || userPermissions.includes('edit-tenants') || userPermissions.includes('delete-tenants')) ? [
      {
        Header: 'Action',
        accessor: 'action',
        align: 'center',
        width: '80px'
      },
    ] : []
  ]
  const editPerson = (row) => {
    setModal({show:true, forEdit: true})
    setModalValue({
      ...row
    })
  }

  const deletePerson = row => {
    Swal.fire({
      title: `Are You Sure To Delete The User?
      '<i>${row.firstName} ${row.middleName} ${row.lastName}</i>'`,
      text: 'You will not be able to recover this data!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      color: 'dark',
      confirmButtonColor: 'maroon',
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`people/${row._id}`);
          Swal.fire(
            'Deleted!',
            `${response.data.message}`,
            'success'
          )
          const res = await axios.get(`people/${tab}`)
          setUserData(res.data.data.map(x => {
            const editBtn = hasModificationPermission? <Button onClick={() => editPerson(x)} size="medium" > <Edit color="info" /> </Button> : null
            const deleteBtn = hasModificationPermission ? <Button onClick={() => deletePerson(x)} size="medium"> <Delete color="error" /> </Button> :null
            return{
              ...x,
              name: `${x.title} ${x.firstName} ${x.middleName} ${x.lastName}`,
              isAuthorized: x.isAuthorized ? 'Yes' : 'No',
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

  const getPeople = async () => {
    try{
      const res = await axios.get(`people/${tab}`)
      setUserData(res.data.data.map(x => {
        const editBtn = hasModificationPermission? <Button onClick={() => editPerson(x)} size="medium" > <Edit color="info" /> </Button> : null
        const deleteBtn = hasModificationPermission? <Button onClick={() => deletePerson(x)} size="medium"> <Delete color="error" /> </Button> : null
        return{
          ...x,
          name: `${x.title} ${x.firstName} ${x.middleName} ${x.lastName}`,
          isAuthorized: x.isAuthorized ? 'Yes' : 'No',
          action: <>{editBtn} {deleteBtn} </>
        }
      }))
    }catch(err){
      toastr.error(err?.response?.data?.message)
      console.log(err?.response?.data);
    }
  }

  useEffect(() => {
    getPeople()
  }, [tab])
  
  const createPersonHandler = async () => {
    try{
      const res = await axios.post('people', {
        ...modalValue,
        isAuthorized: modalValue.isAuthorized === 'false'? false : true,
        type: tab
      })
      setModal({show:false, forEdit: false})
      alert(res.data.message)
      const x = res.data.data
      const editBtn =  <Button onClick={() => editPerson(x)} size="medium" > <Edit color="info" /> </Button>
      const deleteBtn =  <Button onClick={() => deletePerson(x)} size="medium"> <Delete color="error" /> </Button>
      setUserData([...userData, {...x,
        name: `${x.title} ${x.firstName} ${x.middleName} ${x.lastName}`,
        isAuthorized: x.isAuthorized ? 'Yes' : 'No',
        action: <>{editBtn} {deleteBtn} </>
      }])
    }catch(err){
      alert(err?.response?.data?.message)
    }
  }

  const updatePersonHandler = async () => {
    try{
      const res = await axios.put(`people/${modalValue._id}`, {
        ...modalValue
      })
      const y = res.data.data
      setUserData(userData.map(x =>  x._id === modalValue._id ? {...res.data.data,
        name: `${y.title} ${y.firstName} ${y.middleName} ${y.lastName}`,
        isAuthorized: y.isAuthorized ? 'Yes' : 'No',
      } : x ))
      setModal({show:false, forEdit: false})
      alert(res.data.message)
    }catch(err){
      alert(err?.response?.data?.message)
    }
  }

  return (
    <DashboardLayout>
{hasVeiwPermission? 
      <MDBox pt={1} pb={3}>
      <Tabs defaultActiveKey='Owner' justify color="dark" onSelect={(e) => setTab(e)}>
        <Tab eventKey="Owner" key={1} title="Owners" className="p-2">
          <Grid container spacing={5}>
            {userPermissions.includes('create-owner') ? 
            <Grid item xs={6} md={3}>
              <MDButton
              size='medium'
              variant = "contained"
              color= 'info'
              onClick={() => {setModal({show:true, forEdit: false})}}
              > 
              <Add /> &nbsp;&nbsp; Add Owner 
              </MDButton>
            </Grid>
             :null}
            <Grid item xs={6} md={2}>
              <MDButton
              variant="contained"
              color= 'dark'
              >
                <CSVLink
                  data={userData}
                  filename="Owners.csv"
                >
                  <Download />
                  Export
              </CSVLink>
              </MDButton>
            </Grid>
           
            <Grid item xs={12} height='80vh'>
              <Card>
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
                    Owners Table
                  </MDTypography>
                </MDBox>
                <MDBox pt={3}>
                  <DataTable
                    table={{ columns: PeopleColumn, rows: userData }}
                    isSorted
                    entriesPerPage={false}
                    showTotalEntries
                    pagination
                  />
                </MDBox>
              </Card>
            </Grid>
          </Grid>
        </Tab>

        <Tab eventKey="Tenant" key={2} title="Tenants" className="p-2">
          <Grid container spacing={6}>
          {userPermissions.includes('create-tenants') ? 
            <Grid item xs={6} md={3}>
              <MDButton
              size='medium'
              variant = "contained"
              color= 'info'
              onClick={() => {setModal({show:true, forEdit: false})}}
              > 
              <Add /> &nbsp;&nbsp; Add Tenants
              </MDButton>
            </Grid> : null}
              <Grid item xs={6} md={2}>
                <MDButton
                variant="contained"
                color= 'dark'
                >
                  <CSVLink
                    
                    data={userData}
                    filename="Tenants.csv"
                  >
                    <Download />
                    Export
                </CSVLink>
                </MDButton>
              </Grid>

            
            <Grid item xs={12} height='75vh'>
              <Card>
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
                    Tenants Table
                  </MDTypography>
                </MDBox>
              
                <MDBox pt={3}>
                  <DataTable
                    table={{ columns: PeopleColumn, rows: userData }}
                    isSorted
                    entriesPerPage={false}
                    showTotalEntries
                    pagination
                  />
                </MDBox>
              </Card>
            </Grid>
          </Grid>  
        </Tab>
      </Tabs>
      </MDBox>
: <AccessDeniedMessage /> }
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
        {modal.forEdit ? 'Updating ' : 'Creating New '} {tab}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{backgroundColor: 'ButtonFace'}}>
        <Form>
          <MDInput focused variant="filled" value={modalValue.code} onChange={e => setModalValue({...modalValue, code: e.target.value})} style={{width: '100%', background:'white'}}  label="Unique Code" color="dark" />
          
          <MDInput focused variant="filled" value={modalValue.title} onChange={e => setModalValue({...modalValue, title: e.target.value})} style={{width: '20%', background:'white'}}  label="Title" color="dark" />
          <MDInput focused variant="filled" value={modalValue.firstName} onChange={e => setModalValue({...modalValue, firstName: e.target.value})} style={{marginLeft: '2rem', width: '65%', background:'white'}}  label="First Name" color="dark" />
          
          <MDInput focused variant="filled" value={modalValue.middleName} onChange={e => setModalValue({...modalValue, middleName: e.target.value})} style={{width: '45%', background:'white'}}  label="Middle Name" color="dark" />
          <MDInput focused variant="filled" value={modalValue.lastName} onChange={e => setModalValue({...modalValue, lastName: e.target.value})} style={{marginLeft: '2rem', width: '45%', background:'white'}}  label="Last Name" color="dark" />
          
          <MDInput focused variant="filled" value={modalValue.primaryEmail} onChange={e => setModalValue({...modalValue, primaryEmail: e.target.value})} style={{marginRight: '50%', width: '45%', background:'white'}}  label="Primary Email" color="dark" />
          
          <MDInput focused variant="filled" value={modalValue.secondaryEmail} onChange={e => setModalValue({...modalValue, secondaryEmail: e.target.value})} style={{width: '45%', background:'white'}}  label="Secondary Email" color="dark" />
          <MDInput focused variant="filled" value={modalValue.alternateEmail} onChange={e => setModalValue({...modalValue, alternateEmail: e.target.value})} style={{marginLeft: '2rem', width: '45%', background:'white'}}  label="Alternate Email" color="dark" />
          
          <MDInput focused variant="filled" value={modalValue.landline} onChange={e => setModalValue({...modalValue, landline: e.target.value})} style={{width: '45%', background:'white'}}  label="Landline" color="dark" />
          <MDInput focused variant="filled" value={modalValue.primaryMobile} onChange={e => setModalValue({...modalValue, primaryMobile: e.target.value})} style={{marginLeft: '2rem', width: '45%', background:'white'}}  label="Primary Mobile" color="dark" />
         
          <MDInput focused variant="filled" value={modalValue.secondaryMobile} onChange={e => setModalValue({...modalValue, secondaryMobile: e.target.value})} style={{width: '45%', background:'white'}}  label="Secondary Mobile" color="dark" />
          <Row className="mt-3">
            <Form.Label className="col-5 col-md-2"> Authorized: </Form.Label>
            <Form.Select
                  className="col-7 col-md-5 "
                  aria-label="Authorized"
                  style={{  width: '25%', background:'white'}}
                  value={modalValue.isAuthorized}
                  onChange={e => setModalValue({...modalValue, isAuthorized: e.target.value})}
                >
                <option key={0} value='false'>No</option>
                <option key={1} value='true'>Yes</option>
            </Form.Select>
          </Row>
         

         

        </Form>
      </Modal.Body>
      <Modal.Footer>
        <MDButton
          size='small'
          variant = "contained"
          color= 'info'
          onClick={modal.forEdit ? updatePersonHandler : createPersonHandler}
          > 
          <Create /> &nbsp;&nbsp; {modal.forEdit ? 'Update' :  'Create Person'} 
        </MDButton>
        <Button onClick={() => {setModal({show:false, forEdit: false})}}>Close</Button>
      </Modal.Footer>
      </Modal>
    </DashboardLayout>
  );
}

export default Users;
