import React from "react";
// import { render } from "react-dom";
import Styles from "./Styles";
import { Form, Field } from "react-final-form";
import axios from "axios";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const Validation = (values) => {
  const errors = {};
  if (!values.uuid) {
    errors.uuid = "Required";
  }

  if (!values.hostname) {
    errors.hostname = "Required";
  }
  if (!values.username) {
    errors.username = "Required";
  }
  if (!values.password) {
    errors.password = "Required";
  }

  return errors;
};

const Error = ({ name }) => (
  <Field name={name} subscription={{ error: true, touched: true }}>
    {({ meta: { error, touched } }) =>
      error && touched ? <span>{error}</span> : null
    }
  </Field>
);

export default function MainFormUser(props) {
  const onSubmit = async (values) => {
    await sleep(300);
    try {
      console.log("user to add -> ", values);

      const path =
        "http://a9aa3c6e4fada42ba85d935333a18ce5-1740582443.us-east-2.elb.amazonaws.com:8000/api/v1/user";

      // console.log("user to add -> ",);
      const res = await axios
        .post(path, values)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
      // window.alert(JSON.stringify(values, 0, 2));
    } catch (err) {
      console.log("error creating todo:", err);
    }
  };
  return (
    <Styles>
      <h4>Create new user</h4>

      <Form
        onSubmit={onSubmit}
        // initialValues={{ employed: true, stooge: "larry" }}

        validate={Validation}
      >
        {({ handleSubmit, form, submitting, pristine, values }) => (
          <form onSubmit={handleSubmit}>
            <div>
              <label>user uuid</label>
              <Field name="uuid" component="input" type="text" placeholder="" />
              <Error name="uuid" />
            </div>

            <div>
              <label>hostname </label>
              <Field
                name="hostname"
                component="input"
                type="text"
                placeholder="127.0.0.1"
              />
              <Error name="hostname" />
            </div>

            <div>
              <label>username </label>
              <Field
                name="username"
                component="input"
                type="text"
                placeholder=""
              />
              <Error name="username" />
            </div>

            <div>
              <label>password </label>
              <Field
                name="password"
                component="input"
                type="text"
                placeholder=""
              />
              <Error name="password" />
            </div>

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
