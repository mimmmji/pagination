import React from 'react';
import { create } from 'zustand';

type PaginationState = {
  totalItems: number;
  pageSize: number;
  currentPage: number;
};

type PaginationMeta = {
  totalPages: number;
  previousEnabled: boolean;
  nextEnabled: boolean;
};

type Pagination = PaginationState & PaginationMeta;
type PaginationArgs = Pick<PaginationState, 'totalItems' | 'pageSize'>;

const INITIAL_PAGE = 1;

export const usePaginationContext = create<{
  pagination: Pagination;
  setPagination: (pg: PaginationArgs) => void;
  setNextPage: () => void;
  setFirstPage: () => void;
  setPrevPage: () => void;
}>((set /*get*/) => ({
  pagination: {
    totalPages: 0,
    pageSize: 0,
    currentPage: INITIAL_PAGE,
    nextEnabled: false,
    previousEnabled: false,
    totalItems: 0,
  },
  setPagination: (args: PaginationArgs) =>
    set((state) => {
      const totalPages = Math.ceil(args.totalItems / args.pageSize);
      const nextEnabled = state.pagination.currentPage < totalPages;

      return {
        pagination: {
          ...state.pagination,
          ...args,
          totalPages,
          nextEnabled,
        },
      };
    }),
  setNextPage: () =>
    set((state) => {
      const { currentPage, totalPages } = state.pagination;
      const nextPage = currentPage + 1;

      if (nextPage > totalPages) {
        return state;
      }
  
      const nextEnabled = nextPage < totalPages;
      const previousEnabled = nextPage > 1;

      return {
        pagination: {
          ...state.pagination,
          currentPage: nextPage,
          nextEnabled,
          previousEnabled,
        },
      };
    }),
  setPrevPage: () =>
    set((state) => {
      const { currentPage, totalPages } = state.pagination;
      const prevPage = currentPage - 1;

      if (prevPage < 1) {
        return state;
      }
  
      const nextEnabled = totalPages > prevPage;
      const previousEnabled = prevPage > 1;

      return {
        pagination: {
          ...state.pagination,
          currentPage: prevPage,
          previousEnabled,
          nextEnabled,
        },
      };
    }),
  setFirstPage: () =>
    set((state) => {
      const { totalPages } = state.pagination;
      const nextEnabled = totalPages > 1;

      return {
        pagination: {
          ...state.pagination,
          currentPage: INITIAL_PAGE,
          nextEnabled,
          previousEnabled: false,
        },
      };
    }),
}));

export interface ListContextProps {
  total: number;
  perPage: number;
}

type ListPaginationContextProps = ListContextProps;

const ListPaginationContextProvider: FCC<{ value: ListPaginationContextProps }> = ({ children, value }) => {
  const { setPagination } = usePaginationContext();

  React.useEffect(() => {
    setPagination({
      pageSize: value.perPage,
      totalItems: value.total,
    });
  }, [value, setPagination]);

  return <>{children}</>;
};

export default ListPaginationContextProvider;
