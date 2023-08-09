// Buildings

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
import { Add, ArrowDropDown, Create, Delete, Edit } from "@mui/icons-material";
import { Form, Modal } from "react-bootstrap";

// Data
import toastr from "toastr";
import Autocomplete from "react-autocomplete";
import { usePermissions } from "PermissionsProvider";
import AccessDeniedMessage from "layouts/authentication/components/BasicLayout/AccessDenied";


import axios from "../../config/server.config";



function Units() {
  const [unitsData, setUnitsData] = useState([])
  const [Buildings, setBuildings] = useState([])
  const [People, setPeople] = useState([])
  const [selectedBuilding, setSelectedBuilding] = useState({id: 0, value: ''})
  const [selectedTenant, setSelectedTenant] = useState({id: 0, value: ''})
  const [modal, setModal] = useState({show: false, forEdit: false})
  const [modalValue, setModalValue] = useState({
    building: '',
    tenant: '',
    unitNo: '',
    unitType: '',
    floorArea: 0,
    isParking: false,
    slotNo: 0,
    parkingArea: 0,
    parkingLocation: '',
    isFullyPaid: false,
    waterMeterNo: 0
  })

  const userPermissions = usePermissions()

  const canEdit = userPermissions.includes('edit-unit');
  const canDelete = userPermissions.includes('delete-unit');

  const UnitsColumns   = [
    {
      Header: 'Building',
      accessor: 'building',
      align: 'center',
      width: '100px'
    },
    {
      Header: 'Tenant',
      accessor: 'tenant',
      align: 'center',
      width: '100px'
    },
    {
      Header: 'Unit-No',
      accessor: 'unitNo',
      align: 'center',
      width: '60px'
    },
    {
      Header: 'Unit-Type',
      accessor: 'unitType',
      align: 'center',
      width: '100px'
    },
    {
      Header: 'Floor Area',
      accessor: 'floorArea',
      align: 'center',
      width: '100px'
    },
    {
      Header: 'Parking',
      accessor: 'isParking',
      align: 'center',
      width: '70px'
    },
    {
      Header: 'Slot No',
      accessor: 'slotNo',
      align: 'center',
      width: '70px'
    },
    {
      Header: 'Parking Area',
      accessor: 'parkingArea',
      align: 'center',
      width: '70px'
    }, 
    {
      Header: 'Parking Lc.',
      accessor: 'parkingLocation',
      align: 'center',
      width: '100px'
    },
    {
      Header: 'Fully Paid',
      accessor: 'isFullyPaid',
      align: 'center',
      width: '85px'
    },
    {
      Header: 'Water Meter No',
      accessor: 'waterMeterNo',
      align: 'center',
      width: '50px'
    },
    ...(userPermissions.includes('edit-unit') || userPermissions.includes('delete-unit')) ? [
      {
        Header: 'Action',
        accessor: 'action',
        align: 'center',
        width: '100px'
      },
    ] : []
  ]
  const editUnit = (row) => {
    setModal({show:true, forEdit: true})
    setModalValue({
      ...row,
    })
    setSelectedBuilding({
      id: row?.building?._id,
      value: `${row?.building?.code} - ${row?.building?.name}`
    })
    setSelectedTenant({
      id: row?.tenant?._id,
      value: `${row?.tenant?.code} - ${row?.tenant?.title} ${row?.tenant?.firstName} ${row?.tenant?.middleName} ${row?.tenant?.lastName}`
    })
  }

  const deleteUnit = row => {
    Swal.fire({
      title: `Are You Sure To Delete The Unit?
      '<b> Unit-No: ${row.unitNo}</b>'`,
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
          const response = await axios.delete(`units/${row._id}`);
          Swal.fire(
            'Deleted!',
            `${response.data.message}`,
            'success'
          )
          setUnitsData(unitsData.filter(x => x._id !== row._id))
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
        const res = await axios.get('units')
        setUnitsData(res.data.data.map(x => {
          const editBtn = canEdit? <Button onClick={() => editUnit(x)} size="small" > <Edit color="info" /> </Button> : null;
          const deleteBtn = canDelete ? <Button onClick={() => deleteUnit(x)} size="small"> <Delete color="error" /> </Button> : null;
          return{
            ...x,
            action : <>{editBtn} {deleteBtn}</>,
            building: `${x.building.code} - ${x.building.name}`,
            tenant: `${x.tenant.code} - ${x.tenant.title} ${x.tenant.firstName} ${x.tenant.middleName} ${x.tenant.lastName}`,
            isParking: x.isParking ? 'Yes' : 'No',
            isFullyPaid: x.isFullyPaid ? 'Yes' : 'No'
          }
        }))
      }catch(err){
        toastr.error(err?.response?.data?.message)
        console.log(err?.response?.data);
      }
    }

    const getData = async () => {
        try{
          let res = await axios.get('buildings')
          setBuildings(res.data.data)
          res = await axios.get('people')
          setPeople(res.data.data.filter(x => x.type === 'Tenant'))
         
        }catch(err){
          toastr.error(err?.response?.data?.message)
          console.log(err?.response?.data);
        }
      }

    getData()
    getBuildings()
    
  }, [])
  
  const createUnitHandler = async () => {
    try{
      const res = await axios.post('units', {
        ...modalValue,
        building: selectedBuilding.id,
        tenant: selectedTenant.id,
        isParking: modalValue.isParking === 'false' ? false : true,
        isFullyPaid: modalValue.isFullyPaid === 'false' ? false : true,
      })
      setModal({show:false, forEdit: false})
      alert(res.data.message)

      const x = res.data.data
      const editBtn = canEdit ? <Button onClick={() => editUnit(x)} size="medium" > <Edit color="info" /> </Button> : null;
      const deleteBtn = canDelete ? <Button onClick={() => deleteUnit(x)} size="medium"> <Delete color="error" /> </Button> : null;
      setUnitsData([...unitsData, {
        ...x,
        action: <>{editBtn} {deleteBtn} </>,
        building: Buildings.filter(building => building._id === x.building).map(b => `${b.code} - ${b.name}`),
        tenant: People.filter(p => p._id === x.tenant).map(p => `${p.code} - ${p.title} ${p.firstName} ${p.middleName} ${p.lastName}`),
    
      }])
    }catch(err){
      alert(err?.response?.data?.message)
    }
  }

  const updateUnitHandler = async () => {
    try{
      const res = await axios.put(`units/${modalValue._id}`, {
        ...modalValue,
        building: selectedBuilding.id,
        tenant: selectedTenant.id,
        // isParking: modalValue.isParking === 'false' ? false : true,
        // isFullyPaid: modalValue.isFullyPaid === 'false' ? false : true,
      })
      const data = {...res.data.data}
      console.log('data',data);
      setModal({show:false, forEdit: false})
      alert(res.data.message)
      setUnitsData(unitsData.map(x =>  x._id === modalValue._id ? {
        ...data,
        building: Buildings.filter(building => building._id === data.building).map(b => `${b.code} - ${b.name}`),
        tenant: People.filter(p => p._id === data.tenant).map(p => `${p.code} - ${p.title} ${p.firstName} ${p.middleName} ${p.lastName}`),      
        isParking: x.isParking ? 'Yes' : 'No',
        isFullyPaid: x.isFullyPaid ? 'Yes' : 'No',
    } : x ))
    }catch(err){
      alert(err?.response?.data?.message)
    }
  }

  const onChangeBuilding = (e) => {
    setSelectedBuilding({
      id: 0,
      value: e.target.value
    })
  };

  const onSelectBuilding = (val, item) => {
    setSelectedBuilding({
      id: item.key,
      value: val
    })
  };

  const onChangeTenant = (e) => {
    setSelectedTenant({
      id: 0,
      value: e.target.value
    })
  };

  const onSelectTenant = (val, item) => {
    setSelectedTenant({
      id: item.key,
      value: val
    })
  };



  const buildingAutoList = [];
  Buildings.map((building) => {
    if ((building.name && building.name.toLowerCase().includes(selectedBuilding.value.toLowerCase())) || (building.code && building.code.toLowerCase().includes(selectedBuilding.value.toLowerCase()))) {
        buildingAutoList.push({
        label: `${building.code} - ${building.name}`,
        key: building._id,
      });
    }
  });

  const tenantAutoList = [];
  People.map((person) => {
    if ((person.code && person.code.toLowerCase().includes(selectedTenant.value.toLowerCase())) || 
       (person.title && person.title.toLowerCase().includes(selectedTenant.value.toLowerCase())) ||
       (person.firstName && person.firstName.toLowerCase().includes(selectedTenant.value.toLowerCase())) ||
       (person.middleName && person.middleName.toLowerCase().includes(selectedTenant.value.toLowerCase())) || 
       (person.lastName && person.lastName.toLowerCase().includes(selectedTenant.value.toLowerCase())) ) {
        tenantAutoList.push({
        label: `${person.code} - ${person.title} ${person.firstName} ${person.middleName} ${person.lastName}`,
        key: person._id,
      });
    }
  });

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {userPermissions.includes('list-units') ? 
      <MDBox pt={1} pb={3}>
        <Grid container spacing={6}>
          {userPermissions.includes('create-unit') ?
          <Grid item xs={6} md={3}>
            <MDButton
            size='medium'
            variant = "contained"
            color= 'info'
            onClick={() => {setModal({show:true, forEdit: false})}}
            > 
            <Add /> &nbsp;&nbsp; Add Unit 
            </MDButton>
          </Grid>
             : null}
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
                  Units Table
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns: UnitsColumns    , rows: unitsData }}
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
        {modal.forEdit ? 'Updating' : 'Creating New'} Unit
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{backgroundColor: 'ButtonFace'}}>
        <Form>
        <div className="autocomplete col-12 col-md-12 my-2 row">
              <Form.Label className="mx-4 color-blue">Building</Form.Label>
              <div className="autocomplete-container" style={{ position: 'relative', display: 'inline-block', width: '100%', zIndex: 9999 }}>
                <Autocomplete
                  getItemValue={(item) => item.label}
                  items={buildingAutoList}
                  inputProps={{ placeholder: 'Search Building' }}
                  renderItem={(item, isHighlighted) => (
                    <div
                      style={{
                        background: isHighlighted ? '#f0f0f0' : 'white',
                        color: 'black',
                        padding: '8px 12px',
                        fontSize: '16px',
                        fontFamily: 'Arial, sans-serif',
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        cursor: 'pointer',
                        position: 'initial',
                        zIndex: 9999, // Set a higher z-index here
                      }}
                      key={item.key}
                    >
                      {item.label}
                    </div>
                  )}
                  value={selectedBuilding.value}
                  onChange={(e) => onChangeBuilding(e)}
                  onSelect={(val, item) => onSelectBuilding(val, item)}
                />
              </div>
            </div>

            <div className="autocomplete col-12 col-md-12 my-2 row">
              <Form.Label className="mx-4 color-blue">Tenant &nbsp;</Form.Label>
              <div className="autocomplete-container" style={{ position: 'relative', display: 'inline-block', width: '100%', zIndex: 9990 }}>
                <Autocomplete
                  getItemValue={(item) => item.label}
                  items={tenantAutoList}
                  inputProps={{ placeholder: 'Search Tenant' }}
                  renderItem={(item, isHighlighted) => (
                    <div
                      style={{
                        background: isHighlighted ? '#f0f0f0' : 'white',
                        color: 'black',
                        padding: '8px 12px',
                        fontSize: '16px',
                        fontFamily: 'Arial, sans-serif',
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        cursor: 'pointer',
                        position: 'initial',
                        zIndex: 9999, // Set a higher z-index here
                      }}
                      key={item.key}
                    >
                      {item.label}
                    </div>
                  )}
                  value={selectedTenant.value}
              onChange={(e) => onChangeTenant(e)}
              onSelect={(val, item) => onSelectTenant(val, item)}
                />
              </div>
            </div>
        <MDInput type="text" focused variant="filled" value={modalValue.unitNo} onChange={e => setModalValue({...modalValue, unitNo: e.target.value})} style={{width: '40%', background:'white'}}  label="Unit No" color="dark" />
        <MDInput type="text" focused variant="filled" value={modalValue.unitType} onChange={e => setModalValue({...modalValue, unitType: e.target.value})} style={{marginLeft:'50px', width: '40%', background:'white'}}  label="Unit Type" color="dark" />
       
        <MDInput type="number" focused variant="filled" value={modalValue.floorArea} onChange={e => setModalValue({...modalValue, floorArea: e.target.value})} style={{width: '40%', background:'white'}}  label="Floor Area" color="dark" />
        <MDInput type="number" focused variant="filled" value={modalValue.slotNo} onChange={e => setModalValue({...modalValue, slotNo: e.target.value})} style={{marginLeft:'50px', width: '40%', background:'white'}}  label="Slot No" color="dark" />
    
        <div className="mt-2 col-12 px-2" style={{ position: "relative", width: '100%' }}>
        <Form.Label className="col-5 col-md-2 color-blue"> Parking: </Form.Label>
            <Form.Select
                className="col-6 col-md-5 "
                aria-label="Parking"
                style={{  width: '100%', background:'white'}}
                value={modalValue.isParking}
                onChange={e => setModalValue({...modalValue, isParking: e.target.value})}
                >
                <option key={0} value='false'>No</option>
                <option key={1} value='true'>Yes</option>
            </Form.Select>
            <div
                    style={{
                      position: "absolute",
                      top: "75%",
                      right: "10px", // Adjust this value as needed for proper positioning
                      transform: "translateY(-50%)",
                    }}
                  >

                    <ArrowDropDown />
                  </div>
        </div>

        <MDInput type="number" focused variant="filled" value={modalValue.parkingArea} onChange={e => setModalValue({...modalValue, parkingArea: e.target.value})} style={{width: '40%', background:'white'}}  label="Parking Area" color="dark" />
        <MDInput type="text" focused variant="filled" value={modalValue.parkingLocation} onChange={e => setModalValue({...modalValue, parkingLocation: e.target.value})} style={{marginLeft:'50px', width: '40%', background:'white'}}  label="Parking Location" color="dark" />
    
        <MDInput type="number" focused variant="filled" value={modalValue.waterMeterNo} onChange={e => setModalValue({...modalValue, waterMeterNo: e.target.value})} style={{width: '40%', background:'white'}}  label="Water Meter No" color="dark" />
        <div className="mt-2 col-12 px-2" style={{ position: "relative", width: '100%' }}>
        <Form.Label className="col-5 col-md-2 color-blue"> Fully Paid: </Form.Label>
            <Form.Select
                className="col-6 col-md-5 "
                aria-label="Fully Paid"
                style={{  width: '100%', background:'white'}}
                value={modalValue.isFullyPaid}
                onChange={e => setModalValue({...modalValue, isFullyPaid: e.target.value})}
                >
                <option key={0} value='false'>No</option>
                <option key={1} value='true'>Yes</option>
            </Form.Select>
            <div
                    style={{
                      position: "absolute",
                      top: "75%",
                      right: "10px", // Adjust this value as needed for proper positioning
                      transform: "translateY(-50%)",
                    }}
                  >

                    <ArrowDropDown />
                  </div>
        </div>

        </Form>
      </Modal.Body>
      <Modal.Footer>
        <MDButton
          size='small'
          variant = "contained"
          color= 'info'
          onClick={modal.forEdit ? updateUnitHandler : createUnitHandler}
          > 
          <Create /> &nbsp;&nbsp; {modal.forEdit ? 'Update' :  'Create Unit'} 
        </MDButton>
        <Button onClick={() => {setModal({show:false, forEdit: false})}}>Close</Button>
      </Modal.Footer>
      </Modal>
    </DashboardLayout>
  );
}

export default Units;
