import { useState, useEffect, useRef } from 'react';
import { enqueueSnackbar } from 'notistack';
import { FaTimes } from 'react-icons/fa';

import clsx from 'clsx';

import {
  Button,
  Input,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from '@/components/forms';
import { PencilIcon } from '@/components/icons';

import { HttpService } from '@/services';

import { useOnClickOutside } from '@/utils';

import styles from './AIDialog.module.scss';

type TopicType =
  | 'product name'
  | 'short product description'
  | 'long product description'
  | 'disclaimer';

interface IAIDialogProps {
  open: boolean;
  onClose?: () => void;
  onSelect?: (_: string) => void;
  category: string;
  topic: TopicType;
}

const initialTones = [
  'Default',
  'Celebratory',
  'Empathetic',
  'Excited',
  'Formal',
  'Funny',
  'Witty',
];

export function AIDialog({
  open,
  onClose = () => { },
  onSelect = () => { },
  topic,
  category,
}: IAIDialogProps) {
  const [ansCount, setAnsCount] = useState(0);
  const [ansIndex, setAnsIndex] = useState(-1);
  const [ansTone, setAnsTone] = useState('Default');
  const [prompt, setPrompt] = useState('');
  const [answers, setAnswers] = useState<string[]>([]);
  const [editingIndex, setEditingIndex] = useState(-1);
  const dialogRef = useRef<HTMLDivElement>(null);

  const initializeStates = () => {
    setAnsCount(0);
    setAnsIndex(-1);
    setAnsTone('Default');
    setPrompt('');
    setAnswers([]);
    setEditingIndex(-1);
  };

  const onAnswerChange = (index: number) => (e: any) => {
    setAnswers(
      answers.map((answer: string, _index: number) =>
        index === _index ? e.target.value : answer,
      ),
    );
  };

  const onCountChange = (e: any) => {
    setAnsCount(Number(e.target.value));
  };

  const onRegenClick = () => {
    onSubmitClick();
  };

  const onAnsEditClick = (index: number) => () => {
    setEditingIndex(Number(index));
  };

  const onSubmitClick = () => {
    setAnswers(Array(ansCount).fill(''));
    HttpService.get(
      `/openai?count=${ansCount}&tone=${ansTone}&type=${topic}&category=${category}&prompt=${prompt}`,
    ).then(response => {
      const { status, answers } = response;
      if (status === 200) {
        setAnswers(answers);
      } else {
        enqueueSnackbar('Something went wrong with server.', {
          variant: 'error',
        });
      }
    });
  };

  const onSelectClick = () => {
    if (ansIndex === -1) {
      enqueueSnackbar('Choose one of the answers.', { variant: 'warning' });
      return;
    }
    onSelect(answers[ansIndex]);
    initializeStates();
  };

  useEffect(() => {
    if (open) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [open]);

  useEffect(() => {
    if (dialogRef.current === null) return;
    useOnClickOutside(dialogRef, onClose, 'mousedown');
  }, []);

  return (
    <div className={clsx(styles.root, !open ? styles.hide : '')}>
      <div className={styles.container} ref={dialogRef}>
        <div className={styles.content}>
          <div className={styles.mainForm}>
            <div className={styles.prompt}>
              <p className={styles.text}>Enter prompt for content generation</p>
              <TextField
                rows={5}
                rounded="full"
                className={styles.promptInput}
                placeholder="Write a caption about growing a business using social media"
                value={prompt}
                updateValue={(e: any) => setPrompt(e.target.value)}
              />
            </div>
            <div className={styles.elements}>
              <div className={styles.element}>
                <p className={styles.title}>Select tone</p>
                <Select
                  placeholder="Default"
                  className={styles.toneSelector}
                  options={initialTones}
                  value={ansTone}
                  updateValue={(tone: string) => setAnsTone(tone)}
                />
              </div>
              <div className={styles.element}>
                <p className={styles.title}>Generated Count</p>
                <Input
                  type="number"
                  name="count"
                  className={styles.countInput}
                  value={ansCount}
                  updateValue={onCountChange}
                />
              </div>
            </div>
            <Button className={styles.submitBtn} onClick={onSubmitClick}>
              Submit
            </Button>
          </div>
          <div className={styles.answers}>
            <div className={styles.header}>
              <p className={styles.title}>Select One</p>
              <Button className={styles.regenBtn} onClick={onRegenClick}>
                Regenerate
              </Button>
            </div>
            <div className={styles.body}>
              <RadioGroup
                value={ansIndex.toString()}
                updateValue={(value: string) => setAnsIndex(Number(value))}
                className={styles.answerList}
              >
                {answers.map((answer: string, index: number) => (
                  <div key={index} className={styles.answer}>
                    <Radio value={index.toString()} className={styles.radio} />
                    <div className={styles.description}>
                      <Input
                        value={answer}
                        className={styles.ansInput}
                        disabled={true}
                        adornment={{
                          position: 'right',
                          content: editingIndex !== index ? (
                            <PencilIcon onClick={onAnsEditClick(index)} className='cursor-pointer' />
                          ) : (
                            <></>
                          ),
                        }}
                      />
                      {editingIndex === index && <TextField
                        rows={5}
                        value={answer}
                        updateValue={onAnswerChange(index)}
                      />}
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
          <Button className={styles.chooseBtn} onClick={onSelectClick}>
            Select
          </Button>
        </div>
        <span className={styles.closeBtn} onClick={onClose}>
          <FaTimes size={24} />
        </span>
      </div>
    </div>
  );
}
