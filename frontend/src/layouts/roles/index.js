import React, { useEffect, useState } from 'react';
import { Checkbox, FormControlLabel, Button, TextField, Grid, Card, CardContent, CardHeader, Divider } from '@mui/material';
import axios from 'axios';
import { Delete, Edit } from '@mui/icons-material';
import MDBox from 'components/MDBox';
import DataTable from 'examples/Tables/DataTable';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';
import toastr from 'toastr';
import { usePermissions } from 'PermissionsProvider';
import AccessDeniedMessage from 'layouts/authentication/components/BasicLayout/AccessDenied';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';


export default function Roles() {
  const [name, setName] = useState('');
  const [checkboxValues, setCheckboxValues] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [mode, setMode] = useState('Submit');
  const [permissions, setPermissions] = useState([]);
  const [permissionsFetching, setPermissionsFetching] = useState(false);
  const userPermissions = usePermissions();

  const canEdit = userPermissions.includes('edit-role');
  const canDelete = userPermissions.includes('delete-role');

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
    ...(userPermissions.includes('edit-role') || userPermissions.includes('delete-role')
    ? [
        {
          Header: 'Action',
          accessor: 'action',
          align: 'center',
          width: '80px'
        },
      ]
    : []),
  ];



  const convertToLabelFormat = (str) => {
    return str
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  const convertToAPIFormat = (str) => {
    return str.toLowerCase().replace(/\s+/g, '-');
  };

  const fetchPermissions = async () => {
    try {
      setPermissionsFetching(true); // Set permissionsFetching to true while fetching permissions

      const response = await axios.get('roles/permissions');
      const formattedPermissions = response.data.data.map((permission) => ({
        label: convertToLabelFormat(permission.name),
        value: false,
      }));
      setPermissions(formattedPermissions);

      // Initialize checkboxValues with default values based on permissions
      const initialCheckboxValues = formattedPermissions.map((permission) => ({
        label: permission.label,
        value: false,
      }));
      setCheckboxValues(initialCheckboxValues);

      setPermissionsFetching(false); // Permissions fetched successfully, set permissionsFetching to false
    } catch (error) {
      console.log('Error fetching permissions:', error);
      setPermissionsFetching(false); // In case of an error, also set permissionsFetching to false
    }
  };

  const handleEdit = async (row) => {
    setSelectedRole(row);
    setName(row.name);
    await fetchPermissions();

    // Check if "row.permissions" exists and is an array before proceeding
    const updatedPermissions = permissions.map((permission) => ({
      label: permission.label,
      value: row.permissions && row.permissions.includes(convertToAPIFormat(permission.label)),
    }));
    setPermissions(updatedPermissions);
    setMode('Update');
  };

  const handleDelete = (row) => {
    Swal.fire({
      title: `Are You Sure To Delete The Role?
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
        try {
          axios.delete(`/roles/role/${row._id}`)
            .then(async (response) => {
              Swal.fire('Deleted!', `${response.data.message}`, 'success');
              const res = await axios.get('/roles/role');
              console.log(response.data.data);
              setRoles(res.data.data.map((x, index) => {
                const editBtn = canEdit ? (
                  <Button size="medium" onClick={() => handleEdit(x)}>
                    <Edit color="info" />
                  </Button>
                ) : null;
                const deleteBtn = canDelete? <Button size="medium" onClick={() => handleDelete(x)}> <Delete color="error" /> </Button> : null;
                return {
                  ...x,
                  index: index + 1,
                  name: x.name,
                  action: <>{editBtn} {deleteBtn} </>
                };
              }));
            })
            .catch((error) => {
              console.error(error);
            });
        }
        catch (error) {
          toastr.clear();
          toastr.error(error?.response?.data?.message);
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Your Data Is Safe :)', 'error');
      }
    })
  }
  const fetchData = async () => {
    try {
      const response = await axios.get('/roles/role');
      console.log(response.data.data);
      setRoles(response.data.data.map((x, index) => {
        const editBtn = canEdit? (
          <Button size="medium" onClick={() => handleEdit(x)}>
            <Edit color="info" />
          </Button>
        ) : null;
        const deleteBtn = canDelete? <Button size="medium" onClick={() => handleDelete(x)}> <Delete color="error" /> </Button> : null;
        return {
          ...x,
          index: index + 1,
          name: x.name,
          action: <>{editBtn} {deleteBtn} </>
        };
      }));
    } catch (error) {
      console.log('Error fetching roles:', error);
    }
  };
  const handleCancelEdit = () => {
    fetchData();
    fetchPermissions();
    setSelectedRole(null);
    setName('');
    setCheckboxValues(permissions.map((permission) => ({ label: permission.name, value: false })));
    setMode('Submit');
  };

  useEffect(() => {
    fetchData();
    fetchPermissions();
  }, []);

  const handleCheckboxChange = (label) => (event) => {
    const updatedPermissions = permissions.map((permission) =>
      permission.label === label ? { ...permission, value: event.target.checked } : permission
    );
    setPermissions(updatedPermissions);
  };

  const handleUpdate = () => {
    const rolesData = {};
    permissions.forEach((permission) => {
      rolesData[convertToAPIFormat(permission.label)] = permission.value;
    });

    const formData = {
      name,
      permissions: Object.keys(rolesData).filter((key) => rolesData[key] === true),
    };

    axios
      .patch(`/roles/role/${selectedRole._id}`, formData)
      .then((response) => {
        console.log(response.data);
        fetchData();
        fetchPermissions();
        setSelectedRole(null);
        setName('');
        setMode('Submit');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleInputChange = (event) => {
    setName(event.target.value);
  };



  const handleSubmit = () => {
    const formData = {
      name,
      permissions: permissions
        .filter((permission) => permission.value === true)
        .map((permission) => convertToAPIFormat(permission.label)),
    };

    axios
      .post('roles/', formData)
      .then((response) => {
        console.log(response.data);
        if (response.status === 200) {
          Swal.fire('Created', `${response.data.message}`, 'success');
        }

        fetchData();
        fetchPermissions();
        setSelectedRole(null);
        setName('');
        setMode('Submit');
      })
      .catch((error) => {
        console.error(error);
      });
  };


  return (
    <DashboardLayout>
    <DashboardNavbar />
    <Grid container spacing={6}>
      
{  userPermissions.includes('role-list') ?
    <Grid item xs={12} height='80vh'>
  <Card sx={{ my: 4, marginLeft: '120px', maxWidth: '65%' }}>
{userPermissions.includes('create-role') ? 
       <> <CardHeader title={mode === 'Submit' ? "Create Role" : "Update Role"} />
        <Divider />

       <CardContent>
          <form>
            <TextField
              label="Name"
              value={name}
              onChange={handleInputChange}
            />
            <Divider />
            <div>
              {permissionsFetching ? (
                <div>Loading permissions...</div>
              ) : (
                <Grid container spacing={2}>
                  {permissions.map((permission) => (
                    <Grid item xs={6} sm={6} lg={4} xl={4} spacing={2} key={uuidv4()}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={permission.value}
                            onChange={handleCheckboxChange(permission.label)}
                          />
                        }
                        label={permission.label}
                      />
                    </Grid>
                  ))}
                </Grid>
              )}
            </div>
            <Divider />
            <Button variant="contained" color="white" style={{ marginRight: '20px' }} onClick={mode === 'Submit' ? handleSubmit : handleUpdate}>
              {mode === 'Submit' ? 'Submit' : 'Update'} {/* Toggle button text based on mode */}
            </Button>
            {mode === 'Update' && (
              <Button variant="contained" color="error" onClick={handleCancelEdit}>
                Cancel {/* Show "Cancel" button when in update mode */}
              </Button>
            )}
          </form>
        </CardContent> 
        <Divider />
        <Divider /> </>: null}
        <MDBox pt={3}>
          <DataTable
            table={{ columns: PeopleColumn, rows: roles }}
            isSorted
            entriesPerPage={false}
            showTotalEntries
            pagination
          />
        </MDBox>
      </Card>
    </Grid>
      : <AccessDeniedMessage />
}
</Grid>
   </DashboardLayout>
  );
}
