// Buildings

import { useNavigate } from "react-router-dom";
// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import { Button } from "@mui/material";
import { Add, Create, Delete, Edit } from "@mui/icons-material";
import { Form, Modal } from "react-bootstrap";

// Data
import { usePermissions } from "PermissionsProvider";
import toastr from "toastr";
import Autocomplete from "react-autocomplete";
import AccessDeniedMessage from "layouts/authentication/components/BasicLayout/AccessDenied";
import axios from "../../config/server.config";


function Buildings() {
  const navigate = useNavigate();
  const [buildingData, setBuildingData] = useState([])
  const [modal, setModal] = useState({show: false, forEdit: false})
  const [People, setPeople] = useState([])
  const [selectedOwner, setSelectedOwner] = useState({id: 0, value: ''})
  const [modalValue, setModalValue] = useState({
    owner: '',
    code: '',
    name: '',
    phase: '',
    address: '',
    city: '',
    dues: 0,
    dueDays: 0
  })

  const userPermissions = usePermissions();

  const canEdit = userPermissions.includes('edit-buildings');
  const canDelete = userPermissions.includes('delete-buildings');

  const BuildingColumns = [
    {
      Header: 'Code',
      accessor: 'code',
      align: 'center',
      width: '80px'
    },
    {
      Header: 'Name',
      accessor: 'name',
      align: 'center',
      width: '150px'
    },
    {
      Header: 'Phase',
      accessor: 'phase',
      align: 'center',
      width: '50px'
    },
    {
      Header: 'Address',
      accessor: 'address',
      align: 'center',
      width: '250px'
    },
    {
      Header: 'City',
      accessor: 'city',
      align: 'center',
      width: '150px'
    },
    {
      Header: 'Dues',
      accessor: 'dues',
      align: 'center',
      width: '70px'
    },
    {
      Header: 'Due Days',
      accessor: 'dueDays',
      align: 'center',
      width: '70px'
    },
    ...(canEdit || canDelete) ?
     [
      {
        Header: 'Action',
        accessor: 'action',
        align: 'center',
        width: '100px'
      },
     ] : []
    
  ]
  
  const editBuilding = (row) => {
    setModal({show:true, forEdit: true})
    setModalValue({
      ...row
    })
  }

  const deleteBuilding = row => {
    Swal.fire({
      title: `Are You Sure To Delete The Building?
      '<i>${row.name}</i>'`,
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
          const response = await axios.delete(`buildings/${row._id}`);
          Swal.fire(
            'Deleted!',
            `${response.data.message}`,
            'success'
          )
          setBuildingData(buildingData.filter(x => x._id !== row._id))
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

  useEffect(() => {
    const getBuildings = async () => {
      try{
        const res = await axios.get('buildings')
        setBuildingData(res.data.data.map(x => {
          const editBtn = canEdit ? <Button onClick={() => editBuilding(x)} size="medium" > <Edit color="info" /> </Button> : null
          const deleteBtn = canDelete ? <Button onClick={() => deleteBuilding(x)} size="medium"> <Delete color="error" /> </Button> : null
          return{
            ...x,
            action: <>{editBtn} {deleteBtn} </>
          }
        }))
      }catch(err){
        toastr.error(err?.response?.data?.message)
        console.log(err?.response?.data);
      }
    }

    getBuildings()

    const getData = async () => {
      try{
        const res = await axios.get('people')
        setPeople(res.data.data.filter(x => x.type === 'Owner'))
       
      }catch(err){
        toastr.error(err?.response?.data?.message)
        console.log(err?.response?.data);
      }
    }

  getData()
  }, [])
  
  const onChangeOwner = (e) => {
    setSelectedOwner({
      id: 0,
      value: e.target.value
    })
    console.log('value',e.target.value);
  };

  const onSelectOwner = (val, item) => {
    setSelectedOwner({
      id: item.key,
      value: val
    })
    console.log('slected owner',{item:item.key,val});
  };

  const ownerAutoList = [];
  People.map((person) => {
    if ((person.code && person.code.toLowerCase().includes(selectedOwner.value.toLowerCase())) || 
       (person.title && person.title.toLowerCase().includes(selectedOwner.value.toLowerCase())) ||
       (person.firstName && person.firstName.toLowerCase().includes(selectedOwner.value.toLowerCase())) ||
       (person.middleName && person.middleName.toLowerCase().includes(selectedOwner.value.toLowerCase())) || 
       (person.lastName && person.lastName.toLowerCase().includes(selectedOwner.value.toLowerCase())) ) {
        ownerAutoList.push({
        label: `${person.code} - ${person.title} ${person.firstName} ${person.middleName} ${person.lastName}`,
        key: person._id,
      });
    }
  });

  const createBuildingHandler = async () => {
    try{
      const res = await axios.post('buildings', {
        ...modalValue,
        owner: selectedOwner?.id
      })
      setModal({show:false, forEdit: false})
      alert(res.data.message)
      setBuildingData(res.data.data.map(x => {
        const editBtn = canEdit ? <Button onClick={() => editBuilding(x)} size="medium" > <Edit color="info" /> </Button> : null
        const deleteBtn = canDelete ? <Button onClick={() => deleteBuilding(x)} size="medium"> <Delete color="error" /> </Button> : null
        return{
          ...x,
          action: <>{editBtn} {deleteBtn} </>
        }
      }))
    }catch(err){
      alert(err?.response?.data?.message)
    }
  }

  const updateBuildingHandler = async () => {
    try{
      const res = await axios.put(`buildings/${modalValue._id}`, {
        ...modalValue
      })
      setModal({show:false, forEdit: false})
      alert(res.data.message)
      setBuildingData(buildingData.map(x =>  x._id === modalValue._id ? {... res.data.data, } : x ))
    }catch(err){
      alert(err?.response?.data?.message)
    }
  }

  const createBuildingBtn = () => {
    setModal({show:true, forEdit: false})
    // navigate('/create-building')
  }


  return (
    <DashboardLayout>
      <DashboardNavbar />
      {userPermissions.includes('list-buildings') ? 
      <MDBox pt={1} pb={3}>
        <Grid container spacing={6}>
        {userPermissions.includes('create-buildings') ? 
          <Grid item xs={6} md={3}>
            <MDButton
            size='medium'
            variant = "contained"
            color= 'info'
            onClick={createBuildingBtn}
            > 
            <Add /> &nbsp;&nbsp; Add Building 
            </MDButton>
          </Grid>
          : null }
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
                  Buildings Table
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns: BuildingColumns, rows: buildingData }}
                  isSorted
                  entriesPerPage
                  showTotalEntries
                  pagination
                />
              </MDBox>
            </Card>
          </Grid>

        </Grid>
      </MDBox>
      : <AccessDeniedMessage />}
      <Footer />
    
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
        {modal.forEdit ? 'Updating' : 'Creating New'} Builidng
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{backgroundColor: 'ButtonFace'}}>
        <Form>
          <div className="autocomplete col-12 col-md-12 my-2">
            <Form.Label className="mx-4 color-blue">Owner &nbsp;&nbsp;</Form.Label>
            <Autocomplete
                getItemValue={(item) => item.label}
                items={ownerAutoList}
                inputProps={{ placeholder: "Search Owner" }}
                renderItem={(item, isHighlighted) => (
                  <div
                    style={{
                      background: isHighlighted ? "#2E86C1" : "white",
                      color: isHighlighted ? "white" : "black",
                      padding: '5px 10px',
                      borderRadius: "1px",
                      fontSize: "15px",
                      fontFamily: "Arial",
                    }}
                    key={item.key}
                  >
                    {item.label}
                  </div>
                )}
                value={selectedOwner.value}
                onChange={(e) => onChangeOwner(e)}
                onSelect={(val, item) => onSelectOwner(val, item)}
              />
          </div>
          <MDInput focused variant="filled" value={modalValue.code} onChange={e => setModalValue({...modalValue, code: e.target.value})} style={{width: '100%', background:'white'}}  label="Building Code" color="dark" />
          <MDInput focused variant="filled" value={modalValue.name} onChange={e => setModalValue({...modalValue, name: e.target.value})} style={{width: '100%', background:'white'}}  label="Building Name" color="dark" />
          <MDInput focused variant="filled" value={modalValue.phase} onChange={e => setModalValue({...modalValue, phase: e.target.value})} style={{width: '100%', background:'white'}}  label="Phase" color="dark" />
          <MDInput focused variant="filled" value={modalValue.address} onChange={e => setModalValue({...modalValue, address: e.target.value})} style={{width: '100%', background:'white'}}  label="Address" color="dark" />
          <MDInput focused variant="filled" value={modalValue.city} onChange={e => setModalValue({...modalValue, city: e.target.value})} style={{width: '100%', background:'white'}}  label="City" color="dark" />
          <MDInput type="number" focused variant="filled" value={modalValue.dues} onChange={e => setModalValue({...modalValue, dues: e.target.value})} style={{width: '40%', background:'white'}}  label="Association Dues" color="dark" />
          <MDInput type="number" focused variant="filled" value={modalValue.dueDays} onChange={e => setModalValue({...modalValue, dueDays: e.target.value})} style={{marginLeft:'50px', width: '40%', background:'white'}}  label="Due Days" color="dark" />

        </Form>
      </Modal.Body>
      <Modal.Footer>
        <MDButton
          size='small'
          variant = "contained"
          color= 'info'
          onClick={modal.forEdit ? updateBuildingHandler : createBuildingHandler}
          > 
          <Create /> &nbsp;&nbsp; {modal.forEdit ? 'Update' :  'Create Building'} 
        </MDButton>
        <Button onClick={() => {setModal({show:false, forEdit: false})}}>Close</Button>
      </Modal.Footer>
      </Modal>
    </DashboardLayout>
  );
}

export default Buildings;
