import React, { Fragment, useState } from "react";
import Select from "react-select";
import Button from "@material-ui/core/Button";
import axios from "axios";

const getOptionsUser = (users) => {
  let helper = {};
  let ans = [];

  users.map((user, index) => {
    helper.value = user.uuid;
    helper.label = user.uuid;
    ans[index] = helper;
    helper = {};
  });
  return ans;
};

const getOptionsProfiles = (profiles) => {
  let helper = {};
  let ans = [];

  profiles.map((profile, index) => {
    helper.value = profile.uuid;
    helper.label = profile.uuid;
    ans[index] = helper;
    helper = {};
  });
  return ans;
};

export default function AddJob(props) {
  const [user, SetUser] = useState("");
  const [profile, setProfile] = useState("");
  const [jobuuid, setJobUuid] = useState("");

  const createJobToAdd = () => {
    let job = {};
    job.uuid = jobuuid;
    job.user_uuid = user;
    job.profile_uuid = profile;

    return job;
  };

  const listUsers = (
    <Fragment>
      <Select
        className="basic-single"
        onChange={(e) => SetUser(e.value)}
        options={getOptionsUser(props.allUsers)}
      />
    </Fragment>
  );
  const listProfiles = (
    <Fragment>
      {" "}
      <Select
        onChange={(e) => setProfile(e.value)}
        options={getOptionsProfiles(props.allProfiles)}
      />
    </Fragment>
  );

  const handleAddJob = async () => {
    // await sleep(300);
    try {
      const jobToAdd = createJobToAdd();
      const path = "http://127.0.0.1:8000/api/v1/job";

      await axios
        .post(path, jobToAdd)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (err) {
      console.log("error creating todo:", err);
    }
  };

  const job = (
    <form>
      <label>
        Name:
        <input
          type="text"
          name="name"
          onChange={(e) => setJobUuid(e.target.value)}
        />
      </label>
    </form>
  );

  const handleJobUuid = (event) => {
    console.log(event.value);
  };
  return (
    <div style={{ width: "50%" }}>
      <label>{job}</label>
      <label>Choose a user {listUsers}</label>
      <label>Choose a profile {listProfiles}</label>
      <br />
      <Button onClick={handleAddJob}>Add Job</Button>
    </div>
  );
}
