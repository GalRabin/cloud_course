import React from "react";
// import { render } from "react-dom";
import Styles from "./Styles";
import { Form, Field } from "react-final-form";
import axios from "axios";
import Python from "./Parts/Python.js";
import Golang from "./Parts/Golang.js";
import ProfileName from "./Parts/ProfileName";
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const Validation = (values) => {
  const errors = {};
  if (!values.python) {
    errors.python = "Required";
  }

  if (values.python === "yes") {
    if (!values.pythonVersion) {
      errors.pythonVersion = "Required";
    }
  }

  if (!values.golang) {
    errors.golang = "Required";
  }

  if (values.golang === "yes") {
    if (!values.golangVersion) {
      errors.golangVersion = "Required";
    }
  }

  if (!values.profileName) {
    errors.profileName = "Required";
  }
  return errors;
};

const createProfileToAdd = (profile) => {
  let ans = {};
  let python = {};
  let golang = {};
  ans.uuid = profile.profileName;
  if (profile.python === "yes") {
    python.v_2_7 = profile.pythonVersion.indexOf("v_2_7") >= 0 ? true : false;
    python.v_3_3 = profile.pythonVersion.indexOf("v_3_3") >= 0 ? true : false;
    python.v_3_4 = profile.pythonVersion.indexOf("v_3_4") >= 0 ? true : false;
    python.v_3_5 = profile.pythonVersion.indexOf("v_3_5") >= 0 ? true : false;
    python.v_3_6 = profile.pythonVersion.indexOf("v_3_6") >= 0 ? true : false;
    python.v_3_7 = profile.pythonVersion.indexOf("v_3_7") >= 0 ? true : false;
    python.v_3_8 = profile.pythonVersion.indexOf("v_3_8") >= 0 ? true : false;
  } else {
    python.v_2_7 = false;
    python.v_3_3 = false;
    python.v_3_4 = false;
    python.v_3_5 = false;
    python.v_3_6 = false;
    python.v_3_7 = false;
    python.v_3_8 = false;
  }

  if (profile.golang === "yes") {
    golang.v_1_1_0 =
      profile.golangVersion.indexOf("v_1_1_0") >= 0 ? true : false;
    golang.v_1_1_1 =
      profile.golangVersion.indexOf("v_1_1_1") >= 0 ? true : false;
    golang.v_1_1_2 =
      profile.golangVersion.indexOf("v_1_1_2") >= 0 ? true : false;
    golang.v_1_1_3 =
      profile.golangVersion.indexOf("v_1_1_3") >= 0 ? true : false;
  } else {
    golang.v_1_1_0 = false;
    golang.v_1_1_1 = false;
    golang.v_1_1_2 = false;
    golang.v_1_1_3 = false;
  }

  ans.python = python;
  ans.golang = golang;
  console.log("profile to add  -> ", ans);
  return ans;
};

export default function MainFormProfile(props) {
  const onSubmit = async (values) => {
    await sleep(300);
    try {
      const profileToAdd = createProfileToAdd(values);
      const path =
        "http://a9aa3c6e4fada42ba85d935333a18ce5-1740582443.us-east-2.elb.amazonaws.com:8000/api/v1/profile";

      await axios
        .post(path, profileToAdd)
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
  return (
    <Styles>
      <h4>Create new profile</h4>

      <Form
        onSubmit={onSubmit}
        // initialValues={{ employed: true, stooge: "larry" }}

        validate={Validation}
      >
        {({ handleSubmit, form, submitting, pristine, values }) => (
          <form onSubmit={handleSubmit}>
            <ProfileName />
            <br />
            <Python />
            <Golang />
            <div className="buttons">
              <button type="submit" disabled={submitting}>
                Submit
              </button>
              <button type="button" onClick={form.reset} disabled={submitting}>
                Reset
              </button>
            </div>
            <pre>{JSON.stringify(values, 0, 2)}</pre>
          </form>
        )}
      </Form>
    </Styles>
  );
}

// <div>
// <label>First Name</label>
// <Field
//   name="firstName"
//   component="input"
//   type="text"
//   placeholder="First Name"
// />
// <Error name="firstName" />
// </div>

// <Condition when="reception" is="pickup">
// <div>
//   <label>Pickup Time</label>
//   <Field name="pickupTime" component="select">
//     <option />$
//     {pickupTimes.map((time) => (
//       <option key={time} value={time}>
//         {time}
//       </option>
//     ))}
//   </Field>
//   <Error name="pickupTime" />
// </div>
// </Condition>

// <div>
// <label>Is it a gift?</label>
// <Field name="gift" component="input" type="checkbox" />
// </div>
// <Condition when="gift" is={true}>
// <div>
//   <label>Gift Message</label>
//   <Field
//     name="message"
//     component="textarea"
//     placeholder="Gift Message"
//   />
//   <Error name="message" />
// </div>
// </Condition>
