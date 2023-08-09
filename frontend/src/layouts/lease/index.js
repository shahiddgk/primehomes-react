// Buildings

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

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
import { Button, Paper } from "@mui/material";
import { Add, ArrowDropDown, Cancel, Create, Delete, Edit, UploadFile } from "@mui/icons-material";
import { Col, Form, Modal, Row } from "react-bootstrap";
import { saveAs } from 'file-saver'

// Data
import toastr from "toastr";
import Autocomplete from "react-autocomplete";
import { usePermissions } from "PermissionsProvider";
import AccessDeniedMessage from "layouts/authentication/components/BasicLayout/AccessDenied";
import zIndex from "@mui/material/styles/zIndex";
import axios from "../../config/server.config";



function Lease() {
  const [leaseData, setleaseData] = useState([])
  const [Buildings, setBuildings] = useState([])
  const [People, setPeople] = useState([])
  const [unitList, setUnitList] = useState([])
  const [selectedBuilding, setSelectedBuilding] = useState({ id: 0, value: '' })
  const [selectedTenant, setSelectedTenant] = useState({ id: 0, value: '' })
  const [selectedUnit, setselectedUnit] = useState({ id: 0, value: '' })
  const [modal, setModal] = useState({ show: false, forEdit: false })
  const [modalValue, setModalValue] = useState({
    startDate: '',
    endDate: '',
    building: '',
    unit: '',
    leaseType: 'Short Term Lease',
    tenant: '',
    accuntStatus: false,
    amenities: false,
    leaseContract: {},
    identity: {},
    otherDoc1: {},
    otherDoc2: {}
  })

   const { permissions, userRole } = usePermissions();
const userPermissions = permissions;

  const canEdit = userPermissions.includes('edit-lease-profiling');
  const canDelete = userPermissions.includes('delete-lease-profiling');
  const LeaseColumns = [
    {
      Header: 'Building',
      accessor: 'building',
      align: 'center',
      width: '100px'
    },
    {
      Header: 'Unit',
      accessor: 'unit',
      align: 'center',
      width: '100px'
    },
    {
      Header: 'Lease Type',
      accessor: 'leaseType',
      align: 'center',
      width: '100px'
    },
    {
      Header: 'Tenant',
      accessor: 'tenant',
      align: 'center',
      width: '150px'
    },
    {
      Header: 'Start Date',
      accessor: 'startDate',
      align: 'center',
      width: '110px'
    },
    {
      Header: 'End Date',
      accessor: 'endDate',
      align: 'center',
      width: '110px'
    },
    {
      Header: 'Accunt Status',
      accessor: 'accuntStatus',
      align: 'center',
      width: '80px'
    },
    {
      Header: 'Amenities',
      accessor: 'amenities',
      align: 'center',
      width: '70px'
    },
    {
      Header: 'Lease Contract',
      accessor: 'leaseContract',
      align: 'center',
      width: '100px'
    },
    {
      Header: 'Identity',
      accessor: 'identity',
      align: 'center',
      width: '90px'
    },
    {
      Header: 'otherDoc1',
      accessor: 'otherDoc1',
      align: 'center',
      width: '75px'
    },
    {
      Header: 'otherDoc2',
      accessor: 'otherDoc2',
      align: 'center',
      width: '75px'
    },
    ...(canEdit || canDelete) ? [
      {
        Header: 'Action',
        accessor: 'action',
        align: 'center',
        width: '100px'
      },
    ] : []

  ]


  const downloadImage = img => {
    // saveAs (link , filename.jpg)
    saveAs(process.env.REACT_APP_STORAGE_URL + img.path, `${img.fieldname.toUpperCase()}-${img.originalname}`)
  }

  const editLease = (row) => {
    setModal({ show: true, forEdit: true })

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
    setselectedUnit({
      id: 1,
      value: row.unit
    })
  }

  const deleteLease = row => {
    Swal.fire({
      title: `Are You Sure To Delete The Unit?
      '<b> Unit-No: ${row.unit}</b>'`,
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
          const response = await axios.delete(`lease/${row._id}`);
          Swal.fire(
            'Deleted!',
            `${response.data.message}`,
            'success'
          )
          console.log("leaseData", leaseData);
          setleaseData(leaseData.filter(x => x._id !== row._id))
        } catch (error) {
          toastr.clear();
          alert(error?.response?.data?.message)
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

  const fileButton = (row, img) => typeof img === 'object' && img !== null ?
    <Col><MDButton color="success" size="small" variant="gradient" onClick={() => downloadImage(img)} >View</MDButton></Col>
    :
    <MDButton size="small" color="warning" variant="outlined" onClick={() => editLease(row)} >Upload</MDButton>


  useEffect(() => {
    const getUnitList = async () => {
      try {
        console.log('select', selectedBuilding);
        const res = await axios.get(`units/list/${selectedBuilding.id}`)
        console.log('checing', res.data.data);
        setUnitList(res.data.data)

      } catch (err) {
        toastr.error(err?.response?.data?.message)
        console.log(err?.response?.data);
      }
    }

    selectedBuilding.id === 0 ? setUnitList([]) : getUnitList()
  }, [selectedBuilding.id])

  useEffect(() => {
    const getBuildings = async () => {
      try {
        const res = await axios.get('lease')
        setleaseData(res.data.data.map(x => {
          const editBtn = canEdit ? <Button onClick={() => editLease(x)} size="small" > <Edit color="info" /> </Button> : null
          const deleteBtn = canDelete ? <Button onClick={() => deleteLease(x)} size="small"> <Delete color="error" /> </Button> : null
          return {
            ...x,
            action: <>{editBtn} {deleteBtn}</>,
            building: `${x?.building?.code} - ${x?.building?.name}`,
            tenant: `${x.tenant.code} - ${x.tenant.title} ${x.tenant.firstName} ${x.tenant.middleName} ${x.tenant.lastName}`,
            accuntStatus: x.accuntStatus ? 'Yes' : 'No',
            amenities: x.amenities ? 'Yes' : 'No',
            leaseContract: fileButton(x, x.leaseContract),
            identity: fileButton(x, x.identity),
            otherDoc1: fileButton(x, x.otherDoc1),
            otherDoc2: fileButton(x, x.otherDoc2)

          }
        }))
      } catch (err) {
        toastr.error(err?.response?.data?.message)
        console.log(err?.response?.data);
      }
    }

    const getData = async () => {
      try {
        let res = await axios.get('buildings')
        setBuildings(res.data.data)
        res = await axios.get('people')
        setPeople(res.data.data.filter(x => x.type === 'Tenant'))

      } catch (err) {
        toastr.error(err?.response?.data?.message)
        console.log(err?.response?.data);
      }
    }

    getData()
    getBuildings()

  }, [])

  const createLeaseHandler = async () => {
    try {
      const data = {
        ...modalValue,
        building: selectedBuilding.id,
        tenant: selectedTenant.id,
        unit: selectedUnit.value
      }

      const formData = new FormData();
      Object.keys({ ...data }).map(x => {
        formData.append(x, data[x]);
      })

      const res = await axios.post('lease', formData, { headers: { "Content-Type": "multipart/form-data" } })
      setModal({ show: false, forEdit: false })
      alert(res.data.message)
      const x = res.data.data
      const editBtn = canEdit ? <Button onClick={() => editLease(x)} size="small" > <Edit color="info" /> </Button> : null
      const deleteBtn = canDelete ? <Button onClick={() => deleteLease(x)} size="small"> <Delete color="error" /> </Button> : null
      setleaseData([...leaseData, {
        ...x,
        action: <>{editBtn} {deleteBtn} </>,
        building: Buildings.filter(building => building._id === x.building).map(b => `${b.code} - ${b.name}`),
        tenant: People.filter(p => p._id === x.tenant).map(p => `${p.code} - ${p.title} ${p.firstName} ${p.middleName} ${p.lastName}`),
        accuntStatus: x.accuntStatus ? 'Yes' : 'No',
        amenities: x.amenities ? 'Yes' : 'No',
        leaseContract: fileButton(x, x.leaseContract),
        identity: fileButton(x, x.identity),
        otherDoc1: fileButton(x, x.otherDoc1),
        otherDoc2: fileButton(x, x.otherDoc2)

      }])
    } catch (err) {
      alert(err?.response?.data?.message)
    }
  }

  const updateLeaseHandler = async () => {
    try {
      const payload = {
        ...modalValue,
        building: selectedBuilding.id,
        tenant: selectedTenant.id,
        unit: selectedUnit.value
      }

      const formData = new FormData();
      Object.keys({ ...payload }).map(x => {
        formData.append(x, payload[x]);
      })

      const res = await axios.put(`lease/${modalValue._id}`, formData, { headers: { "Content-Type": "multipart/form-data" } })
      const data = { ...res.data.data }
      setModal({ show: false, forEdit: false })
      alert(res.data.message)
      setleaseData(leaseData.map(x => x._id === modalValue._id ? {
        ...data,
        building: `${data?.building?.code} - ${data?.building?.name}`,
        tenant: `${data.tenant.code} - ${data.tenant.title} ${data.tenant.firstName} ${data.tenant.middleName} ${data.tenant.lastName}`,
        accuntStatus: data.accuntStatus ? 'Yes' : 'No',
        amenities: data.amenities ? 'Yes' : 'No',
        leaseContract: fileButton(data, data.leaseContract),
        identity: fileButton(data, data.identity),
        otherDoc1: fileButton(data, data.otherDoc1),
        otherDoc2: fileButton(data, data.otherDoc2)
      } : x))

      setSelectedBuilding({
        id: data?.building._id,
        value: `${data?.building?.code} - ${data?.building?.name}`
      })
      setSelectedTenant({
        id: data?.tenant,
        value: `${data.tenant.code} - ${data.tenant.title} ${data.tenant.firstName} ${data.tenant.middleName} ${data.tenant.lastName}`
      })
      setselectedUnit({
        id: 1,
        value: data.unit
      })

    } catch (err) {
      alert(err)
    }
  }

  const onChangeBuilding = (e) => {
    setSelectedBuilding({
      id: 0,
      value: e.target.value
    })
    setselectedUnit({
      id: 0,
      value: ''
    })
  };

  const onSelectBuilding = (val, item) => {
    setSelectedBuilding({
      id: item.key,
      value: val
    })
  };

  const onChangeOwner = (e) => {
    setSelectedTenant({
      id: 0,
      value: e.target.value
    })
  };

  const onSelectOwner = (val, item) => {
    setSelectedTenant({
      id: item.key,
      value: val
    })
  };

  const onChangeUnit = (e) => {
    setselectedUnit({
      id: 0,
      value: e.target.value
    })
  };

  const onSelectUnit = (val, item) => {
    setselectedUnit({
      id: item.key,
      value: val
    })
  };

  const removePic = key => {
    setModalValue({
      ...modalValue,
      [key]: {}
    })
  }

  const buildingAutoList = [];
  Buildings.map((building) => {
    if ((building.name && building?.name?.toLowerCase().includes(selectedBuilding?.value?.toLowerCase())) || (building.code && building?.code?.toLowerCase().includes(selectedBuilding?.value?.toLowerCase()))) {
      buildingAutoList.push({
        label: `${building.code} - ${building.name}`,
        key: building._id,
      });
    }
  });

  const unitsAutoList = [];
  unitList.map((unit) => {
    if ((unit.unitNo && unit.unitNo.toLowerCase().includes(selectedUnit.value.toLowerCase()))) {
      unitsAutoList.push({
        label: unit.unitNo,
        key: unit._id,
      });
    }
  });
  console.log('autolist', unitsAutoList, unitList)
  const tenantAutoList = [];
  People.map((person) => {
    if ((person.code && person.code.toLowerCase().includes(selectedTenant.value.toLowerCase())) ||
      (person.title && person.title.toLowerCase().includes(selectedTenant.value.toLowerCase())) ||
      (person.firstName && person.firstName.toLowerCase().includes(selectedTenant.value.toLowerCase())) ||
      (person.middleName && person.middleName.toLowerCase().includes(selectedTenant.value.toLowerCase())) ||
      (person.lastName && person.lastName.toLowerCase().includes(selectedTenant.value.toLowerCase()))) {
      tenantAutoList.push({
        label: `${person.code} - ${person.title} ${person.firstName} ${person.middleName} ${person.lastName}`,
        key: person._id,
      });
    }
  });

  return (

    <DashboardLayout>
      {userPermissions.includes('list-lease-profiling') ?
        <MDBox pt={1} pb={3}>
          <Grid container spacing={6}>
            {userPermissions.includes('create-lease-profiling') ?
              <Grid item xs={6} md={3}>
                <MDButton
                  size='medium'
                  variant="contained"
                  color='info'
                  onClick={() => { setModal({ show: true, forEdit: false }) }}
                >
                  <Add /> &nbsp;&nbsp; Add Lease
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
                    Lease Table
                  </MDTypography>
                </MDBox>
                <MDBox pt={3}>
                  <DataTable
                    table={{ columns: LeaseColumns, rows: leaseData }}
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
        onHide={() => { setModal({ show: false, forEdit: false }) }}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {modal.forEdit ? 'Updating' : 'Creating New'} Lease
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ backgroundColor: 'ButtonFace' }}>
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
                  onChange={(e) => onChangeOwner(e)}
                  onSelect={(val, item) => onSelectOwner(val, item)}
                />
              </div>
            </div>

            <div className="autocomplete col-12 col-md-12 my-2 row">
              <Form.Label className="mx-4 color-blue">Unit &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Form.Label>
              <div className="autocomplete-container" style={{ position: 'relative', display: 'inline-block', width: '100%', zIndex: 9980 }}>
                <Autocomplete
                  getItemValue={(item) => item.label}
                  items={unitsAutoList}
                  inputProps={{ placeholder: "Search Unit" }}
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
                  value={selectedUnit.value}
                  onChange={(e) => onChangeUnit(e)}
                  onSelect={(val, item) => onSelectUnit(val, item)}
                />
              </div>
            </div>



            <MDInput
              type="date"
              focused
              variant="filled"
              value={modalValue.startDate}
              onChange={(e) => setModalValue({ ...modalValue, startDate: e.target.value })}
              style={{ width: '40%', background: 'white', zIndex: 1 }} // Set a lower z-index here
              label="Start Date"
              color="dark"
            />
            <MDInput
              type="date"
              focused
              variant="filled"
              value={modalValue.endDate}
              onChange={(e) => setModalValue({ ...modalValue, endDate: e.target.value })}
              style={{ marginLeft: '50px', width: '40%', background: 'white', zIndex: 1 }} // Set a lower z-index here
              label="End Date"
              color="dark"
            />

            <Row>
              <div className="mt-2 col-6 px-2" style={{ position: "relative", width: '100%' }}>
                <Form.Label className="col-12 col-md-4 color-blue"> Lease Type: </Form.Label>
                <div style={{ position: "relative", width: "90%", background: "white" }}>
                  <Paper elevation={2}>
                    <Form.Select
                      className="col-12 col-md-8"
                      aria-label="Lease Type"
                      style={{ width: "100%" }}
                      value={modalValue.leaseType}
                      onChange={(e) =>
                        setModalValue({ ...modalValue, leaseType: e.target.value })
                      }
                    >
                      <option key={0} value="Short Term Lease">
                        Short Term Lease
                      </option>
                      <option key={1} value="Long Term Lease">
                        Long Term Lease
                      </option>
                      <option key={2} value="Permanent">
                        Permanent
                      </option>
                    </Form.Select>
                  </Paper>
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: "10px", // Adjust this value as needed for proper positioning
                      transform: "translateY(-50%)",
                    }}
                  >

                    <ArrowDropDown />
                  </div>
                </div>
              </div>
            </Row>

            <Row className="mb-4">
              <div className="mt-2 col-6 px-2" style={{ position: "relative" }}>
                <Form.Label className="col-12 col-md-5 color-blue"> Account Status: </Form.Label>
                <div style={{ position: "relative", width: "80%", background: "white" }}>
                  <Form.Select
                    className="col-9 col-md-5"
                    aria-label="Account Status"
                    style={{ width: "100%" }}
                    value={modalValue.accuntStatus}
                    onChange={(e) => setModalValue({ ...modalValue, accuntStatus: e.target.value })}
                  >
                    <option key={0} value="false">
                      No
                    </option>
                    <option key={1} value="true">
                      Yes
                    </option>
                  </Form.Select>
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: "10px", // Adjust this value as needed for proper positioning
                      transform: "translateY(-50%)",
                    }}
                  >
                    <ArrowDropDown />
                  </div>
                </div>
              </div>
              <div className="mt-2 col-6 px-2" style={{ position: "relative" }}>
                <Form.Label className="col-12 col-md-4 color-blue"> Amenities: </Form.Label>
                <div style={{ position: "relative", width: "80%", background: "white" }}>
                  <Paper elevation={2}>
                    <Form.Select
                      className="col-9 col-md-5"
                      aria-label="Amenities"
                      style={{ width: "100%" }}
                      value={modalValue.amenities}
                      onChange={(e) => setModalValue({ ...modalValue, amenities: e.target.value })}
                    >
                      <option key={0} value="false">
                        No
                      </option>
                      <option key={1} value="true">
                        Yes
                      </option>
                    </Form.Select>
                  </Paper>
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: "10px", // Adjust this value as needed for proper positioning
                      transform: "translateY(-50%)",
                    }}
                  >
                    <ArrowDropDown />
                  </div>
                </div>
              </div>
            </Row>

            <Row>
              <div className="mt-2 col-6 px-2">
                <Button
                  variant="text"
                  component="label"
                >
                  Upload Notarized Lease Contract &nbsp;<UploadFile />
                  <input
                    accept="image/*,application/*"
                    type="file"
                    name="leaseContract"
                    onChange={(event) => {
                      setModalValue({ ...modalValue, leaseContract: event.target.files[0] })
                    }}
                    hidden
                  />
                </Button>
              </div>
              <div className="mt-2 col-6 px-2">
                {(modalValue?.leaseContract?.name || modalValue?.leaseContract?.originalname) && <p style={{ fontSize: '18px', color: 'green' }}> {modalValue?.leaseContract?.name || modalValue?.leaseContract?.originalname} <MDButton size="small" variant="text" className="mx-2" onClick={() => removePic('leaseContract')} ><Cancel color="error" /></MDButton></p>}
              </div>
            </Row>

            <Row>
              <div className="mt-2 col-6 px-2">
                <Button
                  variant="text"
                  component="label"
                >
                  Valid Identity &nbsp;<UploadFile />
                  <input
                    accept="image/*,application/*"
                    type="file"
                    name="identity"
                    onChange={(event) => {
                      setModalValue({ ...modalValue, identity: event.target.files[0] })
                    }}
                    hidden
                  />
                </Button>
              </div>
              <div className="mt-2 col-6 px-2">
                {(modalValue?.identity?.name || modalValue?.identity?.originalname) && <p style={{ fontSize: '18px', color: 'green' }}> {modalValue?.identity?.name || modalValue?.identity?.originalname} <MDButton size="small" variant="text" className="mx-2" onClick={() => removePic('identity')} ><Cancel color="error" /></MDButton></p>}

              </div>
            </Row>

            <Row>
              <div className="mt-2 col-6 px-2">
                <Button
                  variant="text"
                  component="label"
                >
                  Other Document 1 &nbsp;<UploadFile />
                  <input
                    accept="image/*,application/*"
                    type="file"
                    name="otherDoc1"
                    onChange={(event) => {
                      setModalValue({ ...modalValue, otherDoc1: event.target.files[0] })
                    }}
                    hidden
                  />
                </Button>
              </div>
              <div className="mt-2 col-6 px-2">
                {(modalValue?.otherDoc1?.name || modalValue?.otherDoc1?.originalname) && <p style={{ fontSize: '18px', color: 'green' }}> {modalValue?.otherDoc1?.name || modalValue?.otherDoc1?.originalname} <MDButton size="small" variant="text" className="mx-2" onClick={() => removePic('otherDoc1')} ><Cancel color="error" /></MDButton></p>}
              </div>
            </Row>

            <Row>
              <div className="mt-2 col-6 px-2">
                <Button
                  variant="text"
                  component="label"
                >
                  Other Document 2 &nbsp;<UploadFile />
                  <input
                    accept="image/*,application/*"
                    type="file"
                    name="otherDoc2"
                    onChange={(event) => {
                      setModalValue({ ...modalValue, otherDoc2: event.target.files[0] })
                    }}
                    hidden
                  />
                </Button>
              </div>
              <div className="mt-2 col-6 px-2">
                {(modalValue?.otherDoc2?.name || modalValue?.otherDoc2?.originalname) && <p style={{ fontSize: '18px', color: 'green' }}> {modalValue?.otherDoc2?.name || modalValue?.otherDoc2?.originalname} <MDButton size="small" variant="text" className="mx-2" onClick={() => removePic('otherDoc2')} ><Cancel color="error" /></MDButton></p>}
              </div>
            </Row>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <MDButton
            size='small'
            variant="contained"
            color='info'
            onClick={modal.forEdit ? updateLeaseHandler : createLeaseHandler}
          >
            <Create /> &nbsp;&nbsp; {modal.forEdit ? 'Update' : 'Create Unit'}
          </MDButton>
          <Button onClick={() => { setModal({ show: false, forEdit: false }) }}>Close</Button>
        </Modal.Footer>
      </Modal>
    </DashboardLayout>
  );
}

export default Lease;
