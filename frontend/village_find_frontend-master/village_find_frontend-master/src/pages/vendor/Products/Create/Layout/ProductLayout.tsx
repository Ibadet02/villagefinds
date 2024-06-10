import { useContext, useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa6';
import { enqueueSnackbar } from 'notistack';
import clsx from 'clsx';

import { Card } from '@/components/common';
import { MagicIcon } from '@/components/icons';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { resetProduct } from '@/redux/reducers';
import { ProductContext } from '../Provider/Provider';
import { HttpService } from '@/services';

import styles from './ProductLayout.module.scss';

interface INavItem {
  title: string;
  path: string;
  actions?: any;
}

const navItems: INavItem[] = [
  {
    title: 'General Information',
    path: 'general',
  },
  {
    title: 'Product Styles',
    actions: {
      create: 'Add Style',
      attribute: 'Attributes',
    },
    path: 'style',
  },
  {
    title: 'Specifications',
    actions: {
      create: 'Add Specification',
    },
    path: 'specifications',
  },
  {
    title: 'Customization',
    path: 'customziation',
  },
  {
    title: 'Subscription',
    path: 'subscription',
  }
];
const PRODUCT_PATH = '/vendor/products';

export function ProductLayout() {
  const dispatch = useAppDispatch();
  const { productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const product = useAppSelector(state => state.product);
  const { nutrition, image } = useContext(ProductContext);
  const { styleImages } = useContext(ProductContext);

  const [subPath, subActionPath] = useMemo(() => {
    const trimPath = pathname.slice(PRODUCT_PATH.length);
    const segPaths = trimPath.split('/');
    const path = segPaths[2] ?? '';
    const actionPath = path === 'style' ? (segPaths[4] ?? '') : (segPaths[3] ?? '');
    return [path, actionPath];
  }, [pathname]);
  const [subPathTitle, subActionPathTitle] = useMemo(() => {
    const pathItem = navItems.find((item: INavItem) => item.path === subPath);
    return [
      pathItem?.title ?? '',
      (pathItem?.actions && pathItem.actions[subActionPath]) ?? '',
    ];
  }, [subPath, subActionPath]);
  const createRoutes = useMemo(() =>
    [...navItems, ...(productId === 'create' ? [{ title: 'Submit', path: 'submit' }] : [])]
    , [productId]);
  const routeStep = useMemo(() => {
    return subActionPathTitle ? 'ACTION_ROUTE' : 'MAIN_ROUTE';
  }, [subPathTitle, subActionPathTitle]);

  const [productName, setProductName] = useState('');

  const buildPath = (childPath: string) => {
    return `${PRODUCT_PATH}/${productId}/${childPath}`;
  };

  const submitProduct = () => {
    console.log('Style Images', styleImages);
    const reqJson: any = {
      ...product, ...product.general
    };
    delete reqJson.currentStyleID;
    delete reqJson.general;
    HttpService.post('/products', reqJson).then(response => {
      const { status, product, styleInvents } = response;
      if (status === 200) {
        const formData = new FormData();
        if (nutrition) formData.append('nutrition', nutrition);
        if (image) formData.append('image', image);
        HttpService.put(`/products/${product}`, formData).then(response => {
          const { status } = response;
        });

        Promise.all(styleInvents.map((style: { styleID: string; inventories: string[]; }, styleID: number) => {
          const images = styleImages[styleID].images;
          const formData = new FormData();
          const inventIDs: string[] = [];
          images.forEach((image: File | null, imageID: number) => {
            if (image) {
              formData.append('images', image);
              inventIDs.push(styleInvents[styleID].inventories[imageID]);
            }
          });
          formData.append('inventIDs', JSON.stringify(inventIDs));
          HttpService.put('/inventories/image', formData, { styleId: style.styleID }).then(response => {
            const { status } = response;
            if (status === 200) {
              return Promise.resolve(null);
            }
          });
        })).then(response => {
          enqueueSnackbar('Product uploaded.', { variant: 'success' });
          dispatch(resetProduct());
          navigate(PRODUCT_PATH);
        });
      }
    })
  }

  const onNavItemClick = (item: INavItem) => {
    if (item.path === 'submit') {
      submitProduct();
    } else {
      navigate(buildPath(item.path));
    }
  };

  useEffect(() => {
    if (productId === 'create') return;
    HttpService.get(`/products/vendor/${productId}`).then(response => {
      const { status, product } = response;
      if (status === 200) {
        const { name } = product;
        setProductName(name || '');
      } else if (status === 404) {
        enqueueSnackbar('Product not found!', { variant: 'warning' });
        navigate(PRODUCT_PATH);
      }
    });
  }, [productId]);

  return (
    <div className={styles.root}>
      <div className={styles.leftBar}>
        {subPath === 'general' && (
          <Card className={styles.blog}>
            <div className={styles.container}>
              <span className={styles.magicPanel}>
                <MagicIcon className={styles.magicIcon} />
              </span>
              <div className={styles.desc}>
                <h2>Using AI</h2>
                <p>
                  If get stuck trying to create a product name or description,
                  let our AI do it for you!
                </p>
                <span>Learn More</span>
              </div>
            </div>
          </Card>
        )}
        <Card className={styles.content}>
          <div className={styles.breadcrumb}>
            <p onClick={() => navigate(PRODUCT_PATH)}>My Products</p>
            {subPathTitle && (
              <>
                <FaChevronRight fontSize={14} />
                <p
                  className={clsx({
                    [styles.bold]: routeStep === 'MAIN_ROUTE',
                  })}
                  onClick={() => navigate(buildPath(subPath))}
                >
                  {subPathTitle}
                </p>
              </>
            )}
            {subActionPathTitle && (
              <>
                <FaChevronRight fontSize={14} />
                <p
                  className={clsx({
                    [styles.bold]: routeStep === 'ACTION_ROUTE',
                  })}
                >
                  {subActionPathTitle}
                </p>
              </>
            )}
          </div>
          <p className={clsx(styles.productName, { hidden: !productName })}>
            <span>Product Name: </span>
            {productName}
          </p>
          <Outlet />
        </Card>
      </div>
      <ul className={styles.rightBar}>
        {createRoutes.map((navItem: INavItem) => (
          <li
            key={navItem.title}
            className={clsx(
              styles.navItem,
              pathname === buildPath(navItem.path) ? styles.activeItem : '',
            )}
            onClick={() => onNavItemClick(navItem)}
          >
            {navItem.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
