import React from 'react';

import { usePaginationContext } from "list-pagination-context-provider"

const NaiveList = () => {
    const{pagination, setNextPage, setPrevPage, setFirstPage} = usePaginationContext();
    const { previousEnabled, nextEnabled } = pagination;

    return(
    <div>
        <span>{`currentPage: ${pagination.currentPage}`}</span>
        <span>{`totalPages: ${pagination.totalPages}`}</span>
        <span>{`pageSize: ${pagination.pageSize}`}</span>
        <button onClick={setFirstPage} disabled={!previousEnabled}>go to first page</button>
        <button onClick={setNextPage} disabled={!nextEnabled}>view more</button>
        <button onClick={setPrevPage} disabled={!previousEnabled}>Go to previous page</button>
    </div>
    )
}
export default NaiveList;