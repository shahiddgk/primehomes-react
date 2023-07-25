import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import Tooltip from '@mui/material/Tooltip';
import Icon from '@mui/material/Icon';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import { io } from 'socket.io-client';
import axios from 'axios';

function ProfileInfoCard({ title, info, action, shadow }) {
  const [editMode, setEditMode] = useState(false);
  const [formValues, setFormValues] = useState(() => {
    const userInfoFromStorage = sessionStorage.getItem('userInfo');
    return userInfoFromStorage ? JSON.parse(userInfoFromStorage) : info;
  });
  const labels = Object.keys(info);

  useEffect(() => {
    const userId = sessionStorage.getItem('userId');
    const socket = io.connect(`http://192.168.10.19:4003?userId=${userId}`);
    socket.on('updatedUser', (data) => {
      setFormValues(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleUpdate = () => {
    setEditMode(true);
  };

  const handleChange = (event, label) => {
    setFormValues((prevFormValues) => ({ ...prevFormValues, [label]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const { fullName: name, email, mobile } = formValues;
      const response = await axios.put('users/profile', { name, email, mobile });
      console.log(response.data);

      sessionStorage.setItem('userInfo', JSON.stringify(formValues));

      // Update the 'info' prop with the new values received from the server
      const updatedInfo = { ...info, ...formValues };
      setEditMode(false);
      setFormValues(updatedInfo);


    } catch (error) {
      console.error('Error updating user information:', error);
    }
  };

  const renderForm = (
    <Card sx={{ height: '100%', boxShadow: !shadow && 'none' }}>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" pt={2} px={2}>
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          Update Profile
        </MDTypography>
      </MDBox>
      <MDBox p={2}>
        <MDBox sx={{ mx: 'auto', textAlign: 'center', my: '2' }}>
          <form onSubmit={handleSubmit}>
            {labels.map((label) => (
              <TextField
                key={`label-${label}`}
                margin="normal"
                sx={{ width: '75%' }}
                required
                id={`outlined-required-${label}`}
                label={label}
                value={formValues[label] || ''}
                onChange={(event) => handleChange(event, label)}
              />
            ))}
            <br />
            <Box textAlign="left" marginLeft="100px">
              <Button type="submit" variant="contained" color="white">
                Submit
              </Button>
            </Box>
          </form>
        </MDBox>
      </MDBox>
    </Card>
  );

  const renderInfoCard = (
    <Card sx={{ height: '100%', boxShadow: !shadow && 'none' }}>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" pt={2} px={2}>
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          {title}
        </MDTypography>
        <MDTypography
          component={Link}
          to={action.route}
          variant="body2"
          color="secondary"
          onClick={handleUpdate}
        >
          <Tooltip title={action.tooltip} placement="top">
            <Icon>edit</Icon>
          </Tooltip>
        </MDTypography>
      </MDBox>
      <MDBox p={2}>
        <MDBox>
          {labels.map((label) => (
            <MDBox key={label} display="flex" py={1} pr={2}>
              <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                {label}: &nbsp;
              </MDTypography>
              <MDTypography variant="button" fontWeight="regular" color="text">
                &nbsp;{formValues[label]}
              </MDTypography>
            </MDBox>
          ))}
        </MDBox>
      </MDBox>
    </Card>
  );

  return <div>{editMode ? renderForm : renderInfoCard}</div>;
}

ProfileInfoCard.defaultProps = {
  shadow: true,
};

ProfileInfoCard.propTypes = {
  title: PropTypes.string.isRequired,
  info: PropTypes.objectOf(PropTypes.string).isRequired,
  action: PropTypes.shape({
    route: PropTypes.string.isRequired,
    tooltip: PropTypes.string.isRequired,
  }).isRequired,
  shadow: PropTypes.bool,
};

export default ProfileInfoCard;
