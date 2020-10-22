import DeleteForeverRoundedIcon from '@material-ui/icons/DeleteForeverRounded';
import React, {useCallback} from 'react';
import {makeItFade} from '../utils/animations';

const DeleteButton = ({row: {index}, deleteRow, animationRef}) => {
  const handleClick = useCallback(() => {
    const pageIndex = animationRef.current.getAttribute('pageindex');
    const pageSize = animationRef.current.getAttribute('pagesize');
    const el = animationRef.current.children[index - pageIndex * pageSize];

    makeItFade(el).then(deleteRow(index));
  }, [index, deleteRow, animationRef]);

  return (
    <button className="btn-svg btn-svg--delete" onClick={handleClick}>
      <DeleteForeverRoundedIcon />
    </button>
  );
};

export default DeleteButton;
