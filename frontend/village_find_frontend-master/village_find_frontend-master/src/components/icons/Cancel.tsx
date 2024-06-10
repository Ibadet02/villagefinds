import CancelSvg from '/assets/common/icons/Cancel.svg';

export interface ICancelIconProps {
  onClick?: () => void;
  className?: string;
}

export function CancelIcon({ ...attrs }) {
  return (
    <img alt="Cancel Icon" src={CancelSvg} className="h-6 w-6" {...attrs} />
  );
}
