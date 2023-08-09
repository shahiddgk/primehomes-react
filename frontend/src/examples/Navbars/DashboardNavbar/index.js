import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { AppBar, Toolbar, IconButton, Menu, MenuItem, Avatar, Badge } from "@mui/material";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import Breadcrumbs from "examples/Breadcrumbs";
import NotificationItem from "examples/Items/NotificationItem";
import { navbar, navbarContainer, navbarRow, navbarIconButton, navbarMobileMenu } from "examples/Navbars/DashboardNavbar/styles";
import { useMaterialUIController, setTransparentNavbar, setMiniSidenav, setOpenConfigurator } from "context";
import axios from "axios";
import { io } from 'socket.io-client';
import Swal from "sweetalert2";
import NotificationModal from "./NotificationModel"; 

function DashboardNavbar({ absolute, light, isMini }) {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator, darkMode } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const route = useLocation().pathname.split("/").slice(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const [avatar, setAvatar] = useState('');
  const [userId, setUserId] = useState('');
const [notificationCount, setNotificationCount] = useState('')
const [notificationList, setNotificationList] = useState([])
const [openNotificationModal, setOpenNotificationModal] = useState(false);
const [selectedNotification, setSelectedNotification] = useState(null);
const [modalOpen, setModalOpen] = useState(false);




  useEffect(() => {
    const user = sessionStorage.getItem('data');
    const { userData: { email } } = JSON.parse(user);
    console.log(email);
    axios.get(`users/user/${email}`)
      .then(async response => {
        setAvatar(response.data.data.imageUrl);
        setUserId(response.data.data._id);
        sessionStorage.setItem('userId', response.data.data._id);
        const notifications = await axios.get('notifications/');
        const notificationsCount = await axios.get('notifications/count');
        setNotificationCount(notificationsCount.data.data);
        setNotificationList(notifications.data.data);
      })
      .catch(error => console.error('Error fetching user data:', error));
  }, []);

  useEffect(() => {
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    window.addEventListener("scroll", handleTransparentNavbar);
    handleTransparentNavbar();

    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);

  useEffect(() => {
    const socket = io.connect(`http://192.168.10.24:4003?userId=${userId}`);

    socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    socket.on('updatedProfile', (data) => {
      setAvatar(data);
      console.log('this is image', data);
    });

    socket.on('updateNotificationCount', (data) => {
      setNotificationCount(data.Notification)
    });
    socket.on('updateNotificationList', (data) => {
      setNotificationList(data)
    });

  
    return () => {
      socket.disconnect();
    };
  }, [userId]);



  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleNotificationItemClick = (notification) => {
    setOpenMenu(false)
    setSelectedNotification(notification);
    setOpenNotificationModal(true);
  };
  const menuId = 'primary-search-account-menu';
  const profileMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <Link to="/profile">
        <MenuItem>Profile</MenuItem>
      </Link>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const handleModalClose = () => {
    setOpenNotificationModal(false); 
  };

  const handleMarkAsRead = async () => {
    try {
      setOpenNotificationModal(false)
      await axios.patch(`/notifications/${selectedNotification._id}`);
      Swal.fire('Success', 'Notification marked as read', 'success');
        const notifications = await axios.get('notifications/');
        const notificationsCount = await axios.get('notifications/count');
        setNotificationCount(notificationsCount.data.data);
        setNotificationList(notifications.data.data);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      Swal.fire('Error', 'An error occurred while marking notification as read', 'error');
    }
  };

  const handleDelete = () => {
    setOpenNotificationModal(false)
    Swal.fire({
      title: 'Confirm Deletion',
      text: 'Are you sure you want to delete this notification?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'sweetalert-popup',
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/notifications/${selectedNotification._id}`);
          Swal.fire('Success', 'Notification deleted', 'success');
               const notifications = await axios.get('notifications/');
        const notificationsCount = await axios.get('notifications/count');
        setNotificationCount(notificationsCount.data.data);
        setNotificationList(notifications.data.data);
           } catch (error) {
          console.error("Error deleting notification:", error);
          Swal.fire('Error', 'An error occurred while deleting notification', 'error');
        }
      } else {
        // Display a SweetAlert to inform the user that their data is safe
        Swal.fire('Cancelled', 'Your data is safe', 'info');
      }
    });
  };
  

  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ mt: 2 }}
    >
      
      {notificationList.map((notification) => (
      <MenuItem
        key={notification.notification.title + Date.now()}
        onClick={() => handleNotificationItemClick(notification)}
      >
        {notification.notification.title}
      </MenuItem>
    ))}
      
    </Menu>
  );

  const iconsStyle = ({ palette: { dark, white, text }, functions: { rgba } }) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;

      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
      }

      return colorValue;
    },
  });




  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light, darkMode })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <MDBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
          <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} light={light} />
        </MDBox>
        {isMini ? null : (
          <MDBox sx={(theme) => navbarRow(theme, { isMini })}>
            <MDBox pr={1}>
              <MDInput label="Search here" />
            </MDBox>
            <MDBox color={light ? "white" : "inherit"}>
              <IconButton sx={navbarIconButton} size="small" aria-controls={menuId} aria-haspopup="true"
                onClick={handleProfileMenuOpen} disableRipple>
                {avatar ? <Avatar alt={avatar} src={avatar} /> : <Icon sx={iconsStyle}>account_circle</Icon>}
              </IconButton>
              {profileMenu}
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarMobileMenu}
                onClick={handleMiniSidenav}
              >
                <Icon sx={iconsStyle} fontSize="medium">
                  {miniSidenav ? "menu_open" : "menu"}
                </Icon>
              </IconButton>
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarIconButton}
                onClick={handleConfiguratorOpen}
              >
                <Icon sx={iconsStyle}>settings</Icon>
              </IconButton>

              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarIconButton}
                aria-controls="notification-menu"
                aria-haspopup="true"
                variant="contained"
                onClick={handleOpenMenu}
              >
                <Badge badgeContent={notificationCount} color="primary">
                <Icon sx={iconsStyle}>notifications</Icon>
                </Badge>
              </IconButton>
              {renderMenu()}
              {selectedNotification && (
          <NotificationModal
            open={openNotificationModal} 
            onClose={handleModalClose}
            onMarkAsRead={handleMarkAsRead}
            onDelete={handleDelete}
            notification={selectedNotification}
          />
        )}

            </MDBox>
          </MDBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
