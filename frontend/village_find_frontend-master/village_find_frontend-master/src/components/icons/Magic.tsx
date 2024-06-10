import MagicSvg from '/assets/common/icons/Magic.svg';

export interface MagicIconProps {
  onClick?: () => void;
  className?: string;
}

export function MagicIcon({ ...attrs }: MagicIconProps) {
  return <img alt="Magic Icon" src={MagicSvg} className="h-6 w-6" {...attrs} />;
}
