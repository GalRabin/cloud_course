import React, { useState, useEffect } from "react";
import UsersDisplay from "./HelperMainContent/UsersDisplay";
import Button from "@material-ui/core/Button";

import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import { makeStyles } from "@material-ui/core/styles";
import { blue } from "@material-ui/core/colors";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";

import axios from "axios";
import AddUser from "./AddUser";

const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
});

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    // Update the document title using the browser API

    const path = "http://127.0.0.1:8000/api/v1/list-users";
    axios({
      url: path,
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        // console.log(response.data);
        setUsers(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // console.log("users - > ", users);
  return (
    <div>
      <h4>All users</h4>
      <UsersDisplay users={users} />
      <br />
      <Button onClick={handleClickOpen}>AddUser</Button>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {/* <DialogTitle id="alert-dialog-title">
          </DialogTitle> */}
        <DialogContent>
          {/* <DialogContentText id="alert-dialog-description">
              Let Google help apps determine location. This means sending
              anonymous location data to Google, even when no apps are running.
            </DialogContentText> */}
          <AddUser />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Dissmiss
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
