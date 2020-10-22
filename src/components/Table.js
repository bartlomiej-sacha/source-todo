import React, {useEffect, useMemo, useRef, useState} from 'react';
import {usePagination, useSortBy, useTable} from 'react-table';
import DATA from '../static/data/data.json';
import {ReactComponent as BackArrow} from '../static/images/back-arrow.svg';
import {ReactComponent as ForwardArrow} from '../static/images/forward-arrow.svg';
import {order} from '../utils/utils';
import DeleteButton from './DeleteButton';
import EditableCheckBox from './EditableCheckBox';
import RowForm from './RowForm';

function Table() {
  const refTr = useRef(null);
  const [dataArray, setDataArray] = useState([]);

  const updateMyData = (rowIndex, columnId, value) => {
    setDataArray(old =>
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

  const deleteMyData = index => {
    const tmpArray = [...dataArray];
    tmpArray.splice(index, 1);
    setDataArray([...tmpArray]);
  };

  useEffect(() => {
    if (
      localStorage.getItem('myData') === null ||
      localStorage.getItem('myData').length === 2
    ) {
      setDataArray([...DATA.tasks]);
    } else {
      setDataArray(JSON.parse(localStorage.getItem('myData')));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('myData', JSON.stringify(dataArray));
  }, [dataArray.length]);

  const columns = useMemo(
    () => [
      {
        Header: 'Task name',
        accessor: 'task_name',
        className: 'column__name',
        sortType: (a, b) => {
          if (
            a.original.task_name.charAt(0).toUpperCase() <
            b.original.task_name.charAt(0).toUpperCase()
          ) {
            return -1;
          }
          if (
            a.original.task_name.charAt(0).toUpperCase() >
            b.original.task_name.charAt(0).toUpperCase()
          ) {
            return 1;
          }
          return 0;
        },
      },
      {
        Header: 'Priority',
        accessor: 'priority',
        className: 'column__priority',
        sortType: (a, b) => {
          if (
            order.indexOf(a.original.priority) <
            order.indexOf(b.original.priority)
          ) {
            return -1;
          }
          if (
            order.indexOf(a.original.priority) >
            order.indexOf(b.original.priority)
          ) {
            return 1;
          }
          return 0;
        },
      },
      {
        Header: 'Done',
        accessor: 'is_done',
        className: 'column__done',
        sortType: (a, b) => {
          return a.original.is_done === b.original.is_done
            ? 0
            : a.original.is_done
            ? -1
            : 1;
        },

        Cell: rowInfo => {
          return <EditableCheckBox {...rowInfo} />;
        },
      },
      {
        Header: ' ',
        className: 'column__delete',
        Cell: rowInfo => {
          return <DeleteButton {...rowInfo} animationRef={refTr} />;
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
    gotoPage,
    state: {pageIndex, pageSize},
  } = useTable(
    {
      columns: columns,
      data: dataArray,
      autoResetPage: true,
      initialState: {
        //inf
        pageSize: window.innerWidth < 880 ? 500 : 5,
      },
      updateMyData,
      deleteMyData,
    },
    useSortBy,
    usePagination,
  );

  return (
    <>
      <div className="wrapper">
        <table className="table" {...getTableProps()}>
          <thead className="table__head">
            {headerGroups.map(group => (
              <tr
                key={group.Header}
                className="table__tr"
                {...group.getHeaderGroupProps()}
              >
                {group.headers.map(column => {
                  return (
                    <th
                      className={`${column.className} table__th `}
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
                      {column.render('Header')}
                      <span>
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <span
                              role="img"
                              aria-label="sorting idicator"
                              className="table__sort-indicator"
                            >
                              🔽
                            </span>
                          ) : (
                            <span
                              role="img"
                              aria-label="sorting idicator"
                              className="table__sort-indicator"
                            >
                              🔼
                            </span>
                          )
                        ) : (
                          ''
                        )}
                      </span>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody ref={refTr} className="table__body" {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <tr key={i} className="table__tr" {...row.getRowProps()}>
                  {row.cells.map((cell, j) => {
                    return (
                      <td
                        key={j}
                        className={`${cell.column.className} table__td`}
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
            {[5, 10, 15].map(pSize => (
              <option key={pSize} value={pSize}>
                {pSize}
              </option>
            ))}
          </select>
          <span className="pagination__stats">
            {pageSize * pageIndex + 1} - {pageSize * pageIndex + page.length}
            <span> of </span>
            {dataArray.length}
          </span>
          <button
            className="btn-svg btn-svg--page"
            onClick={previousPage}
            disabled={!canPreviousPage}
          >
            <BackArrow />
          </button>
          <button
            className="btn-svg btn-svg--page"
            onClick={nextPage}
            disabled={!canNextPage}
          >
            <ForwardArrow />
          </button>
        </div>
        <RowForm
          setData={setDataArray}
          pageHandler={gotoPage}
          lastId={dataArray.length + 1}
        />
      </div>
    </>
  );
}

export default Table;
