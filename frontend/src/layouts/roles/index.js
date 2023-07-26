import React, { useEffect, useState } from 'react';
import { Checkbox, FormControlLabel, Button, TextField, Grid, Card, CardContent, CardHeader, Divider } from '@mui/material';
import axios from 'axios';
import { Delete, Edit } from '@mui/icons-material';
import MDBox from 'components/MDBox';
import DataTable from 'examples/Tables/DataTable';
import { v4 as uuidv4 } from 'uuid';

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
  {
    Header: 'Action',
    accessor: 'action',
    align: 'center',
    width: '80px'
  },
];

export default function Roles() {
  const initialCheckboxes = [
    { label: 'role-list', value: false },
    { label: 'role-create', value: false },
    { label: 'role-edit', value: false },
    { label: 'role-delete', value: false },
    { label: 'owner-list', value: false },
    { label: 'owner-create', value: false },
    { label: 'owner-edit', value: false },
    { label: 'owner-delete', value: false },
  ];

  const [name, setName] = useState('');
  const [checkboxValues, setCheckboxValues] = useState(initialCheckboxes);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [mode, setMode] = useState('Submit'); 


  const handleEdit = (row) => {
    setSelectedRole(row);
    setName(row.name);
  
    const updatedCheckboxes = initialCheckboxes.map((checkbox) => {
      console.log('check.......',checkbox);
      const camelCaseKey = checkbox.label
      .split('-')
      .map((word, index) => (index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
      .join('');
      const value = row[camelCaseKey];
      console.log(`label: ${checkbox.label}, key: ${camelCaseKey}, value: ${value}`);
      return {
        ...checkbox,
        value,
      };
    });
    setCheckboxValues(updatedCheckboxes);
    setMode('Update');
  };
  
  
  
  

  const handleCancelEdit = () => {
    setSelectedRole(null);
    setName('');
    setCheckboxValues(initialCheckboxes.map((checkbox) => ({ ...checkbox, value: false })));
    setMode('Submit'); // Set mode back to 'Submit' when cancelling the edit
  };

  const handleDelete =  (row) => {
    axios.delete(`/roles/role/${row._id}`)
      .then(async (response) => {
        const res = await axios.get('/roles/role');
      console.log(response.data.data);
      setRoles(res.data.data.map((x, index) => {
        const editBtn = (
          <Button size="medium" onClick={() => handleEdit(x)}>
            <Edit color="info" />
          </Button>
        );
        const deleteBtn = <Button size="medium" onClick={() => handleDelete(x)}> <Delete color="error" /> </Button>;
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
  };
  const fetchData = async () => {
    try {
      const response = await axios.get('/roles/role');
      console.log(response.data.data);
      setRoles(response.data.data.map((x, index) => {
        const editBtn = (
          <Button size="medium" onClick={() => handleEdit(x)}>
            <Edit color="info" />
          </Button>
        );
        const deleteBtn = <Button size="medium" onClick={() => handleDelete(x)}> <Delete color="error" /> </Button>;
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

  useEffect(() => {
    fetchData();
  }, []);

  

  const handleUpdate = () => {
    const rolesData = {};
    checkboxValues.forEach((checkbox) => {
      const formattedLabel = checkbox.label.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
      console.log(`label: ${checkbox.label}, formattedLabel: ${formattedLabel}, value: ${checkbox.value}`);
    
      rolesData[formattedLabel] = checkbox.value;
      console.log('roelsdata',rolesData);
    });
    

    const formData = {
      name,
      roles: rolesData,
    };

    axios.patch(`/roles/role/${selectedRole._id}`, formData) 
      .then((response) => {
        console.log(response.data);
        fetchData(); // Refetch the data after successful update
        setSelectedRole(null); // Clear the selected role after update
        setName(''); // Clear the name input field after update
        setCheckboxValues(initialCheckboxes.map((checkbox) => ({ ...checkbox, value: false }))); // Clear checkbox values after update
      })
      .catch((error) => {
        console.error(error);
      });
  };



  const handleInputChange = (event) => {
    setName(event.target.value);
  };

  const handleCheckboxChange = (label) => (event) => {
    const updatedCheckboxes = checkboxValues.map((checkbox) =>
      checkbox.label === label ? { ...checkbox, value: event.target.checked } : checkbox
    );
    setCheckboxValues(updatedCheckboxes);
    console.log('updated checkbox', updatedCheckboxes);
  };

  const handleSubmit = () => { 
    const rolesData = {};
    checkboxValues.forEach((checkbox) => {
      rolesData[checkbox.label] = checkbox.value;
    });

    const formData = {
      name,
      roles: rolesData,
    };
    console.log('form', formData);
    axios.post('roles/',formData
    )
      .then((response) => {
        console.log(response.data);
        fetchData();
        setSelectedRole(null);
        setName('');
        setCheckboxValues(initialCheckboxes.map((checkbox) => ({ ...checkbox, value: false })));
        setMode('Submit'); // Set mode back to 'Submit' after successful update/submit
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Grid container justifyContent="center">
      <Card sx={{ my: 4, marginLeft: '120px' }}>
        <CardHeader title={mode === 'Submit' ?"Create Role" : "Update Role"} />
        <Divider />
        <CardContent>
          <form>
            <TextField
              label="Name"
              value={name}
              onChange={handleInputChange}
            />
              <Divider />
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              {checkboxValues.map((checkbox) => (
                <FormControlLabel
                  key={uuidv4()} 
                  control={
                    <Checkbox
                      checked={checkbox.value}
                      onChange={handleCheckboxChange(checkbox.label)}
                    />
                  }
                  label={checkbox.label}
                />
              ))}
            </div>
            <Divider />
           <Button variant="contained" color="white"  onClick={mode === 'Submit' ? handleSubmit : handleUpdate}>
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
        <Divider />
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
  );
}
