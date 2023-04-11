import * as React from 'react';
import expect from 'expect';
import { screen, render, fireEvent } from '@testing-library/react';
import ListPaginationContextProvider, { usePaginationContext } from './list-pagination-context-provider';
import NaiveList from 'NaiveList';

describe('ListPaginationContextProvider', () => {
  const NaiveList = () => {
    const { pagination, setNextPage, setFirstPage, setPrevPage } = usePaginationContext();
    return (
      <div>
        <span>{`currentPage: ${pagination.currentPage}`}</span>
        <span>{`totalPages: ${pagination.totalPages}`}</span>
        <span>{`pageSize: ${pagination.pageSize}`}</span>
        <button onClick={setFirstPage}>go to first page</button>
        {pagination.nextEnabled && <button onClick={setNextPage}>view more</button>}
        {pagination.previousEnabled && <button onClick={setPrevPage}>Go to previous page</button>}
      </div>
    );
  };

  it('should return currentPage, totalPages, pageSize and view more button', () => {
    const { getByText } = render(
      <ListPaginationContextProvider
        value={{
          total: 4,
          perPage: 2,
        }}
      >
        <NaiveList />
      </ListPaginationContextProvider>,
    );

    expect(getByText('currentPage: 1')).not.toBeNull();
    expect(getByText('totalPages: 2')).not.toBeNull();
    expect(getByText('pageSize: 2')).not.toBeNull();
    expect(getByText('view more')).not.toBeNull();
  });

  it('should return currentPage, totalPages, pageSize and view more button', () => {
    const { getByText } = render(
      <ListPaginationContextProvider
        value={{
          total: 4,
          perPage: 2,
        }}
      >
        <NaiveList />
      </ListPaginationContextProvider>,
    );

    fireEvent.click(getByText('view more'));

    expect(getByText('currentPage: 2')).not.toBeNull();
    expect(getByText('totalPages: 2')).not.toBeNull();
    expect(getByText('pageSize: 2')).not.toBeNull();
    expect(screen.queryByText('view more')).toBeNull();
  });

  it('setFirstPage', () => {
    const { getByText } = render(
      <ListPaginationContextProvider
        value={{
          total: 6,
          perPage: 2,
        }}
      >
        <NaiveList />
      </ListPaginationContextProvider>,
    );

    fireEvent.click(getByText('view more'));
    fireEvent.click(getByText('go to first page'));

    expect(getByText('currentPage: 1')).not.toBeNull();
    expect(getByText('totalPages: 3')).not.toBeNull();
  });

  test('setPrevPage', () => {
    const { getByText } = render(
      <ListPaginationContextProvider
        value={{
          total: 10,
          perPage: 2,
        }}
      >
        <NaiveList />
      </ListPaginationContextProvider>,
    );

    fireEvent.click(getByText('view more'));
    fireEvent.click(getByText('view more'));

    fireEvent.click(getByText('Go to previous page'));

    expect(getByText('currentPage: 2')).not.toBeNull();
  });

  test('negative values, zero values', () => {
    const { getByText } = render(
      <ListPaginationContextProvider
        value={{
          total: 4,
          perPage: 2,
        }}
      >
        <NaiveList />
      </ListPaginationContextProvider>,
    );

    fireEvent.click(getByText('Go to previous page'));

    const currentPage = parseInt(screen.getByText(/currentPage:/)!.textContent!.split(':')[1]);

    expect(currentPage).toBeGreaterThanOrEqual(1);
  });

  test('첫번째 페이지에서 이전 버튼을 누르면 이전 페이지로 이동 불가', async () => {
    const List = () => {
      const { pagination, setNextPage, setFirstPage, setPrevPage } = usePaginationContext();
      return (
        <div>
          <span>{`currentPage: ${pagination.currentPage}`}</span>
          <span>{`totalPages: ${pagination.totalPages}`}</span>
          <span>{`pageSize: ${pagination.pageSize}`}</span>
          <button onClick={setFirstPage}>go to first page</button>
          <button onClick={setNextPage}>view more</button>
          <button onClick={setPrevPage}>Go to previous page</button>
        </div>
      );
    };

    const { getByText, queryByText } = render(
      <ListPaginationContextProvider
        value={{
          total: 4,
          perPage: 2,
        }}
      >
        <List />
      </ListPaginationContextProvider>,
    );

    expect(getByText('currentPage: 1')).not.toBeNull();
    expect(getByText('totalPages: 2')).not.toBeNull();

    fireEvent.click(getByText('Go to previous page'));
    expect(queryByText('currentPage: 0')).toBeNull();
    expect(getByText('currentPage: 1')).not.toBeNull();
  });
});

test('첫번째 페이지에서 다음 버튼을 누르면 다음 페이지로 이동', async () => {
  const { getByText } = render(
    <ListPaginationContextProvider
      value={{
        total: 6,
        perPage: 2,
      }}
    >
      <NaiveList />
    </ListPaginationContextProvider>,
  );

  expect(getByText('currentPage: 1')).not.toBeNull();
  expect(getByText('totalPages: 3')).not.toBeNull();

  fireEvent.click(getByText('view more'));

  expect(getByText('currentPage: 2')).not.toBeNull();
  expect(getByText('totalPages: 3')).not.toBeNull();
});

test('첫번째와 마지막 페이지 사이의 위치에 있으면 이전, 다음으로 이동 가능', async () => {
  const { getByText } = render(
    <ListPaginationContextProvider
      value={{
        total: 6,
        perPage: 2,
      }}
    >
      <NaiveList />
    </ListPaginationContextProvider>,
  );

  fireEvent.click(getByText('view more'));
  fireEvent.click(getByText('view more'));
  expect(getByText('currentPage: 3')).not.toBeNull();

  fireEvent.click(getByText('Go to previous page'));
  expect(getByText('currentPage: 2')).not.toBeNull();
});

test('마지막 페이지에서는 다음 페이지 누르면 다음 페이지로 이동 불가', () => {
  const { getByText } = render(
    <ListPaginationContextProvider
      value={{
        total: 4,
        perPage: 2,
      }}
    >
      <NaiveList />
    </ListPaginationContextProvider>,
  );

  fireEvent.click(getByText('view more'));
  fireEvent.click(getByText('view more'));
  expect(getByText('view more').hasAttribute('disabled')).toBeTruthy();
});

test('마지막 페이지에서는 이전 페이지 누르면 이전 페이지로 이동', async () => {
  const { getByText } = render(
    <ListPaginationContextProvider
      value={{
        total: 6,
        perPage: 2,
      }}
    >
      <NaiveList />
    </ListPaginationContextProvider>,
  );

  fireEvent.click(getByText('view more'));
  fireEvent.click(getByText('view more'));
  expect(getByText('currentPage: 3')).not.toBeNull();

  fireEvent.click(getByText('Go to previous page'));
  expect(getByText('currentPage: 2')).not.toBeNull();
  expect(getByText('totalPages: 3')).not.toBeNull();
});

test('total 값이 음수 값일 때 ', async () => {
  const { getByText } = render(
    <ListPaginationContextProvider
      value={{
        total: -6,
        perPage: 2,
      }}
    >
      <NaiveList />
    </ListPaginationContextProvider>,
  );

  expect(usePaginationContext.getState().pagination.totalItems).toEqual(1);
  expect(getByText('totalPages: 1')).not.toBeNull();
});

test('perPage 값이 음수 값일 때', async () => {
  const { getByText } = render(
    <ListPaginationContextProvider
      value={{
        total: 6,
        perPage: -2,
      }}
    >
      <NaiveList />
    </ListPaginationContextProvider>,
  );

  expect(usePaginationContext.getState().pagination.pageSize).toEqual(1);
  expect(getByText('totalPages: 6')).not.toBeNull();
});
