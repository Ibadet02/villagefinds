import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Card } from '@/components/common';
import { Input } from '@/components/forms';
import { MagnifierIcon } from '@/components/icons';
import { ChangeInputEvent } from '@/interfaces';
import { HttpService } from '@/services';
import { SERVER_URL } from '@/config/global';

import supportImg from '/assets/vendor/backs/support.png';
import styles from './Home.module.scss';

interface IPost {
  _id: string;
  title: string;
  topic: string;
  thumbnail_image: string;
}

export function SupportHome() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('');
  const [recentPosts, setRecentPosts] = useState<IPost[]>([]);
  const [lastPosts, setLastPosts] = useState<IPost[]>([]);

  useEffect(() => {
    HttpService.get('/settings/general/support', { latest: true, filter }).then(
      response => {
        const { recent, last } = response;
        setRecentPosts(recent);
        setLastPosts(last);
      },
    );
  }, [filter]);

  return (
    <Card className={styles.root}>
      <div className={styles.backImage}>
        <img src={supportImg} />
      </div>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Support Blog</h1>
          <Input
            rounded="full"
            border="none"
            bgcolor="secondary"
            placeholder="Search for a topic"
            className={styles.searchInput}
            adornment={{
              position: 'right',
              content: <MagnifierIcon />,
            }}
            value={filter}
            updateValue={(e: ChangeInputEvent) => setFilter(e.target.value)}
          />
        </div>
        <div className={styles.posts}>
          <div className={styles.postPanel}>
            <h2>Most Recent Posts</h2>
            <div className={styles.panelBody}>
              {recentPosts.map((post: IPost, index: number) => (
                <div
                  key={`${post.title}-${index}`}
                  className={styles.postItem}
                  onClick={() => navigate(post._id)}
                >
                  <img
                    src={`${SERVER_URL}/${post.thumbnail_image}`}
                    className={styles.image}
                  />
                  <div className={styles.content}>
                    <p>{post.title}</p>
                    <p>
                      Topic: <span>{post.topic}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.divider} />
          <div className={styles.postPanel}>
            <h2>Last Week</h2>
            <div className={styles.panelBody}>
              {lastPosts.map((post: IPost, index: number) => (
                <div
                  key={`${post.title}-${index}`}
                  className={styles.postItem}
                  onClick={() => navigate(post._id)}
                >
                  <img src={post.thumbnail_image} className={styles.image} />
                  <div className={styles.content}>
                    <p>{post.title}</p>
                    <p>
                      Topic: <span>{post.topic}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
