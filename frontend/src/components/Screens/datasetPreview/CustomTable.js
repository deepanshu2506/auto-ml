
import React from "react";
import { useTable, usePagination, useGlobalFilter, useSortBy } from "react-table";
import styles from "./styles.module.scss";
import { Table,Button,Row,Col} from "react-bootstrap";
import { useEffect, useState } from "react";
import GlobalFilter from "./GlobalFilter";

export default function CustomTable({columns,
  data}) {
    const {
      getTableProps, 
      getTableBodyProps, 
      headerGroups,
      footerGroups,
      page, 
      nextPage,
      previousPage,
      canNextPage,
      canPreviousPage,
      pageOptions,
      gotoPage,
      pageCount,
      setPageSize,
      prepareRow,
      state,
      setGlobalFilter
    } = useTable({
      columns,
      data,
      // manualPagination:true,
      // pageCount:controlledPageCount
    },useGlobalFilter,useSortBy,usePagination);
    const {globalFilter,pageIndex,pageSize}=state
    useEffect(()=>{

    })
  return (
    <>
    <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter}/>
    <br/>
    <Table striped  {...getTableProps()}>
      <thead className="bg-primary py-1">
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                {column.render("Header")}
                <span> {column.isSorted? (column.isSortedDesc?
                  <i className="fa fa-arrow-down" aria-hidden="true"/>
                  :<i className="fa fa-arrow-up" aria-hidden="true"/>
                )
                :
                <span className={styles.disable}><i className="fa fa-arrow-down" aria-hidden="true"/></span>}</span>
              </th>
            ))}
          </tr>
        ))
        }
      </thead>
      <tbody {...getTableBodyProps()}>
        {page.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
      {/* <tfoot className="bg-primary">
      {footerGroups.map(footerGroup => (
          <tr {...footerGroup.getFooterGroupProps()}>
            {footerGroup.headers.map(column => (
              <th {...column.getFooterProps()}>
                {column.render("Footer")}
              </th>
            ))}
          </tr>
        ))}
      </tfoot> */}
    </Table>
    <Row className={styles.pagination}>
      <Col>
        <span>
          Go to page :{' '}
          <input type="number" defaultValue={pageIndex+1} 
          onChange={e =>{ const pageNumber=e.target.value ? Number(e.target.value)-1:0
          gotoPage(pageNumber)}}/>
        </span>
      </Col>
      <Col>
      <span> Show :{' '}
        <select value={pageSize} onChange={e=>setPageSize(Number(e.target.value))}>
          {[10,25,50].map(pageSize=>(
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </select>
      </span>
      </Col>
      <Col >
      <Button onClick={()=>gotoPage(0)} disabled={!canPreviousPage}> {'<<'} </Button>
      <Button onClick={()=>previousPage()} disabled={!canPreviousPage}>Previous</Button>
        <span>
          {' '}Page {' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
          {' '}
        </span>
      
        <Button onClick={()=>nextPage()} disabled={!canNextPage}>Next</Button>
        <Button onClick={()=>gotoPage(pageCount-1)} disabled={!canNextPage}> {'>>'} </Button>
      </Col>
    </Row>
    </>

  );
}
