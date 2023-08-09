import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from 'prop-types';
import axios from 'axios';

const PermissionsContext = createContext();
const UserRoleContext = createContext();

export function usePermissions() {
  return useContext(PermissionsContext);
}

export function useUserRole() { 
  return useContext(UserRoleContext);
}

export function PermissionsProvider({ children }) {
  const [permissions, setPermissions] = useState([]);
  const [userRole, setUserRole] = useState(""); 

  useEffect(() => {
    const fetchUserPermissions = async () => {
      const user = sessionStorage.getItem('data');
      const type = JSON.parse(user)
      if (type?.userData.type === 'Tenant' || type?.userData.type === 'Owner') {
        try {
          const { userData: { email } } = JSON.parse(user);
          const response = await axios.get(`/people/type/${email}`);
          const data = await response.data.data.type ;
          const role = await axios.get(`roles/role/${data}`);
          console.log('role.data.data.name',role.data.data.name,role.data.data.permissions);
          setPermissions(role.data.data.permissions);
          setUserRole(role.data.data.name); 
        } catch (error) {
          console.error("Error fetching user permissions:", error);
        }
      }
      else{
        try {
          const { userData: { email } } = JSON.parse(user) || null;
          const response = await axios.get(`/users/user/${email}`);
          const data = await response.data.data.role ;
          const role = await axios.get(`roles/role/${data}`);
          console.log('role.data.data.name',role.data.data.name,role.data.data.permissions);
          setPermissions(role.data.data.permissions);
          setUserRole(role.data.data.name); 
        } catch (error) {
          console.error("Error fetching user permissions:", error);
        }
      };
  
      }
    fetchUserPermissions();
  }, []);

  return (
    <PermissionsContext.Provider value={permissions}>
      <UserRoleContext.Provider value={userRole}>
        {children}
      </UserRoleContext.Provider>
    </PermissionsContext.Provider>
  );
}

PermissionsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PermissionsProvider;
