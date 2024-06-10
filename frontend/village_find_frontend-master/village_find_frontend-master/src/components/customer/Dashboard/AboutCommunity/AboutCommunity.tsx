import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Container } from '@/components/layout/customer';
import { Button } from '@/components/forms';
import { SERVER_URL } from '@/config/global';
import { HttpService } from '@/services';
import { CategoryContext } from '@/providers';

import CommunityImage1 from '/assets/customer/vendors/community1.svg';
import CommunityImage2 from '/assets/customer/vendors/community2.svg';
import PatternImage from '/assets/customer/backs/pattern.png';
import ExShopVComImage1 from '/assets/customer/backs/excom1.png';
import ExShopVComImage2 from '/assets/customer/backs/excom2.png';
import ExShopVComImage3 from '/assets/customer/backs/excom3.png';

import styles from './AboutCommunity.module.scss';

interface ICommunity {
  avatar: string;
  name: string;
  description: string;
}

interface IVendorType {
  title: string;
  content: string;
}

interface ILinkImage {
  title: string;
  path: string;
}

interface IShopVCommunity {
  name: string;
  detail: string;
  category: string;
  image: string;
  slug: string;
}

const initialCommunities: ICommunity[] = [
  {
    avatar: CommunityImage1,
    name: 'The Village Finds Community',
    description:
      "This is the over all community of likeminded individuals using the power of eCommerce to make a difference in their lives through entrepreneurship. Whether you shop solopreneurs or from Vendor Communities, you're shopping from this community.",
  },
  {
    avatar: CommunityImage2,
    name: 'The Vendor Community',
    description:
      'Our Vendor Community project, empowers local people to organize vendors and to help build real relationship with each other and customers like you.',
  },
];

const initialVendorTypes: IVendorType[] = [
  {
    title: 'Makers & More',
    content: 'Offering items from vendors that can be shipped directly to you',
  },
  {
    title: 'Vendors Near You',
    content:
      'Offering Items from local vendors near you. Items can be scheduled for pickup or local delivery',
  },
  {
    title: 'Subscriptions',
    content: 'Offering subscriptions from local vendors near you',
  },
];

const initialLinkImages: ILinkImage[] = [
  {
    title: 'Makers',
    path: '/market',
  },
  {
    title: 'Communities',
    path: '/communities',
  },
  {
    title: 'Subscription',
    path: '/market?type=subscription',
  },
];

export interface ICommunityProps {
  images: string[];
}

export interface IReadyToShopProps {
  images: string[];
}

export const initialCommunityImages = [
  'assets/customer/backs/vendortype1.png',
  'assets/customer/backs/vendortype2.png',
  'assets/customer/backs/vendortype3.png',
];

export const initialReadyImages = [
  'assets/customer/backs/linkImage1.png',
  'assets/customer/backs/linkImage2.png',
  'assets/customer/backs/linkImage3.png',
];

export interface IAboutCommunityProps {
  community: ICommunityProps;
  ready: IReadyToShopProps;
}

export function AboutCommunity({ community, ready }: IAboutCommunityProps) {
  const navigate = useNavigate();

  const { categories } = useContext(CategoryContext);
  const [communities] = useState<ICommunity[]>(initialCommunities);
  const [shopVCategory, setShopVCategory] = useState('');
  const [shopVCommunities, setShopVCommunities] = useState<IShopVCommunity[]>(
    [],
  );

  useEffect(() => {
    HttpService.get('/communities').then(response => {
      const communities = (response || []).map((item: any) => ({
        ...item,
        detail: item.shortDesc,
        image: item.images?.logoUrl,
      }));
      setShopVCommunities(communities);
    });
  }, []);

  return (
    <div className={styles.root}>
      <Container className={styles.container}>
        <div className={styles.wrapper}>
          <h1>What is a vendor community?</h1>
          <p>
            Village Finds' new C-commerce initiative empowers local people to
            organize small makers and growers in their communities to help them
            connect with customers looking for what they’re selling.
          </p>
          <div className={styles.ccommerce}>
            <h2>C-Commerce (Community Commerce) </h2>
            <p>
              A group of people sharing a common interest in supporting the
              efforts of growing sales and awareness of each other’s products or
              services in-person and online using a single commerce platform.
            </p>
          </div>
        </div>
      </Container>
      <div className={styles.vback}>
        <img src={PatternImage} className={styles.vPatternImage} />
        <Container className={styles.vcontainer}>
          <h4>{communities.length} Types of community you can shop</h4>
          <div className={styles.communities}>
            {communities.map((community: ICommunity, index: number) => (
              <div key={`community-${index}`} className={styles.community}>
                <img src={community.avatar} className={styles.avatar} />
                <div className={styles.content}>
                  <p className={styles.header}>{community.name}</p>
                  <p>{community.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.vtypes}>
            <div className={styles.content}>
              <p className={styles.header}>Types of vendors you'll find.</p>
              <p>
                Every vendor operates their own store whether they are a part of
                a Vendor Community or going at it solo. What each vendor has in
                common is they offer one or all three vendor types.
              </p>
            </div>
            <div className={styles.vendors}>
              {initialVendorTypes.map((vtype: IVendorType, index: number) => (
                <div key={`vendor-type-${index}`} className={styles.vendor}>
                  <h6>{vtype.title}</h6>
                  <p>{vtype.content}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </div>
      <Container className={styles.vtypeImages}>
        <div className={styles.imagesWrapper}>
          {initialVendorTypes.map((vtype: IVendorType, index: number) => (
            <img
              key={`vendor-type-image-${index}`}
              src={`${SERVER_URL}/${community.images[index]}`}
            />
          ))}
        </div>
      </Container>
      <div className={styles.readyToShop}>
        <p>Ready To shop?</p>
        <div className={styles.linkImages}>
          {initialLinkImages.map((linkImage: ILinkImage, index: number) => (
            <div key={`link-image-${index}`} className={styles.linkImage}>
              <img src={`${SERVER_URL}/${ready.images[index]}`} />
              <span
                className={styles.linkTitle}
                onClick={() => navigate(linkImage.path)}
              >
                {linkImage.title}
              </span>
            </div>
          ))}
        </div>
      </div>
      <Container className={styles.vendorCommunities}>
        <p>Shop Vendor Communities</p>
        <div className={styles.shopComWrapper}>
          <div className={styles.categories}>
            <span>Explore by Interest</span>
            <ul>
              {[
                { name: 'All Categories', value: '' },
                ...categories.map(item => ({
                  ...item,
                  value: item.name.toLowerCase(),
                })),
              ].map((category: any, index: number) => (
                <li
                  key={`shop-vendor-category-${index}`}
                  className={
                    shopVCategory === category.value ? styles.active : ''
                  }
                  onClick={() =>
                    navigate(`/communities?category=${category.value}`)
                  }
                >
                  {category.name}
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.communities}>
            {shopVCommunities.map(
              (shopVCommunity: IShopVCommunity, index: number) => (
                <div
                  key={`shop-v-com-${index}`}
                  className={styles.shopvcom}
                  onClick={() =>
                    navigate(`/communities/${shopVCommunity.slug}`)
                  }
                >
                  <img src={`${SERVER_URL}/${shopVCommunity.image}`} />
                  <div className={styles.vcomText}>
                    <p className={styles.name}>{shopVCommunity.name}</p>
                    <span className={styles.detail}>
                      {shopVCommunity.detail}
                    </span>
                    <p className={styles.catLabel}>Category</p>
                    <span className={styles.category}>
                      {shopVCommunity.category}
                    </span>
                  </div>
                </div>
              ),
            )}
          </div>
          <div className={styles.exCommunities}>
            <div className={styles.heading}>
              <p>Shop Vendor Communities</p>
            </div>
            <div className={styles.image1}>
              <img src={ExShopVComImage1} />
            </div>
            <div className={styles.image2}>
              <img src={ExShopVComImage2} />
            </div>
            <div className={styles.image3}>
              <img src={ExShopVComImage3} />
            </div>
            <div className={styles.findCom}>
              <p className={styles.heading}>Find A Community</p>
              <p className={styles.description}>
                Shop from groups of vendors growing together on a single
                marketplace
              </p>
              <Button
                variant="outlined"
                className={styles.button}
                onClick={() => navigate('/communities')}
              >
                Shop Now
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
