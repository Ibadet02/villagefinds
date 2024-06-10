import clsx from 'clsx';

import styles from './Calendar.module.scss';

const initialMonthLabels = [
  'January',
  'Febuary',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const initialWeekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface ICalendarProps {
  dates: Date[];
  selectedDay: Date | null;
  onDaySelect: (_: Date | null) => void;
  availableText: string;
  currentText: string;
  selectedText: string;
}

export function Calendar({
  dates,
  selectedDay,
  onDaySelect,
  availableText,
  currentText,
  selectedText,
}: ICalendarProps) {
  const today = new Date();
  const isDaySame = (day1: Date, day2: Date) => {
    return (
      day1.getFullYear() === day2.getFullYear() &&
      day1.getMonth() === day2.getMonth() &&
      day1.getDate() === day2.getDate()
    );
  };

  const getDayList = (date: Date) => {
    const dayList = [];
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    if (firstDayOfMonth.getDay() === 0)
      firstDayOfMonth.setDate(firstDayOfMonth.getDate() - 7);
    if (lastDayOfMonth.getDay() === 6)
      lastDayOfMonth.setDate(lastDayOfMonth.getDate() + 7);

    let iterator = firstDayOfMonth;
    if (iterator.getDay()) {
      while (true) {
        if (!iterator.getDay()) break;
        iterator.setDate(iterator.getDate() - 1);
      }
    }

    iterator = lastDayOfMonth;
    if (iterator.getDay() !== 6) {
      while (true) {
        if (iterator.getDay() === 6) break;
        iterator.setDate(iterator.getDate() + 1);
      }
    }
    iterator.setDate(iterator.getDate() + 1);

    iterator = new Date(firstDayOfMonth);
    while (!isDaySame(iterator, lastDayOfMonth)) {
      dayList.push(iterator);
      iterator = new Date(
        iterator.getFullYear(),
        iterator.getMonth(),
        iterator.getDate() + 1,
      );
    }

    return dayList;
  };

  return (
    <div className={styles.calendar}>
      <div className={styles.content}>
        <p className={styles.yearMonth}>
          {initialMonthLabels[(selectedDay ?? today).getMonth()]}{' '}
          {(selectedDay ?? today).getFullYear()}
        </p>
        <div className={styles.body}>
          <div className={styles.weekdays}>
            {initialWeekdayLabels.map((weekday: string, index: number) => (
              <div key={index} className={styles.weekday}>
                {weekday}
              </div>
            ))}
          </div>
          <div className={styles.days}>
            {getDayList(selectedDay ?? today).map(
              (day: Date, index: number) => (
                <div
                  key={index}
                  className={clsx(
                    styles.day,
                    selectedDay && isDaySame(day, selectedDay)
                      ? styles.currentDay
                      : isDaySame(day, new Date())
                      ? styles.today
                      : dates.find(available => isDaySame(day, available))
                      ? styles.availableDay
                      : '',
                  )}
                  onClick={() => onDaySelect(day)}
                >
                  {day.getDate()}
                </div>
              ),
            )}
          </div>
        </div>
      </div>
      <div className={styles.labels}>
        <div className={clsx(styles.label, styles.available)}>
          <span />
          <p>{availableText}</p>
        </div>
        <div className={clsx(styles.label, styles.current)}>
          <span />
          <p>{currentText}</p>
        </div>
        <div className={clsx(styles.label, styles.selected)}>
          <span />
          <p>{selectedText}</p>
        </div>
      </div>
    </div>
  );
}
