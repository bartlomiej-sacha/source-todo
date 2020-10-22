import React from 'react';
function RowItem({i, row}) {
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
}

export default RowItem;
