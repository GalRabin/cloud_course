import React, { useState, useEffect } from "react";
import JobsDisplay from "./HelperMainContent/JobsDisplay";
import Button from "@material-ui/core/Button";

import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import { makeStyles } from "@material-ui/core/styles";
import { blue } from "@material-ui/core/colors";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";

import axios from "axios";
import AddJob from "./AddJob";

const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
});

export default function AllUsers() {
  const [jobs, setJobs] = useState([]);
  const [open, setOpen] = React.useState(false);

  const [allProfiles, setAllProfiles] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getJobs = () => {
    const path =
      "http://a9aa3c6e4fada42ba85d935333a18ce5-1740582443.us-east-2.elb.amazonaws.com:8000/api/v1/list-jobs";
    axios({
      url: path,
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        // console.log(response.data);
        setJobs(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getUsers = () => {
    const path =
      "http://a9aa3c6e4fada42ba85d935333a18ce5-1740582443.us-east-2.elb.amazonaws.com:8000/api/v1/list-users";
    axios({
      url: path,
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        // console.log(response.data);
        setAllUsers(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getProfiles = () => {
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
        setAllProfiles(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getJobs();
    getUsers();
    getProfiles();
  }, []);

  // console.log("jobs - > ", jobs);
  // console.log("allProfiles -> ", allProfiles);
  // console.log("allUsers -< ", allUsers);
  return (
    <div>
      <h4>All Jobs</h4>
      <JobsDisplay jobs={jobs} />
      <br />
      <Button onClick={handleClickOpen}>Add Job</Button>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {/* <DialogTitle id="alert-dialog-title">
          </DialogTitle> */}
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Choose User and a Profile :)
          </DialogContentText>
          <AddJob allProfiles={allProfiles} allUsers={allUsers} />
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
