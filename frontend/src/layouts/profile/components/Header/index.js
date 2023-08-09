
import { useState, useEffect, useRef } from "react";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";

// Material Dashboard 2 React base styles
import breakpoints from "assets/theme/base/breakpoints";

// Images
import burceMars from "assets/images/bruce-mars.jpg";
import backgroundImage from "assets/images/bg-profile.jpeg";
import { Typography } from "@mui/material";
import axios from "axios";
import { RotatingLines } from "react-loader-spinner";
import { io } from 'socket.io-client';

function Header({ children, name, role, image, email }) {
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [tabValue, setTabValue] = useState(0);
  const [loader, setLoader] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [updatedName, setUpdatedName] = useState('')
const [type, setType] = useState('')

  const fileInputRef = useRef(null);
  useEffect(() => {
    const user = sessionStorage.getItem('data');
    const userData = JSON.parse(user)
    setType(userData.userData.type)
    

    const userId = sessionStorage.getItem('userId');
    const socket = io.connect(`http://192.168.10.24:4003?userId=${userId}`);
    socket.on('updatedUser', (data) => {
      setUpdatedName(data[0]); // Update the form values with the data received from the socket

    });

    return () => {
      socket.disconnect(); // Clean up the socket connection on component unmount
    };
  }, []);
  useEffect(() => {
    // A function that sets the orientation state of the tabs.
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.sm
        ? setTabsOrientation("vertical")
        : setTabsOrientation("horizontal");
    }

    /** 
     The event listener that's calling the handleTabsOrientation function when resizing the window.
    */
    window.addEventListener("resize", handleTabsOrientation);

    // Call the handleTabsOrientation function to set the state with the initial value.
    handleTabsOrientation();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleTabsOrientation);
  }, [tabsOrientation]);

  const handleImageUpload = () => {
    // Access the file input element and trigger the file dialog
    fileInputRef.current.click();
  };



  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    console.log(file);
    const formData = new FormData();
    formData.append('avatar', file);
    formData.append('email', email)
    console.log(formData.get('avatar'));
    console.log(formData.get('email'));
    try {
      setLoader(true)
      const response = await axios.post('users/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data.data.imageUrl);
      setImageUrl(response.data.data.imageUrl);
      setLoader(false)
      // Handle response or update state as needed

    } catch (error) {
      console.error('Error uploading image:', error);
      // Handle error as needed
    }

  };

  const handleSetTabValue = (event, newValue) => setTabValue(newValue);

  return (
    <MDBox position="relative" mb={5}>
      <MDBox
        display="flex"
        alignItems="center"
        position="relative"
        minHeight="18.75rem"
        borderRadius="xl"
        sx={{
          backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
            `${linearGradient(
              rgba(gradients.info.main, 0.6),
              rgba(gradients.info.state, 0.6)
            )}, url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "50%",
          overflow: "hidden",
        }}
      />
      <Card
        sx={{
          position: "relative",
          mt: -8,
          mx: 3,
          py: 2,
          px: 2,
        }}
      >
        <Grid container spacing={3} alignItems="center">
        {(type === 'Tenant' || type === 'Owner')? null :  <Grid item>
          {loader ? <div style={{ marginRight: '100%', display: 'inline-block' }}>
                <RotatingLines
                  strokeColor="black"
                  strokeWidth="5"
                  animationDuration="0.75"
                  width="65"
                  visible

                /></div> :
          <div className="profile-pic">
              <Typography className="label" htmlFor="file" onClick={handleImageUpload}>
                <span className="glyphicon glyphicon-camera" />
                <span>Change</span>
              </Typography>
              <input type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
              />
             <MDAvatar src={imageUrl ? imageUrl : image} alt="profile-image" className="profile-image" size="xl" shadow="sm" />
            </div>}

          </Grid>}
          <Grid item>
            <MDBox height="100%" mt={0.5} lineHeight={1}>
              <MDTypography variant="h5" fontWeight="medium">
                {updatedName ? updatedName : name}
              </MDTypography>
              <MDTypography variant="button" color="text" fontWeight="regular">
                {role}
              </MDTypography>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={4} sx={{ ml: "auto" }}>
            <AppBar position="static">
              <Tabs orientation={tabsOrientation} value={tabValue} onChange={handleSetTabValue}>
                <Tab
                  label="App"
                  icon={
                    <Icon fontSize="small" sx={{ mt: -0.25 }}>
                      home
                    </Icon>
                  }
                />
                <Tab
                  label="Message"
                  icon={
                    <Icon fontSize="small" sx={{ mt: -0.25 }}>
                      email
                    </Icon>
                  }
                />
                <Tab
                  label="Settings"
                  icon={
                    <Icon fontSize="small" sx={{ mt: -0.25 }}>
                      settings
                    </Icon>
                  }
                />
              </Tabs>
            </AppBar>
          </Grid>
        </Grid>
        {children}
      </Card>
    </MDBox>
  );
}

// Setting default props for the Header
Header.defaultProps = {
  children: "",
  name: "",
  role: "",
  image: "",
  email: ''
};

// Typechecking props for the Header
Header.propTypes = {
  name: PropTypes.string,
  role: PropTypes.string,
  image: PropTypes.string,
  email: PropTypes.string,
  children: PropTypes.node,
};

export default Header;
