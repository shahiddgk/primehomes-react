import axios from "axios";
import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from 'prop-types';



const PermissionsContext = createContext();

export function usePermissions() {
  return useContext(PermissionsContext);
}

export function PermissionsProvider({ children }) {
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const fetchUserPermissions = async () => {
      try {
        const user = sessionStorage.getItem('data');
        const { userData: { email } } = JSON.parse(user);
        const response = await axios.get(`/users/user/${email}`);
        const data = await response.data.data.role;
        console.log(data);
        const role = await axios.get(`roles/role/${data}`)
        console.log('checking role ===============', role.data.data.permissions);
        setPermissions(role.data.data.permissions);
      } catch (error) {
        console.error("Error fetching user permissions:", error);
      }
    };

    fetchUserPermissions();
  }, []);
  return (
    <PermissionsContext.Provider value={permissions}>
      {children}
    </PermissionsContext.Provider>
  );
}

PermissionsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};