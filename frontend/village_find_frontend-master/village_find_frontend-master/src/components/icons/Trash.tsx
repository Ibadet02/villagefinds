import TrashSvg from '/assets/common/icons/Trash.svg';

export interface ITrashIconProps {
  onClick?: () => void;
  className?: string;
}

export function TrashIcon({ ...attrs }) {
  return <img alt="Trash Icon" src={TrashSvg} {...attrs} />;
}
