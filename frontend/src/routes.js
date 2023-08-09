
/** 
  All of the routes for the Material Dashboard 2 React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import Buildings from "layouts/building";
import CreateBuilding from 'layouts/building/components/createBuilding'
import Billing from "layouts/billing";
// import RTL from "layouts/rtl";
import People from "layouts/people";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import Units from "layouts/Units";
import Lease from "layouts/lease";
import AllUsers from "layouts/Users";
import Roles from "layouts/roles";
import Amenity from "layouts/amenity";
// @mui icons
import Icon from "@mui/material/Icon";
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import DryIcon from '@mui/icons-material/Dry';
import Announcement from "layouts/announcements";
import CampaignIcon from '@mui/icons-material/Campaign';
import EngineeringIcon from '@mui/icons-material/Engineering';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import Occupants from "layouts/occupants";
import OccupantRequests from "layouts/occupants/OccupantsRequest";
import Representatives from "layouts/Representators";
import RepresentativesList from "layouts/Representators/RepresentativeList";
import Visitors from "layouts/visitors";
import VisitorList from "layouts/visitors/VisitorsList";
import VisitorsCardList from "layouts/visitors/VisitorsCardList";
import SyncAltIcon from '@mui/icons-material/SyncAlt';


const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
 
  {
    type: "collapse",
    name: "Create Building",
    key: "createBuilding",
    icon: <Icon fontSize="small">plus</Icon>,
    route: "/create-building",
    visibility: 'hidden',
    component: <CreateBuilding />,
  },
  {
    type: "collapse",
    name: "People",
    key: "users",
    icon: <Icon fontSize="small">people</Icon>,
    route: "/users",
    component: <People />,
    permissions: ['owner-list', 'tenants-list']
  },
  {
    type: "collapse",
    name: "Units",
    key: "units",
    icon: <Icon fontSize="small">ac_unit</Icon>,
    route: "/units",
    component: <Units />,
    permissions: ['list-units']
  },
  {
    type: "collapse",
    name: "Buildings",
    key: "buildings",
    icon: <Icon fontSize="small">apartment</Icon>,
    route: "/buildings",
    component: <Buildings />,
    permissions: ['list-buildings'],
  },
  {
    type: "collapse",
    name: "Lease Profiling",
    key: "lease",
    icon: <Icon fontSize="small">money</Icon>,
    route: "/lease-profiling",
    component: <Lease />,
    permissions: ['list-lease-profiling']
  },
  // {
  //   type: "collapse",
  //   name: "Billing",
  //   key: "billing",
  //   icon: <Icon fontSize="small">receipt_long</Icon>,
  //   route: "/billing",
  //   component: <Billing />,
  // },
  {
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
  },
  {
    route: "/all-users",
    type: 'collapse',
    name: "Users",
    component: <AllUsers />,
    key: "all-users",
    icon: <Icon fontSize="small">people</Icon>,
   },
  {
    route: "/roles",
    type: 'collapse',
    name: "Manage Roles",
    component: <Roles />,
    key: "roles",
    icon: < FingerprintIcon fontSize="small" />,
    permissions: ['role-list']
   },
  {
    route: "/amenity",
    type: 'collapse',
    name: "Manage Amenities",
    component: <Amenity />,
    key: "amenity",
    icon: < DryIcon fontSize="small" />,
    permissions: ['list-amenities']
   },
  {
    route: "/annoucements",
    type: 'collapse',
    name: "Manage Annoucemnets",
    component: <Announcement />,
    key: "anoucements",
    icon: <CampaignIcon fontSize="small" />,
    permissions: ['list-announcements']
   },
  {
    route: "/occupants",
    type: 'collapse',
    name: "Manage Occupants",
    component: <Occupants />,
    key: "occupant",
    icon: <EngineeringIcon fontSize="small" />,
   },
  {
    route: "/occupants/requests",
    type: 'collapse',
    name: "Occupant Requests",
    component: <OccupantRequests />,
    key: "Requests",
    icon: <EngineeringIcon fontSize="small" />,
   },
  {
    route: "/representatives",
    type: 'collapse',
    name: "Representatives",
    component: <Representatives />,
    key: "Representatives",
    icon: <SupervisedUserCircleIcon fontSize="small" />,
   },
  {
    route: "/representatives/list",
    type: 'collapse',
    name: "All Representatives",
    component: <RepresentativesList />,
    key: "representativesList",
    icon: <SupervisedUserCircleIcon fontSize="small" />,
   },
  {
    route: "/visitors",
    type: 'collapse',
    name: "Manage Visitors",
    component: <Visitors />,
    key: "visitors",
    icon: <SyncAltIcon fontSize="small" />,
   },
  {
    route: "/visitors/list",
    type: 'collapse',
    name: "Visitors List",
    component: <VisitorList />,
    key: "visitorsList",
    icon: <SyncAltIcon fontSize="small" />,
   },
  {
    route: "/cards/list",
    type: 'collapse',
    name: "Visitor Cards List",
    component: <VisitorsCardList />,
    key: "visitorCards",
    icon: <SyncAltIcon fontSize="small" />,
   },
    {
      type: "collapse",
      name: "Sign In",
      key: "sign-in",
      visibility: 'hidden',
      icon: <Icon fontSize="small">login</Icon>,
      route: "/sign-in",
      component: <SignIn />,
    },
    
  // {
  //   type: "collapse",
  //   name: "Sign Up",
  //   key: "sign-up",
  //   icon: <Icon fontSize="small">assignment</Icon>,
  //   route: "/sign-up",
  //   component: <SignUp />,
  // },

 
];

export default routes;
