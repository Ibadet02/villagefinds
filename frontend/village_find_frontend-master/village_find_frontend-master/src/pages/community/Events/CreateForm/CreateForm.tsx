import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

import { Card } from '@/components/common';
import { Button, Input } from '@/components/forms';

import styles from './CreateForm.module.scss';

interface ICreateFormProps {
  questions: string[];
  updateQuestions: (_: string[]) => void;
  onFinalUpdate: (_: string[]) => void;
}

const homePath = '/village-community/events';

export function CreateForm({
  questions,
  updateQuestions,
  onFinalUpdate,
}: ICreateFormProps) {
  const navigate = useNavigate();

  const [newQuestion, setNewQuestion] = useState('');

  const onAddClick = () => {
    updateQuestions([...questions, newQuestion]);
    setNewQuestion('');
  };

  const onRemoveClick = (index: number) => {
    updateQuestions([
      ...questions.slice(0, index),
      ...questions.slice(index + 1, questions.length),
    ]);
  };

  return (
    <Card className={styles.root}>
      <div className={styles.text}>
        <h1>Create a Form</h1>
        <p>
          Use this form builder if you do not have an external events software.
        </p>
      </div>
      <div className={styles.forms}>
        {questions.map((question: string, index: number) => (
          <div className={styles.question}>
            <div className={styles.gridIcon}>
              {Array(6)
                .fill('')
                .map((_: string, index: number) => (
                  <span key={index} />
                ))}
            </div>
            <Input
              placeholder="Question"
              disabled
              rounded="full"
              border="none"
              bgcolor="secondary"
              value={question}
              className={styles.input}
            />
            <Button
              className={styles.button}
              onClick={() => onRemoveClick(index)}
            >
              Remove
            </Button>
          </div>
        ))}
        <div className={styles.question}>
          <div className={styles.gridIcon}>
            {Array(6)
              .fill('')
              .map((_: string, index: number) => (
                <span key={index} />
              ))}
          </div>
          <Input
            placeholder="Question"
            rounded="full"
            border="none"
            bgcolor="secondary"
            value={newQuestion}
            updateValue={(e: any) => setNewQuestion(e.target.value)}
            className={styles.input}
          />
          <Button
            className={clsx(styles.button, styles.addButton)}
            onClick={onAddClick}
          >
            Add Question
          </Button>
        </div>
      </div>
      <div className={styles.buttons}>
        <Button className={styles.button} onClick={() => navigate(homePath)}>
          Cancel
        </Button>
        <Button
          className={clsx(styles.button, styles.addButton)}
          onClick={() => onFinalUpdate(questions)}
        >
          Update
        </Button>
      </div>
    </Card>
  );
}
