import { useEffect, useState } from "react";
// @mui material components
import Grid from "@mui/material/Grid";
import { Box, Card, CardContent, Typography, makeStyles } from "@mui/material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";
import moment from "moment";
// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import SlidingCard from "examples/Cards/SlidingCards";
import axios from '../../config/server.config';


function Dashboard() {
  const [dashboard, setDashboard] = useState({
    Buildings: [],
    Units: [],
    People: [],
    Lease: []
  })
  const [notificationCount, setNotificationCount] = useState('')
  const [notificationList, setNotificationList] = useState([])
  const { sales, tasks } = reportsLineChartData;
  useEffect(() => {
    const getDashboard = async () => {
      try {
        const res = await axios.get('users/dashboard')
        setDashboard(res.data.data)
      } catch (err) {
        console.log(err);
      }
    }
    getDashboard()
  }, [])

  useEffect(() => {
    const user = sessionStorage.getItem('data');
    const data = JSON.parse(user)
    if (data.userData.type === 'Tenant' || data.userData.type === 'Owner') {
      const { userData: { email } } = JSON.parse(user);
      console.log(email);
      axios.get(`people/type/${email}`)
        .then(async response => {
          sessionStorage.setItem('userId', response?.data?.data?._id);
          const notifications = await axios.get('notifications/');
          const notificationsCount = await axios.get('notifications/count');
          console.log('dashboar', notificationsCount.data.data);
          setNotificationCount(notificationsCount.data.data);
          setNotificationList(notifications.data.data);
        })
        .catch(error => console.error('Error fetching user data:', error));
    }
    else {
      const { userData: { email } } = JSON.parse(user);
      console.log(email);
      axios.get(`users/user/${email}`)
        .then(async response => {
          sessionStorage.setItem('userId', response.data.data._id);
          const notifications = await axios.get('notifications/');
          const notificationsCount = await axios.get('notifications/count');
          setNotificationCount(notificationsCount.data.data);
          setNotificationList(notifications.data.data);
        })
        .catch(error => console.error('Error fetching user data:', error));
    }
  }, []);

  console.log("dashboard", dashboard);
  const { Buildings, Units, People, Lease } = dashboard

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {notificationList.length !== 0 ?
        <MDBox mt={4.5} sx={{ overflowX: 'hidden' }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={12}>
              <MDBox mb={3}>
                <Card sx={{ display: 'flex', overflowX: 'hidden', my: 'auto' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ my: 'auto' }}>
                      <div className="slider-container my-auto">
                        {notificationList.map((data) => (
                          <>
                            <SlidingCard key={Date.now()} data={data} />
                            {console.log('data', data)}
                          </>
                        ))}
                      </div>
                    </CardContent>
                  </Box>
                </Card>
              </MDBox>
            </Grid>
            {/* <Grid item xs={12} md={6} lg={2}>
       <MDBox mb={3}>
         <ReportsLineChart
           color="success"
           title="daily sales"
           description={
             <>
               (<strong>+15%</strong>) increase in today sales.
             </>
           }
           date="updated 4 min ago"
           chart={sales}
         />
       </MDBox>
     </Grid>
     <Grid item xs={12} md={6} lg={2}>
       <MDBox mb={3}>
         <ReportsLineChart
           color="dark"
           title="completed tasks"
           description="Last Campaign Performance"
           date="just updated"
           chart={tasks}
         />
       </MDBox>
     </Grid> */}
          </Grid>
        </MDBox> : null
      }
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="apartment"
                title="Buildings"
                count={Buildings.length}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="leaderboard"
                title="Units"
                count={Units.length}
                percentage={{
                  color: "success",
                  amount: Units.filter(x => moment(x.createdAt).isSameOrAfter(moment().subtract(1, 'month'))).length,
                  label: "in last month",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="store"
                title="Owners"
                count={People.filter(x => x.type === 'Owner').length}
              // percentage={{
              //   color: "success",
              //   amount: 5,
              //   label: "than yesterday",
              // }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Tenants"
                count={People.filter(x => x.type === 'Tenant').length}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Updated",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="warning"
                icon="payment"
                title="Total Lease Properties"
                count={Lease.length}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Updated",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>



        {/* <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Projects />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <OrdersOverview />
            </Grid>
          </Grid>
        </MDBox> */}
      </MDBox>
    </DashboardLayout>
  );
}

export default Dashboard;
