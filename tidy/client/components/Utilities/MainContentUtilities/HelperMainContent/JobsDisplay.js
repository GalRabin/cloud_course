import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useTable, useSortBy } from "react-table";
// import { ExecuteJob } from "../../../API";
import axios from "axios";
const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`;

function Table({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
    },
    useSortBy
  );

  // We don't want to render all 2000 rows for this example, so cap
  // it at 20 for this use case
  const firstPageRows = rows.slice(0, 20);

  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  {/* Add a sort direction indicator */}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {firstPageRows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <br />
    </>
  );
}

function ProfilesDisplay(props) {
  const columns = React.useMemo(
    () => [
      {
        Header: "uuid",
        accessor: "uuid",
      },
      {
        Header: "user_uuid",
        accessor: "user_uuid",
      },
      {
        Header: "profile_uuid",
        accessor: "profile_uuid",
      },
    ],
    []
  );

  const ExecuteJob = async (job_uuid) => {
    const method = "job/execute/" + job_uuid;
    const myPath =
      "http://a9aa3c6e4fada42ba85d935333a18ce5-1740582443.us-east-2.elb.amazonaws.com:8000/api/v1/job/execute/";

    let complete = myPath + job_uuid;
    await axios({
      url: complete,
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
  };

  const StatusJob = async (job_uuid) => {
    // const method = "job/execute/" + job_uuid;
    const myPath =
      "http://a9aa3c6e4fada42ba85d935333a18ce5-1740582443.us-east-2.elb.amazonaws.com:8000/api/v1/job/status/";

    let complete = myPath + job_uuid;
    console.log("this is compl -> ", complete);
    let data = await axios({
      url: complete,
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        let msg = JSON.stringify(response, 0, 2);

        // alert("job " + job_uuid + " Sucssefully initiated");
        alert(msg);
      })
      .catch((err) => {
        console.log(err);
      });
    if (data) {
      return data;
    }
  };
  const executeAndStatus = props.jobs.map((job, index) => {
    return (
      <div>
        <button onClick={() => ExecuteJob(job.uuid)}>Execute {job.uuid}</button>
        <button onClick={() => StatusJob(job.uuid)}>Stats {job.uuid}</button>
      </div>
    );
  });
  // console.log("props.jobs -> ", );
  // console.log("jobs as data ->", props.jobs);
  return (
    <div>
      <Styles>
        <Table columns={columns} data={props.jobs} />
      </Styles>
      <div> {executeAndStatus}</div>
    </div>
  );
}

export default ProfilesDisplay;
