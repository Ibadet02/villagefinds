import { useNavigate, useParams } from 'react-router-dom';
import { FaChevronLeft } from 'react-icons/fa6';

import { Card } from '@/components/common';

import styles from './Detail.module.scss';
import { useEffect, useState } from 'react';
import { SERVER_URL } from '@/config/global';
import { HttpService } from '@/services';

const BACK_PATH = '/vendor/support';

interface IPost {
  _id?: string;
  title: string;
  topic: string;
  body: string;
  thumbnail_image: string;
  large_image: string;
}

const initialPost: IPost = {
  title: '',
  topic: '',
  body: '',
  thumbnail_image: '',
  large_image: '',
};

export function SupportDetail() {
  const navigate = useNavigate();
  const { id: postID } = useParams();

  const [post, setPost] = useState<IPost>(initialPost);

  useEffect(() => {
    if (!postID) return;
    HttpService.get(`/settings/general/support/${postID}`).then(response => {
      setPost(response || initialPost);
    });
  }, [postID]);

  return (
    <Card className={styles.root}>
      <div className={styles.backImage}>
        <img
          src={`${SERVER_URL}/${post.large_image}`}
          className={styles.backImage}
        />
        <span onClick={() => navigate(BACK_PATH)}>
          <FaChevronLeft />
        </span>
      </div>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>{post.title}</h1>
          <p>
            Topic: <span>{post.topic}</span>
          </p>
        </div>
        <video src="" controls></video>
        <p>{post.body}</p>
      </div>
    </Card>
  );
}
