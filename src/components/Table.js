import {Checkbox} from '@material-ui/core';
import React, {useCallback, useMemo} from 'react';
import {usePagination, useTable} from 'react-table';
import DATA from '../static/data/data.json';
import {ReactComponent as BackArrow} from '../static/images/back-arrow.svg';
import {ReactComponent as ForwardArrow} from '../static/images/forward-arrow.svg';

const EditableCheckBox = ({
  value: initialValue,
  row: {index},
  column: {id},
  updateMyData,
}) => {
  const handleChange = useCallback(() => {
    return updateMyData(index, id, !initialValue);
  }, [id, index, initialValue, updateMyData]);

  return (
    <Checkbox
      type="checkbox"
      className="checkbox"
      checked={initialValue}
      onChange={handleChange}
    />
  );
};

function Table() {
  const [data, setData] = React.useState(DATA.tasks);

  const updateMyData = (rowIndex, columnId, value) => {
    setData(old =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          };
        }
        return row;
      }),
    );
  };

  const columns = useMemo(
    () => [
      {
        Header: 'Task name',
        accessor: 'task_name',
        className: 'column__name',
      },
      {
        Header: 'Priority',
        accessor: 'priority',
      },
      {
        Header: 'Done',
        accessor: 'is_done',
        Cell: rowInfo => {
          return <EditableCheckBox {...rowInfo} />;
        },
      },
    ],
    [],
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    setPageSize,
    state: {pageIndex, pageSize},
  } = useTable(
    {
      columns: columns,
      data: data,
      autoResetPage: false,
      updateMyData,
      initialState: {pageSize: 5},
    },
    usePagination,
  );

  return (
    <>
      <div className="wrapper">
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map(group => (
              <tr {...group.getHeaderGroupProps()}>
                {group.headers.map(column => (
                  <th {...column.getHeaderProps()}>
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return (
                      <td
                        key={`${cell.column.Header}/${cell.row.original.id}`}
                        className={cell.column.className}
                        {...cell.getCellProps}
                      >
                        {cell.render('Cell')}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="pagination">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[5, 10, 15].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
          <span>
            {pageSize * pageIndex + 1} - {pageSize * pageIndex + 5}
            <span> of </span>
            {data.length}
          </span>
          <button
            className="button--svg"
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          >
            <BackArrow />
          </button>
          <button
            className="button--svg"
            onClick={() => nextPage()}
            disabled={!canNextPage}
          >
            <ForwardArrow />
          </button>
        </div>
      </div>
    </>
  );
}
export default Table;
