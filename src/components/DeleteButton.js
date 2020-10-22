import DeleteForeverRoundedIcon from '@material-ui/icons/DeleteForeverRounded';
import React, {useCallback} from 'react';
import {makeItFade} from '../utils/animations';

const DeleteButton = ({row: {index}, deleteMyData, animationRef}) => {
  const handleClick = useCallback(() => {
    const el = animationRef.current.children[index];
    makeItFade(el).then(deleteMyData(index));
  }, [index, deleteMyData, animationRef]);

  return (
    <button className="btn-svg btn-svg--delete" onClick={handleClick}>
      <DeleteForeverRoundedIcon />
    </button>
  );
};

export default DeleteButton;
