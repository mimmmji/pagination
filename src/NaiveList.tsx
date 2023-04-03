import React from 'react';

import { usePaginationContext } from "list-pagination-context-provider"

const NaiveList = () => {
    const{pagination, setNextPage} = usePaginationContext();

    return(
    <div>
        <span>{`currentPage: ${pagination.currentPage}`}</span>
        <span>{`totalPages: ${pagination.totalPages}`}</span>
        <span>{`pageSize: ${pagination.pageSize}`}</span>
        {pagination.nextEnabled && <button onClick={setNextPage}>view more</button>}
    </div>
    )
}
export default NaiveList;