import clsx from "clsx";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

import styles from "./Pagination.module.scss";

interface IPaginationProps {
  pageCount: number;
  currentPage: number;
  navigate: (_: number) => void;
}

export function Pagination({
  pageCount = 1,
  currentPage = 1,
  navigate = () => {},
}: IPaginationProps) {
  const getPages = () => {
    if (pageCount <= 4) {
      return [...Array(pageCount + 1).keys()].slice(1);
    } else if (currentPage <= 4) {
      return [1, 2, 3, 4, 5];
    } else if (currentPage >= pageCount - 3) {
      return [...Array(5).keys()].reverse().map((v) => pageCount - v);
    } else {
      return [currentPage - 1, currentPage, currentPage + 1];
    }
  };

  return (
    <div className={styles.root}>
      <button
        disabled={currentPage === 1}
        className={clsx(styles.page, currentPage === 1 ? styles.disabled : "")}
        onClick={() => navigate(currentPage - 1)}
      >
        <FaChevronLeft />
      </button>
      {!getPages().includes(1) && currentPage > 4 && (
        <>
          <button className={styles.page} onClick={() => navigate(1)}>1</button>
          <span className={styles.page}>...</span>
        </>
      )}
      {getPages().map((page) => (
        <button
          key={`page-${page}`}
          className={clsx(
            styles.page,
            currentPage === page ? styles.active : ""
          )}
          onClick={() => navigate(page)}
        >
          {page}
        </button>
      ))}
      {!getPages().includes(pageCount) &&
        ((currentPage >= pageCount - 4 && currentPage <= 4) ||
          currentPage <= pageCount - 4) && (
          <>
            <span className={styles.page}>...</span>
            <button className={styles.page} onClick={() => navigate(pageCount)}>{pageCount}</button>
          </>
        )}
      <button
        disabled={currentPage === pageCount}
        className={clsx(
          styles.page,
          currentPage === pageCount ? styles.disabled : ""
        )}
        onClick={() => navigate(currentPage + 1)}
      >
        <FaChevronRight />
      </button>
    </div>
  );
}
