import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useTable, useSortBy } from "react-table";

const fixProfilesToTable = (profiles) => {
  let ans = [];
  let helper = {};
  profiles.map((profile, index) => {
    helper.uuid = profile.uuid;

    helper.py__2_7 = profile.python.v_2_7.toString();
    helper.py__3_3 = profile.python.v_3_3.toString();
    helper.py__3_4 = profile.python.v_3_4.toString();
    helper.py__3_5 = profile.python.v_3_5.toString();
    helper.py__3_6 = profile.python.v_3_6.toString();
    helper.py__3_7 = profile.python.v_3_7.toString();
    helper.py__3_8 = profile.python.v_3_8.toString();

    helper.go__1_1_0 = profile.golang.v_1_1_0.toString();
    helper.go__1_1_1 = profile.golang.v_1_1_1.toString();
    helper.go__1_1_2 = profile.golang.v_1_1_2.toString();
    helper.go__1_1_3 = profile.golang.v_1_1_3.toString();

    ans[index] = helper;
    helper = {};
  });
  // console.log("ans returnnig -> ", ans);
  return ans;
};
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
  const [data, setData] = useState([]);

  const columns = React.useMemo(
    () => [
      {
        Header: "uuid",
        accessor: "uuid",
      },

      {
        Header: "golang",
        columns: [
          {
            Header: "v_1_1_0",
            accessor: "go__1_1_0",
          },
          {
            Header: "v_1_1_1",
            accessor: "go__1_1_1",
          },
          {
            Header: "v_1_1_2",
            accessor: "go__1_1_2",
          },
          {
            Header: "v_1_1_3",
            accessor: "go__1_1_3",
          },
        ],
      },
      {
        Header: "python",
        columns: [
          {
            Header: "v_2_7",
            accessor: "py__2_7",
          },
          {
            Header: "v_3_3",
            accessor: "py__3_3",
          },
          {
            Header: "v_3_4",
            accessor: "py__3_4",
          },
          {
            Header: "v_3_5",
            accessor: "py__3_5",
          },
          {
            Header: "v_3_6",
            accessor: "py__3_6",
          },
          {
            Header: "v_3_7",
            accessor: "py__3_7",
          },
          {
            Header: "v_3_8",
            accessor: "py__3_8",
          },
        ],
      },
    ],
    []
  );

  useEffect(() => {
    setData(fixProfilesToTable(props.profiles));
  }, [props.profiles]);

  if (data.length > 0) {
    return (
      <Styles>
        <Table columns={columns} data={data} />
      </Styles>
    );
  } else {
    return <div>No profiles</div>;
  }
}

export default ProfilesDisplay;
