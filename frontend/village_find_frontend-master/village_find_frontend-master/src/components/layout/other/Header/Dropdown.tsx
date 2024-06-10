import { useContext, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa6';

import { Card } from '@/components/common';
import { AuthContext } from '@/providers';
import { setupToken, useOnClickOutside } from '@/utils';

import styles from './Dropdown.module.scss';

export function Dropdown() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;

  const { account, setIsLogin } = useContext(AuthContext);
  const username = account?.profile?.owner || '';

  const [anchor, setAnchor] = useState(false);
  const dropRef = useRef(null);

  const onLogoutClick = () => {
    if (pathname.startsWith('/vendor')) {
      setupToken(null, 'vendor');
      navigate('/login/vendor');
    } else {
      setupToken(null, 'admin');
    }
    setIsLogin(false);
  };

  useOnClickOutside(dropRef, () => setAnchor(false));

  return (
    <div className={styles.root} ref={dropRef}>
      <div className={styles.dropdown} onClick={() => setAnchor(!anchor)}>
        <p>{username}</p>
        <span className={styles.arrow} onClick={() => setAnchor(!anchor)}>
          {anchor ? <FaChevronUp /> : <FaChevronDown />}
        </span>
      </div>
      {anchor && (
        <Card className={styles.dropbox}>
          <Link to={''}>My Store</Link>
          <span onClick={onLogoutClick}>Logout</span>
        </Card>
      )}
    </div>
  );
}
