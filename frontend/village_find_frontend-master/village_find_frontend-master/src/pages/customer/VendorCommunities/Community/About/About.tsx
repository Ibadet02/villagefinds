import { Container } from '@/components/layout/customer';
import styles from './About.module.scss';
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa6';
import { Button, Input } from '@/components';

const initialBackImage = '/assets/customer/vcom/about1.png';
const initialTitleText = 'Sample Title Text';
const initialSubTitleText =
  'COVID 19 UPDATE : We are currently accepting orders as usual and shipping them within given time frames, but please NOTE that due to the current global situation deliveries are being delayed if shipped by either Fedex and National post services. Stay SAFE! IMPORTANT NOTICE: Due to many orders our current production time is 4-5 weeks. Thank you all for giving us time to do our work 4-5 weeks. Thank you all for giving us time to do our work 4-5 weeks. Thank you all';
const initialTitleImage = '/assets/customer/vcom/about2.png';
const initialStoryTexts = [
  'COVID 19 UPDATE: We are currently accepting orders as usual and shipping them within given time frames, but please NOTE that due to the current global situation deliveries are being delayed if shipped by either Fedex and National post services. Stay SAFE! IMPORTANT NOTICE: Due to many orders our current production time is 4-5 weeks. Thank you all for giving us time to do our work 4-5 weeks. Thank you all for giving us time to do our work 4-5 weeks. Thank you all',
  'COVID 19 UPDATE: We are currently accepting orders as usual and shipping them within given time frames, but please NOTE that due to the current global situation deliveries are being delayed if shipped by either Fedex and National post services. Stay SAFE! IMPORTANT NOTICE: Due to many orders our current production time is 4-5 weeks. Thank you all for giving us time to do our work 4-5 weeks. Thank you all for giving us time to do our work 4-5 weeks. Thank you all',
  'COVID 19 UPDATE: We are currently accepting orders as usual and shipping them within given time frames, but please NOTE that due to the current global situation deliveries are being delayed if shipped by either Fedex and National post services. Stay SAFE! IMPORTANT NOTICE: Due to many orders our current production time is 4-5 weeks. Thank you all for giving us time to do our work 4-5 weeks. Thank you all for giving us time to do our work 4-5 weeks. Thank you all',
];

export function About() {
  return (
    <div className={styles.root}>
      <div className={styles.backImage}>
        <img src={initialBackImage} />
      </div>
      <Container className={styles.container}>
        <div className={styles.title}>
          <h3>{initialTitleText}</h3>
          <p>{initialSubTitleText}</p>
          <img src={initialTitleImage} />
        </div>
        <div className={styles.story}>
          <h3>Our Story</h3>
          <div className={styles.body}>
            {initialStoryTexts.map((storyText: string, index: number) => (
              <p key={`story-text-${index}`}>{storyText}</p>
            ))}
          </div>
        </div>
        <div className={styles.contact}>
          <h3>Follow Us & Share</h3>
          <div className={styles.wrapper}>
            <div className={styles.link}>
              <span>
                <FaFacebookF size={24} fill="white" />
              </span>
              <span>
                <FaInstagram size={28} fill="white" />
              </span>
              <span>
                <FaYoutube size={24} fill="white" />
              </span>
            </div>
            <Input
              placeholder="Vendor Sharable Link"
              disabled={true}
              className={styles.linkCopier}
              adornment={{
                position: 'right',
                content: <Button className={styles.copyBtn}>Copy</Button>,
              }}
            />
          </div>
        </div>
      </Container>
    </div>
  );
}
