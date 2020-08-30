import React, { useEffect, useState } from "react";
import ProfilesDisplay from "./HelperMainContent/ProfilesDisplay";
import AddProfile from "./AddProfile";

import axios from "axios";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import { makeStyles } from "@material-ui/core/styles";
import { blue } from "@material-ui/core/colors";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";

export default function AllProfiles() {
  const [profiles, setProfiles] = useState([]);
  const [open, SetOpen] = useState(false);
  const handleClickOpen = () => {
    SetOpen(true);
  };

  const handleClose = () => {
    SetOpen(false);
  };

  useEffect(() => {
    // Update the document title using the browser API

    const path =
      "http://a9aa3c6e4fada42ba85d935333a18ce5-1740582443.us-east-2.elb.amazonaws.com:8000/api/v1/list-profiles";
    axios({
      url: path,
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        // console.log(response.data);
        // console.log("profiles -> ", response.data);
        setProfiles(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // console.log("profiles -> ", profiles);
  return (
    <div>
      <h4>All profiles</h4>
      <ProfilesDisplay profiles={profiles} />
      <br />
      <br />
      <Button onClick={handleClickOpen}>Add Profile</Button>

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
          <AddProfile />
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
