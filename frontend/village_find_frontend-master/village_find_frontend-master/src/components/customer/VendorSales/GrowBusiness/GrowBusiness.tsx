import { useState } from 'react';

import { Container } from '@/components/layout/customer';

import AboutImage from '/assets/customer/backs/about.png';
import SolutionImage from '/assets/customer/backs/solution.png';
import ComImage from '/assets/customer/svgs/community.svg';
import SimplicityImage from '/assets/customer/svgs/simplicity.svg';
import CircleMark from '/assets/customer/svgs/circle.svg';
import TriMark from '/assets/customer/svgs/triangle.svg';
import RectMark from '/assets/customer/svgs/rectangle.svg';
import SquareMark from '/assets/customer/svgs/square.svg';
import styles from './GrowBusiness.module.scss';

const initialSecNames = [
  {
    path: '#why-village-finds',
    title: 'Why Village Finds',
  },
  {
    path: '#why-community',
    title: 'Why community',
  },
  {
    path: '#comparison',
    title: 'Comparison',
  },
  {
    path: '#pricing',
    title: 'Pricing',
  },
];

const initialSolutios = [
  {
    title: 'Community',
    description:
      'Local people empowered to organize small makers and growers on one platform.',
    image: ComImage,
  },
  {
    title: 'Simplicity',
    description:
      'We design for simplicity so you can grow your business on-line hassle free.',
    image: SimplicityImage,
  },
];

const initialMarks = [
  {
    title: 'Secure transactions',
    image: CircleMark,
  },
  {
    title: 'Subscriptions & Shipping',
    image: TriMark,
  },
  {
    title: 'Automatic deposits',
    image: RectMark,
  },
  {
    title: 'Affordable',
    image: SquareMark,
  },
];

export function GrowBusiness() {
  const [section, setSection] = useState('');

  return (
    <Container className={styles.root}>
      <div className={styles.mainText}>
        <p className={styles.title}>
          Simple no code stores to grow your online business
        </p>
        <p className={styles.description}>
          Join a community of certified makers and growers building their
          businesses online together with a single eCommerce platform.
        </p>
      </div>
      <ul className={styles.secNames}>
        {initialSecNames.map((secName: any, index: number) => (
          <li
            key={`section-name-${index}`}
            onClick={() => setSection(secName.title)}
            className={section === secName.title ? styles.active : ''}
          >
            <a href={secName.path}>{secName.title}</a>
          </li>
        ))}
      </ul>
      <div className={styles.about}>
        <div className={styles.text}>
          <div className={styles.control}>
            <p className={styles.head}>
              Our difference is offering more for your business
            </p>
            <p className={styles.body}>
              Offer flexible <b>delivery, pickup, and shipping</b> options with
              the ability to set order cut-off times.
            </p>
          </div>
          <div className={styles.control}>
            <p className={styles.head}>
              Control your own shipping platform connection
            </p>
            <p className={styles.body}>
              Save money on shipping and enjoy fully transparent shipping costs
              by managing your own shipping dashboard.
            </p>
          </div>
          <div className={styles.control}>
            <p className={styles.head}>Save valuable time</p>
            <p className={styles.body}>
              Village Finds' powerfully simple tools allow you to focus on your
              creative products and less time managing a complicated website.
            </p>
            <ul className={styles.list}>
              <li>One dashboard to manage your online business</li>
              <li>Beautiful store designs to wow customers</li>
              <li>Support of a dedicated community</li>
            </ul>
          </div>
        </div>
        <div className={styles.image}>
          <img src={AboutImage} />
        </div>
      </div>
      <div className={styles.solution}>
        <div className={styles.image}>
          <img src={SolutionImage} />
        </div>
        <div className={styles.choices}>
          <h1>Big ideas often need simple solutions</h1>
          <p>Village Finds clears the air with:</p>
          <div className={styles.list}>
            {initialSolutios.map((solution: any, index: number) => (
              <div key={`choice-${index}`} className={styles.choice}>
                <img src={solution.image} />
                <div className={styles.text}>
                  <p className={styles.head}>{solution.title}</p>
                  <p className={styles.body}>{solution.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.marks}>
        <h1>Simple and Secure</h1>
        <ul className={styles.list}>
          {initialMarks.map((mark: any, index: number) => (
            <li key={`mark-${index}`}>
              <img src={mark.image} />
              <p>{mark.title}</p>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
}
