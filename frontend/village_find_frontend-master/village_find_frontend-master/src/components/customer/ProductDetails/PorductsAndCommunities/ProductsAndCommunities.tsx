import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa6';

import { SERVER_URL } from '@/config/global';
import { ProductCard } from '@/components/customer/common';
import { HttpService } from '@/services';
import { useWindowWidth } from '@/utils';

import styles from './ProductsAndCommunities.module.scss';

interface ICommunity {
  name: string;
  detail: string;
  category: string;
  image: string;
  slug: string;
}

function ProductsAndCommunities() {
  const navigate = useNavigate();

  const [products, setProducts] = useState<any[]>([]);
  const [communities, setCommunities] = useState<ICommunity[]>([]);

  const minBreakLists = ['none', 'xs'];
  const [_, breakpoint] = useWindowWidth();
  const isMobile = useMemo(() => {
    return minBreakLists.includes(breakpoint as string);
  }, [breakpoint]);

  useEffect(() => {
    HttpService.get('/communities').then(response => {
      const communities = (response || []).map((item: any) => ({
        ...item,
        detail: item.shortDesc,
        image: item.images.logoUrl,
      }));
      setCommunities(communities);
    });
  }, []);

  return (
    <div className={styles.root}>
      <div className={styles.mightLike}>
        <p className={styles.title}>You might also like</p>
        <div className={styles.products}>
          {products.length > 0 &&
            products
              .slice(0, products.length - 1)
              .map((product: any, index: number) => (
                <ProductCard
                  key={`${product.name}-${index}`}
                  isActive={isMobile}
                  product={product}
                  className={styles.featuredItem}
                />
              ))}
          {/* <ProductCard isLoadMore={true} product={products.reverse()[0]} /> */}
        </div>
      </div>
      <div className={styles.shopCommunities}>
        <p className={styles.title}>Shop Communities</p>
        <div className={styles.communities}>
          {communities.map((shopVCommunity: any, index: number) => (
            <div
              key={`shop-v-com-${index}`}
              className={styles.shopvcom}
              onClick={() => navigate(`/communities/${shopVCommunity.slug}`)}
            >
              <img src={`${SERVER_URL}/${shopVCommunity.image}`} />
              <div className={styles.vcomText}>
                <p className={styles.name}>{shopVCommunity.name}</p>
                <span className={styles.detail}>{shopVCommunity.detail}</span>
                <p className={styles.catLabel}>Category</p>
                <span className={styles.category}>
                  {shopVCommunity.category}
                </span>
              </div>
            </div>
          ))}
          <span className={styles.nextIcon}>
            <FaChevronRight fill="white" />
          </span>
        </div>
      </div>
    </div>
  );
}

export { ProductsAndCommunities };
