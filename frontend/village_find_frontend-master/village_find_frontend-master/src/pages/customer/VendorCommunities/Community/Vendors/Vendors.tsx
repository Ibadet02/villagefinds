import { useContext, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';

import { Container } from '@/components/layout/customer';
import { Pagination } from '@/components/common/Pagination';
import { CalendarIcon } from '@/components/icons';
import {
  CategoryBar,
  CommunityContent,
} from '@/components/customer/VendorCommunities';
import {
  FilterAndSortDialog,
  FindProductDialog,
  MobileSettingDialog,
  EventMeetupDialog,
} from '@/components/customer/common';
import { HttpService } from '@/services';
import { AuthContext, CategoryContext } from '@/providers';
import { useWindowWidth } from '@/utils';

import styles from './Vendors.module.scss';
import { SERVER_URL } from '@/config/global';

interface IVendorsProps {
  announcement: {
    text: string;
    updated_at: string;
  };
  events: {
    fulfillment?: {
      date: string;
    };
  }[];
  community: {
    _id: string;
    images: {
      logoUrl: string;
      backgroundUrl: string;
    };
    vendors: any[];
  };
  categories: string[];
}

const minBreakLists = ['none', 'xs'];

export function Vendors({
  announcement,
  events,
  community,
  categories: comCategories,
}: IVendorsProps) {
  const { account } = useContext(AuthContext);
  const { categories } = useContext(CategoryContext);

  const [_, breakpoint] = useWindowWidth();
  const isMobile = useMemo(() => {
    return minBreakLists.includes(breakpoint as string);
  }, [breakpoint]);

  const [panelType, setPanelType] = useState(true);
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortOrder, setSortOrder] = useState('ascending');
  const currentCategory = useMemo(() => {
    const item = [
      { name: 'All Categories', value: '' },
      ...categories.map(item => ({ ...item, value: item.name.toLowerCase() })),
    ].find(item => item.value === category);
    return item?.name || '';
  }, [category]);

  const [vendor, setVendor] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isMeetupOpen, setIsMeetupOpen] = useState(false);
  const currentVendor = useMemo(() => {
    const item = [
      { name: 'All Vendors', value: '' },
      ...community.vendors.map(item => ({ name: item.name, value: item._id })),
    ].find(item => item.value === vendor);
    return item ? item.name : '';
  }, [vendor]);

  const [attendees, setAttendees] = useState<string[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);

  const [findProductOpen, showFindProductDialog] = useState(false);
  const [filterSortOpen, showFilterSortDialog] = useState(false);
  const [mobileSettingOpen, showMobileSettingDialog] = useState(false);

  const formatDate = (date: string) => {
    return !date
      ? ''
      : new Date(date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
  };

  const onCategoryChange = (value: string) => {
    setCategory(value);
    setPanelType(true);
  };

  const onVendorChange = (value: string) => {
    setVendor(value);
    setPanelType(false);
  };

  const onReadToggle = () => {
    setIsMoreOpen(!isMoreOpen);
  };

  const onOptionChange = (option: any) => {
    const { minPrice, maxPrice, sortOrder } = option;
    setMinPrice(minPrice);
    setMaxPrice(maxPrice);
    setSortOrder(sortOrder);
    showFilterSortDialog(false);
  };

  useEffect(() => {
    if (!(account && account.profile && account.profile._id)) return;
    HttpService.get('/communities/meetup', {
      customerId: account.profile._id,
    }).then(response => {
      const { status, attendees } = response;
      if (status === 200) {
        setAttendees((attendees ?? []).map((item: any) => item.event ?? ''));
      }
    });
  }, []);

  useEffect(() => {
    if (!community._id) return;
    const params: any = { community: community._id };
    if (category) params.category = category;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (sortOrder) params.sort = sortOrder;
    HttpService.get('/products/public', params).then(response => {
      setProducts(response || []);
    });
  }, [community, category, minPrice, maxPrice, sortOrder]);

  useEffect(() => {
    if (!community._id) return;
    const params: any = { communityId: community._id };
    if (vendor) params.vendorId = vendor;
    HttpService.get('/user/vendor', params).then(response => {
      setVendors(response || []);
    });
  }, [community, vendor]);

  return (
    <>
      <Container className={styles.root}>
        <div className={styles.dashImage}>
          <img src={`${SERVER_URL}/${community.images && community.images.backgroundUrl}`} />
        </div>
        <div className={styles.vendors}>
          <p>
            Vendors <span>{community.vendors.length}</span>
          </p>
        </div>
        <div className={styles.schedule}>
          <div className={styles.announcement}>
            <div className={styles.container}>
              <div className={styles.title}>
                <p>Announcement</p>
                <span>Last Updated {formatDate(announcement.updated_at)}</span>
              </div>
              <div className={styles.content}>
                <p className={clsx({ [styles.collapsed]: !isMoreOpen })}>
                  {announcement.text}
                </p>
                <span onClick={onReadToggle}>
                  Read {isMoreOpen ? 'Less' : 'More'}
                </span>
              </div>
            </div>
          </div>
          <button
            className={styles.eventsButton}
            onClick={() => setIsMeetupOpen(true)}
          >
            <p>Events</p>
            <CalendarIcon />
          </button>
        </div>
        <div className={styles.section}>
          <CategoryBar
            panel={panelType}
            category={category}
            changeCategory={onCategoryChange}
            vendor={vendor}
            changeVendor={onVendorChange}
            categories={[
              { name: 'All Categories', value: '' },
              ...categories
                .filter(item => comCategories.includes(item.name.toLowerCase()))
                .map(item => ({ ...item, value: item.name.toLowerCase() })),
            ]}
            minPrice={minPrice}
            maxPrice={maxPrice}
            vendors={[
              { name: 'All Vendors', value: '' },
              ...community.vendors.map(item => ({
                name: item.business.name,
                value: item._id,
              })),
            ]}
          />
          <CommunityContent
            panel={panelType}
            title={panelType ? 'Products' : 'Vendors'}
            subtitle={panelType ? currentCategory : currentVendor}
            products={products}
            vendors={vendors}
            openFindProductDialog={() => showFindProductDialog(true)}
            openFilterSortDialog={() => showFilterSortDialog(true)}
            openMobileSettingDialog={() => showMobileSettingDialog(true)}
          />
        </div>
        <div className={styles.pagination}>
          <Pagination
            currentPage={currentPage}
            pageCount={pageCount}
            navigate={setCurrentPage}
          />
        </div>
      </Container>
      <EventMeetupDialog
        open={isMeetupOpen}
        onClose={() => setIsMeetupOpen(false)}
        events={events}
        attendees={attendees}
      />
      <FindProductDialog
        open={findProductOpen}
        onClose={() => showFindProductDialog(false)}
      />
      <FilterAndSortDialog
        open={filterSortOpen}
        minPrice={minPrice}
        maxPrice={maxPrice}
        sortOrder={sortOrder}
        onClose={() => showFilterSortDialog(false)}
        onApply={onOptionChange}
      />
      <MobileSettingDialog
        open={isMobile && mobileSettingOpen}
        onClose={() => showMobileSettingDialog(false)}
      />
    </>
  );
}
