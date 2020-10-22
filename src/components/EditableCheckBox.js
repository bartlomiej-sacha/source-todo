import {Checkbox} from '@material-ui/core';
import React, {useCallback} from 'react';

const EditableCheckBox = ({
  value: initialValue,
  row: {index},
  column: {id},
  updateRow,
}) => {
  const handleChange = useCallback(() => {
    return updateRow(index, id, !initialValue);
  }, [id, index, initialValue, updateRow]);

  return (
    <Checkbox
      type="checkbox"
      className="checkbox"
      checked={initialValue}
      onChange={handleChange}
    />
  );
};

export default EditableCheckBox;
