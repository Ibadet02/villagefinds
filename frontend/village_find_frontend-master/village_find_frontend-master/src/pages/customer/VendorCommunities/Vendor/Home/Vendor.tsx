import { useEffect, useState, useMemo, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import clsx from 'clsx';

import { Container } from '@/components/layout/customer';
import { CategoryBar } from '@/components/customer/VendorCommunities';
import { CommunityContent } from '@/components/customer/VendorCommunities';
import { Pagination } from '@/components';
import { SERVER_URL } from '@/config/global';
import { HttpService } from '@/services';
import { formatDate } from '@/utils';

import BackImage from '/assets/customer/vcom/individual.png';
import styles from './Vendor.module.scss';
import { CategoryContext } from '@/providers';
import { FilterAndSortDialog, FindProductDialog } from '@/components/customer';

interface IVendor {
  logoUrl: string;
  slides: string[];
  shopName: string;
  shortDesc: string;
  tags: string[];
}

interface ICommunity {
  logoUrl: string;
  slug: string;
  name: string;
  announcement?: {
    text: string;
    updated_at: string;
  };
}

const initialVendor: IVendor = {
  logoUrl: '',
  slides: [],
  shopName: '',
  shortDesc: '',
  tags: [],
};

const initialCommunity: ICommunity = {
  logoUrl: '',
  slug: '',
  name: '',
};

export function Vendor() {
  const navigate = useNavigate();
  const { id: vendorID } = useParams();

  const { categories } = useContext(CategoryContext);
  const [vendor, setVendor] = useState<IVendor>(initialVendor);
  const [community, setCommunity] = useState<ICommunity>(initialCommunity);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const [category, setCategory] = useState('');
  // const [categoryList, setCategoryList] = useState<
  //   { name: string; value: string }[]
  // >([]);
  const currentCategory = useMemo(() => {
    const item = [
      { name: 'All Categories', value: '' },
      ...categories.map(item => ({ ...item, value: item.name.toLowerCase() })),
    ].find(item => item.value === category);
    return item ? item.name : '';
  }, [category, categories]);
  const [products, setProducts] = useState<any[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [sortOrder, setSortOrder] = useState('ascending');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const [isFindProductDialogOpen, showFindProductDialog] = useState(false);
  const [isSortFilterDialogOpen, showSortFilterDialog] = useState(false);

  const onCategoryChange = (value: string) => {
    setCategory(value);
  };

  const onAboutClick = () => {
    navigate('about');
  };

  const onFilterAndSortApply = (options: any) => {
    const { sortOrder, minPrice, maxPrice } = options;
    setSortOrder(sortOrder);
    setMinPrice(minPrice);
    setMaxPrice(maxPrice);
    showSortFilterDialog(false);
  };

  useEffect(() => {
    HttpService.get('/user/vendor', { vendorId: vendorID }).then(response => {
      const vendor = response[0];
      if (vendor) {
        const { shopName, store, images, community } = vendor;
        setVendor({
          shopName: shopName || '',
          shortDesc: store.shortDesc || [],
          logoUrl: images.logoUrl || '',
          slides: images.slides || '',
          tags: store.tags || [],
        });
        setCommunity({
          logoUrl: (community.images && community.images.logoUrl) || '',
          slug: community.slug,
          name: community.name,
          announcement: community.announcement,
        });
      }
    });
  }, [vendorID]);

  useEffect(() => {
    const params: any = { vendor: vendorID };
    if (category) params.category = category;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (sortOrder !== 'none') params.sort = sortOrder;
    HttpService.get('/products/public', params).then(response => {
      setProducts(response || []);
    });
  }, [vendorID, category, minPrice, maxPrice, sortOrder]);

  return (
    <Container>
      <div className={styles.root}>
        <img
          src={
            vendor.slides && vendor.slides.length > 0
              ? `${SERVER_URL}/${vendor.slides[0]}`
              : BackImage
          }
          alt="Vendor slides"
          className={styles.slides}
        />
        <div className={styles.info}>
          <div className={styles.vendor}>
            <img src={`${SERVER_URL}/${vendor.logoUrl}`} alt="Vendor logo" />
            <div>
              <p className={styles.name}>{vendor.shopName}</p>
              <p className={styles.desc}>{vendor.shortDesc}</p>
              <button onClick={onAboutClick}>About</button>
            </div>
          </div>
          <div className={styles.community}>
            <p>Vendor Community</p>
            <div>
              <p onClick={() => navigate(`/communities/${community.slug}`)}>
                {community.name}
              </p>
              <img
                src={`${SERVER_URL}/${community.logoUrl}`}
                alt="Community logo"
              />
            </div>
          </div>
        </div>
        <div className={styles.announcement}>
          <div className={styles.container}>
            <div className={styles.title}>
              <p>Announcement</p>
              <span>
                Last Updated{' '}
                {formatDate(community.announcement?.updated_at || '')}
              </span>
            </div>
            <div className={styles.content}>
              <p className={clsx({ [styles.collapsed]: !isMoreOpen })}>
                {community.announcement?.text || ''}
              </p>
              <span onClick={() => setIsMoreOpen(!isMoreOpen)}>
                Read {isMoreOpen ? 'Less' : 'More'}
              </span>
            </div>
          </div>
        </div>
        <div className={styles.section}>
          <CategoryBar
            isVendorPanel={false}
            panel={true}
            category={category}
            changeCategory={onCategoryChange}
            categories={[
              { name: 'All Categories', value: '' },
              ...vendor.tags.map(item => ({
                name: item,
                value: item.toLowerCase(),
              })),
            ]}
            vendor={''}
            changeVendor={() => {}}
            vendors={[]}
            minPrice={minPrice}
            maxPrice={maxPrice}
          />
          <CommunityContent
            panel={true}
            title={'Products'}
            subtitle={currentCategory}
            products={products}
            vendors={[]}
            openFindProductDialog={() => showFindProductDialog(true)}
            openFilterSortDialog={() => showSortFilterDialog(true)}
            openMobileSettingDialog={() => {}}
          />
        </div>
        <div className={styles.pagination}>
          <Pagination
            currentPage={currentPage}
            pageCount={pageCount}
            navigate={setCurrentPage}
          />
        </div>
      </div>
      <FindProductDialog
        open={isFindProductDialogOpen}
        onClose={() => showFindProductDialog(false)}
      />
      <FilterAndSortDialog
        open={isSortFilterDialogOpen}
        sortOrder={sortOrder}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onApply={onFilterAndSortApply}
        onClose={() => showSortFilterDialog(false)}
      />
    </Container>
  );
}
