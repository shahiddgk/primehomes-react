import { useState } from "react";
import { useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton"


// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";
// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import axios from "../../../config/server.config";

function Basic() {
  const navigate = useNavigate()
  const [rememberMe, setRememberMe] = useState(false);
  const [data, setData] = useState({ email: '' , password: '' })

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const signInHandler = async () => {
    if (data.email === 'sohail@gmail.com') {
      try{
        const res = await axios.post('users/login', {
          email: data.email,
          password: data.password
        })
        console.log(res);
        alert(res?.data?.message)
        sessionStorage.setItem("data", JSON.stringify(res.data.data));
        const userinfo = res.data.data.userInfo
        const newUser = {
          fullName: userinfo.name,
          email:userinfo.email,
          mobile: userinfo.mobile
        }
        console.log('new User==',newUser);
        sessionStorage.setItem("userInfo", JSON.stringify(newUser));
        axios.defaults.headers.common = {'Authorization': `bearer ${res?.data?.data?.token}`}
        navigate('/')
        return
      }catch(err){
        alert(err?.response?.data?.message)
      }
    }
    else{
      try{
        const res = await axios.post('people/login', {
          email: data.email,
          password: data.password
        })
        console.log(res);
        alert(res?.data?.message)
        sessionStorage.setItem("data", JSON.stringify(res.data.data));
        const userinfo = res.data.data.userInfo
        const newUser = {
          fullName: userinfo.name,
          email:userinfo.email,
          mobile: userinfo.mobile
        }
        console.log('new User==',newUser);
        sessionStorage.setItem("userInfo", JSON.stringify(newUser));
        axios.defaults.headers.common = {'Authorization': `bearer ${res?.data?.data?.token}`}
        navigate('/')
  
      }catch(err){
        alert(err?.response?.data?.message)
      }
    }
 
  }

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign in
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput type="email" value={data.email} onChange={(e) => setData({...data, email: e.target.value})} label="Email" fullWidth />
            </MDBox>
            <MDBox mb={2}>
              <MDInput type="password" value={data.password} onChange={(e) => setData({...data, password: e.target.value})} label="Password" fullWidth />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Remember me
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" onClick={signInHandler}  fullWidth>
                sign in
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
