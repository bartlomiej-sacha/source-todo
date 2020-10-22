import {Checkbox} from '@material-ui/core';
import React, {useCallback} from 'react';

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

export default EditableCheckBox;
