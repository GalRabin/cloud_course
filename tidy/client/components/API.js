import axios from "axios";
// const path =
//   "http://a7b6ad324c40e46018ec269a7cd4769a-1463543167.us-east-2.elb.amazonaws.com:8000/api/v1/";

const path = "http://127.0.0.1:8000/api/v1/";
// const path2 =
//   "http://a7b6ad324c40e46018ec269a7cd4769a-1463543167.us-east-2.elb.amazonaws.com:8000/api/v1/list-jobs";

export async function ExecuteJob(job_uuid) {
  const method = "job/execute/" + job_uuid;
  const myPath = path + method;

  await axios({
    url: myPath,
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      alert("job " + job_uuid + " Sucssefully initiated");
    })
    .catch((err) => {
      console.log(err);
    });

  // "http://a7b6ad324c40e46018ec269a7cd4769a-1463543167.us-east-2.elb.amazonaws.com:8000/api/v1/job/execute/" +
  // job_uuid;
  // console.log("this is path2 => ", path2);
}

export async function StatusJob(job_uuid) {
  const method = "job/status/" + job_uuid;
  const myPath = path + method;

  let data = await axios({
    url: myPath,
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log(err);
    });

  return data;
  // "http://a7b6ad324c40e46018ec269a7cd4769a-1463543167.us-east-2.elb.amazonaws.com:8000/api/v1/job/execute/" +
  // job_uuid;
}

export async function ListUsers() {
  const method = "list-users";
  const myPath = path + method;

  let data = await axios({
    url: myPath,
    // url: url,
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log(err);
    });

  return data;
}

export async function ListProfiles() {
  const method = "list-profiles";
  const myPath = path + method;

  let data = await axios({
    url: myPath,
    // url: url,
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log(err);
    });

  return data;
}

export async function ListJobs() {
  const method = "list-jobs";
  const myPath = path + method;

  let data = await axios({
    url: myPath,
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log(err);
    });

  return data;
}

export async function AddUser(user) {
  const method = "user";
  const myPath = path + method;

  let res = await axios
    .post(myPath, user)
    .then((response) => {
      console.log(response);
      return response;
    })
    .catch((error) => {
      console.log(error);
    });

  return res;
}

export async function AddProfile(profile) {
  // console.log("this is profile -> ", profile);
  // const path =
  //   "http://a7b6ad324c40e46018ec269a7cd4769a-1463543167.us-east-2.elb.amazonaws.com:8000/api/v1/profile";

  const method = "profile";
  const myPath = path + method;

  let res = await axios
    .post(myPath, profile)
    .then((response) => {
      console.log(response);
      return response;
    })
    .catch((error) => {
      console.log(error);
    });

  return res;
}

export async function AddJobAPI(job) {
  // const path =
  //   "http://a7b6ad324c40e46018ec269a7cd4769a-1463543167.us-east-2.elb.amazonaws.com:8000/api/v1/job";

  const method = "job";
  const myPath = path + method;
  let res = await axios
    .post(myPath, job)
    .then((response) => {
      console.log(response);

      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });

  return res;
}
