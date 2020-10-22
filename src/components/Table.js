import _ from 'lodash';
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {usePagination, useSortBy, useTable} from 'react-table';
import DATA from '../static/data/data.json';
import {ReactComponent as BackArrow} from '../static/images/back-arrow.svg';
import {ReactComponent as ForwardArrow} from '../static/images/forward-arrow.svg';
import {order} from '../utils/utils';
import DeleteButton from './DeleteButton';
import EditableCheckBox from './EditableCheckBox';
import RowForm from './RowForm';
import RowItem from './RowItem';

function Table() {
  const refTr = useRef(null);
  const [dataArray, setDataArray] = useState([]);
  const [width, setWidth] = useState(window.innerWidth);
  const skipPageResetRef = React.useRef();

  useLayoutEffect(() => {
    const debouncedUpdateSize = _.debounce(function () {
      setWidth(window.innerWidth);
    }, 250);

    if (width <= 880) {
      //inf scroll asap
      setPageSize(20);
    } else {
      setPageSize(5);
    }
    window.addEventListener('resize', debouncedUpdateSize);

    return () => window.removeEventListener('resize', debouncedUpdateSize);
  }, [width]);

  const updateRow = (rowIndex, columnId, value) => {
    skipPageResetRef.current = true;
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

  const deleteRow = index => {
    skipPageResetRef.current = true;
    const tmpArray = [...dataArray];
    tmpArray.splice(index, 1);
    setDataArray([...tmpArray]);
    if (page.length === 1 && !canNextPage) {
      previousPage();
    }
  };

  const addRow = values => {
    skipPageResetRef.current = true;
    setDataArray(prevState => [
      ...prevState,
      {...values, id: prevState.length + 1},
    ]);
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
    skipPageResetRef.current = false;

    localStorage.setItem('myData', JSON.stringify(dataArray));
  }, [dataArray]);

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
    state: {pageIndex, pageSize},
  } = useTable(
    {
      columns: columns,
      data: dataArray,
      initialState: {
        pageSize: 5,
      },
      autoResetPage: !skipPageResetRef.current,
      autoResetExpanded: !skipPageResetRef.current,
      autoResetGroupBy: !skipPageResetRef.current,
      autoResetSelectedRows: !skipPageResetRef.current,
      autoResetSortBy: !skipPageResetRef.current,
      autoResetFilters: !skipPageResetRef.current,
      autoResetRowState: !skipPageResetRef.current,
      updateRow,
      deleteRow,
      addRow,
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
          <tbody
            pageindex={pageIndex}
            pagesize={pageSize}
            ref={refTr}
            className="table__body"
            {...getTableBodyProps()}
          >
            {page.map((row, i) => {
              prepareRow(row);
              return <RowItem i={i} key={i} row={row}></RowItem>;
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
        <RowForm addRow={addRow} />
      </div>
    </>
  );
}

export default Table;
