import { ChangeEvent, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Card } from '@/components/common';
import { ImageUpload, Input, TextField } from '@/components/forms';

import { HttpService } from '@/services';

import { ImageType } from '@/interfaces';

import styles from './NewPost.module.scss';
import { enqueueSnackbar } from 'notistack';

interface IPost {
  title: string;
  topic: string;
  body?: string;
  thumbImg?: ImageType;
  largeImg?: ImageType;
}

const initialPost: IPost = {
  title: '',
  topic: '',
  body: '',
};

const backToPath = '/admin/settings/dashboard/posts';

export function NewPost() {
  const { id: postID }: any = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<IPost>(initialPost);
  const [images, setImages] = useState<{
    thumb: string;
    large: string;
  }>({
    thumb: '',
    large: '',
  });

  const updatePost = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string,
  ) => {
    setPost({ ...post, [field]: e.target.value });
  };

  const onCreateClick = () => {
    if (postID === 'create') {
      const formData = new FormData();
      formData.append('title', post.title);
      formData.append('topic', post.topic);
      formData.append('body', post.body || '');
      formData.append('image', post.thumbImg as File);
      formData.append('image', post.largeImg as File);
      HttpService.post('/settings/general/support', formData).then(response => {
        const { message } = response;
        if (message === 'created') {
          enqueueSnackbar('Post added.', { variant: 'success' });
          navigate(backToPath);
        }
      });
    } else {
      HttpService.put('/settings/general/support', post, { id: postID }).then(
        response => {
          const { message } = response;
          if (message === 'updated') {
            enqueueSnackbar('Post updated.', { variant: 'success' });
            navigate(backToPath);
          }
        },
      );
    }
  };

  const onImageChange = (key: string) => (image: File) => {
    setPost({ ...post, [key]: image });
  };

  useEffect(() => {
    if (!postID || postID === 'create') return;
    HttpService.get(`/settings/general/support/${postID}`).then(response => {
      const { thumbnail_image, large_image } = response;
      setPost(response);
      setImages({ thumb: thumbnail_image, large: large_image });
    });
  }, [postID]);

  return (
    <Card title="Support Center" className={styles.root}>
      <div className={styles.container}>
        <div className={styles.form}>
          <div className={styles.control}>
            <p>Title</p>
            <Input
              value={post.title}
              updateValue={(e: ChangeEvent<HTMLInputElement>) =>
                updatePost(e, 'title')
              }
              placeholder="Title"
            />
          </div>
          <div className={styles.control}>
            <p>Topic</p>
            <Input
              value={post.topic}
              updateValue={(e: ChangeEvent<HTMLInputElement>) =>
                updatePost(e, 'topic')
              }
              placeholder="Topic"
            />
          </div>
        </div>
        <div className={styles.images}>
          <h2>Thumbnail Image</h2>
          <ImageUpload
            exWidth={323}
            exHeight={191}
            baseImagePath={images.thumb}
            updateBaseImage={onImageChange('thumbImg')}
          />
          <h2>Thumbnail Image</h2>
          <ImageUpload
            exWidth={674}
            exHeight={410}
            baseImagePath={images.large}
            updateBaseImage={onImageChange('largeImg')}
          />
        </div>
      </div>
      <div className={styles.bodyControl}>
        <p>Body</p>
        <TextField
          rows={15}
          placeholder="Body"
          value={post.body}
          updateValue={(e: ChangeEvent<HTMLTextAreaElement>) =>
            updatePost(e, 'body')
          }
          className={styles.bodyInput}
        />
      </div>
      <div className={styles.buttonBar}>
        <button
          className={styles.cancelButton}
          onClick={() => navigate(backToPath)}
        >
          Cancel
        </button>
        <button className={styles.addButton} onClick={onCreateClick}>
          {postID === 'create' ? 'Add' : 'Edit'}
        </button>
      </div>
    </Card>
  );
}
