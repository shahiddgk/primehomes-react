import React from "react";
import PropTypes from "prop-types";
import { Modal, Card, CardContent, Typography, Button } from "@mui/material";

const modalStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const cardStyles = {
  width: 600, // Set the desired width
};

function NotificationModal({ open, onClose, onMarkAsRead, onDelete, notification }) {
  console.log('notification model', notification);

  return (
    <Modal open={open} onClose={onClose} style={modalStyles}>
      <Card style={cardStyles}>
        <CardContent sx={{ my: 'auto' }}>
          <img src={notification?.notification?.imageUrl} alt={notification?.notification?.title} width="200px" />
          <br />
          <Typography variant="p">
            <strong>{notification?.type}:</strong> {notification?.notification?.title}
          </Typography>
          <Typography>
            {notification?.notification?.description}
          </Typography>
          {/* You can display more details of the notification here */}
          <Button onClick={onMarkAsRead}>Mark as Read</Button>
          <Button onClick={onDelete}>Delete</Button>
        </CardContent>
        <Button onClick={onClose}>Close</Button>
      </Card>
    </Modal>
  );
}

NotificationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onMarkAsRead: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  notification: PropTypes.shape({
    notification: PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      imageUrl: PropTypes.string.isRequired,
    }).isRequired,
    type: PropTypes.string.isRequired,
  }).isRequired,
};

export default NotificationModal;
