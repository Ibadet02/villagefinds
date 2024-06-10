import { useContext, useEffect, useState, MouseEvent } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import {
  FaMagnifyingGlass,
  FaBars,
  FaChevronDown,
  FaChevronUp,
} from 'react-icons/fa6';
import { AiOutlineClose } from 'react-icons/ai';
import { MdLogout } from "react-icons/md";
import clsx from 'clsx';

import { Button, Input } from '@/components/forms';
import { MagnifierIcon, CartIcon, UserIcon } from '@/components/icons';
import { Logo } from '@/components/layout/customer';

import { AuthContext, CartContext, SearchbarContext, ZipcodeContext } from '@/providers';

import { useWindowWidth } from '@/utils/hook/useWindowWidth';

import { ChangeInputEvent } from '@/interfaces';
import { HttpService } from '@/services';
import { LocationConfirmDialog } from '@/components/customer';
import { getLocationFromZipcode } from '@/utils/third-api/zipcode';
import { capitalizeFirstLetter, setupToken } from '@/utils';
import styles from './Header.module.scss';

export interface IHeaderProps {
  switchToScreen: (isScreen: boolean) => void;
  className?: string;
}

const screenBlackList = ['/login/vendor'];
const navItems = [
  { name: 'Vendor Communities', path: '/communities' },
  { name: 'Subscriptions', path: '/market?type=subscription' },
  { name: 'about', path: '/about' }
];

export function Header({
  className = '',
  switchToScreen = () => { },
}: IHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const [searchParams, setSearchParams] = useSearchParams();

  const { isLogin, setIsLogin, account, setAccount } = useContext(AuthContext);
  const { isSearchbar } = useContext(SearchbarContext);
  const { zipcode, cityName, changeZipcode, changeCityName } =
    useContext(ZipcodeContext);
  const { cartItemCount } = useContext(CartContext);

  const [shopLocAnchor, setShopLocAnchor] = useState(false);
  const [collapseAnchor, setCollapseAnchor] = useState(false);
  const [categoryAnchor, setCategoryAnchor] = useState(true);
  const [confirmAnchor, setConfirmAnchor] = useState(false);

  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    [],
  );
  const [search, setSearch] = useState('');
  const [zipcodeInput, setZipcodeInput] = useState('');
  const [_, breakpoint] = useWindowWidth();

  const onShopSelect = () => {
    setShopLocAnchor(!shopLocAnchor);
  };

  const onShopClose = () => {
    setShopLocAnchor(false);
  };

  const onCollapseClick = () => {
    switchToScreen(!collapseAnchor);
    setCollapseAnchor(!collapseAnchor);
  };

  const onCategoryClick = () => {
    setCategoryAnchor(!categoryAnchor);
  };

  const onLoginClick = () => {
    setCollapseAnchor(false);
    switchToScreen(false);
    navigate('/login/customer');
  };

  const onLogoutClick = () => {
    setupToken(null, 'customer');
    setIsLogin(false);
    setAccount({ role: 'customer', profile: null });
  }

  const onSignupClick = () => {
    setCollapseAnchor(false);
    switchToScreen(false);
    navigate('/sign-up/customer');
  };

  const onProfileClick = () => {
    setCollapseAnchor(false);
    switchToScreen(false);
    navigate('/profile');
  };

  const onUpdateLocation = () => {
    (async () => {
      const result = await getLocationFromZipcode(zipcodeInput);
      if (result) {
        const { _normalized_city, county, state_code } = result;
        const normalizedCity = `${_normalized_city || county
          }, ${capitalizeFirstLetter(state_code)}`;
        changeZipcode(zipcodeInput);
        changeCityName(normalizedCity);
        localStorage.setItem('zipcode', zipcodeInput);
        localStorage.setItem('cityname', normalizedCity);
        setShopLocAnchor(false);
        setZipcodeInput('');
      }
    })();
  };

  const onZipcodeInputKeydown = (e: KeyboardEvent) => {
    if (e.keyCode === 13) {
      onUpdateLocation();
    }
  };

  const onSearchKeyDown = (e: KeyboardEvent) => {
    if (e.keyCode === 13) {
      if (pathname === '/market') {
        searchParams.set('search', search);
        setSearchParams(searchParams);
      } else {
        navigate(`/market?search=${search}`);
      }
    }
  };

  useEffect(() => {
    if (['sm', 'md', 'lg', 'xl', '2xl', '3xl'].includes(breakpoint as string)) {
      setCollapseAnchor(false);
    }
  }, [breakpoint]);

  useEffect(() => {
    const zipcode = localStorage.getItem('zipcode');
    const cityname = localStorage.getItem('cityname');
    if (zipcode && cityname) {
      changeZipcode(zipcode);
      changeCityName(cityname);
    } else {
      setConfirmAnchor(true);
    }
    HttpService.get('/settings/general/category').then(response => {
      setCategories(response);
    });
  }, []);

  return (
    <div
      className={clsx(
        styles.root,
        collapseAnchor ? styles.screen : '',
        className,
      )}
    >
      <div className={styles.header}>
        <Logo className={styles.logo} />
        <div className={styles.shopLoc}>
          <p onClick={onShopSelect}>You're shopping</p>
          {cityName && (
            <p className={styles.locSelect} onClick={onShopSelect}>
              <span>{cityName}</span>
              {shopLocAnchor ? <FaChevronUp /> : <FaChevronDown />}
            </p>
          )}
          {shopLocAnchor && (
            <div className={styles.shopCollapse}>
              <span className={styles.closeIcon} onClick={onShopClose}>
                <AiOutlineClose />
              </span>
              {cityName && (
                <div className={styles.shopInfo}>
                  <span>{cityName}</span>
                  {zipcode}
                </div>
              )}
              <p>
                Enter your zipcode to see items from vendors in your area. There's
                more to explore!
              </p>
              <Input
                rounded="full"
                adornment={{
                  position: 'right',
                  content: <FaMagnifyingGlass fill="white" />,
                  onClick: onUpdateLocation,
                }}
                placeholder="Enter Zip Code"
                size="large"
                borderColor="primary"
                className={styles.searchInput}
                value={zipcodeInput}
                updateValue={(e: ChangeInputEvent) =>
                  setZipcodeInput(e.target.value)
                }
                onKeyDown={onZipcodeInputKeydown}
              />
            </div>
          )}
        </div>
        <div
          className={clsx(
            styles.searchBar,
            isSearchbar ? styles.hiddenSearchBar : '',
          )}
        >
          <Input
            size="large"
            rounded="full"
            border="solid"
            borderColor="success"
            placeholder="Search for vendors, food, artisan goods & more..."
            adornment={{
              position: 'right',
              content: <MagnifierIcon />,
            }}
            value={search}
            updateValue={(e: ChangeInputEvent) => setSearch(e.target.value)}
            onKeyDown={onSearchKeyDown}
          />
        </div>
        {isLogin ? (
          <>
            <div className={styles.account}>
              {!screenBlackList.includes(pathname) && (
                <p>Hi, {account?.profile && account.profile.firstName}</p>
              )}
              <UserIcon className={styles.icon} onClick={() => navigate('/profile')} />
            </div>
            <div
              className={styles.navToCart}
              onClick={() => navigate('/checkout')}
            >
              <CartIcon className={styles.icon} />
              <span className={styles.badge}>{cartItemCount}</span>
            </div>
            <div onClick={onLogoutClick} className={styles.logout}>
              <MdLogout />
            </div>
          </>
        ) : (
          <div className={styles.buttonBar}>
            <div
              className={styles.navToCart}
              onClick={() => navigate('/checkout')}
            >
              <CartIcon className={styles.icon} />
              <span className={styles.badge}>{cartItemCount}</span>
            </div>
            <Button variant="none" onClick={onLoginClick}>
              Login
            </Button>
            <Button onClick={onSignupClick}>Sign up</Button>
          </div>
        )}
        <div className={styles.collapseIcon} onClick={onCollapseClick}>
          {collapseAnchor ? (
            <AiOutlineClose fill="white" />
          ) : (
            <FaBars fill="white" />
          )}
        </div>

        {confirmAnchor && !zipcode && (
          <LocationConfirmDialog
            onClose={() => setConfirmAnchor(false)}
            onConfirm={() => setConfirmAnchor(false)}
            onOtherClick={() => {
              setConfirmAnchor(false);
              // setShopLocAnchor(200);
            }}
          />
        )}
      </div>
      <div className={styles.collapsePanel}>
        {collapseAnchor && (
          <ul className={styles.subHeader}>
            {isLogin ? (
              <>
                <li className={styles.namebar}>
                  Hi, {account?.profile && account.profile.firstName}
                </li>
                <li className={styles.activeItem} onClick={onProfileClick}>
                  View Profile
                </li>
              </>
            ) : (
              <>
                <li onClick={onLoginClick}>Login</li>
                <li className={styles.activeItem} onClick={onSignupClick}>
                  Sign Up
                </li>
              </>
            )}
          </ul>
        )}
        {collapseAnchor && (
          <div className={styles.collapseHeader}>
            <Input
              rounded="full"
              adornment={{
                position: 'right',
                content: <FaMagnifyingGlass fill="white" />,
              }}
              placeholder="Search for vendors, food, artisan goods & more..."
              size="large"
              borderColor="primary"
              className={styles.searchInput}
            />
            <div className={styles.navbar}>
              <div className={styles.categories}>
                <p className={styles.catNavItem} onClick={onCategoryClick}>
                  All Categories{' '}
                  {categoryAnchor ? <FaChevronUp /> : <FaChevronDown />}
                </p>
                {categoryAnchor && (
                  <ul>
                    {categories.map((category: any, index: number) => (
                      <li
                        key={`${category}-${index}`}
                        onClick={() => navigate(`/market?category=${category.name.toLowerCase()}`)}
                      >
                        {category.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className={styles.divider} />
              <ul>
                {navItems.map((item, index) =>
                  <li key={index} onClick={() => navigate(item.path)}>
                    {item.name}
                  </li>
                )}
              </ul>
            </div>
            <Button color="light" className={styles.sellButton}>
              Sell
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
