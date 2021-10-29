import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Table as TableBase } from "react-bootstrap";
import PropTypes from "prop-types";
import _ from "lodash";
import "./styles.scss";
import Paginator from "../../../data/Paginator";

const InfiniteScrollTable = ({
  dataPaginator,
  headerCols,
  renderRow,
  renderEmpty,
  keyExtractor,
  ...props
}) => {
  const [data, setData] = useState([]);
  const loadMore = () => {
    setData((prev) => [...prev, ...dataPaginator.getNextPage()]);
  };
  React.useEffect(() => {
    setData(dataPaginator.reset().getNextPage());
  }, [dataPaginator]);

  React.useEffect(() => {
    const tableContainer = document.querySelector(".table-container");
    const onTableScroll = _.throttle((e) => {
      if (dataPaginator.hasMore()) {
        const lastRow = document.querySelector(".table tbody tr:last-child");
        const scrollHeight =
          tableContainer.scrollTop + tableContainer.clientHeight + 1;
        const lastRowOffset = lastRow.offsetTop + lastRow.clientHeight;
        if (scrollHeight >= lastRowOffset) {
          loadMore();
        }
      }
    }, 100);
    const scrollListener = tableContainer.addEventListener(
      "scroll",
      onTableScroll
    );
    return () => {
      tableContainer.removeEventListener("scroll", scrollListener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Row className="table-container flex-grow-1 ">
      <Col className="px-0">
        <TableBase hover className="table">
          <thead className="bg-primary">
            <tr>
              {headerCols.map((item, idx) => (
                <th key={idx}>{item}</th>
              ))}
            </tr>
          </thead>
          {data.length > 0 ? (
            <tbody>
              {data.map((item, idx) => (
                <tr
                  key={keyExtractor(item, idx)}
                  onClick={() => {
                    props.onRowClick && props.onRowClick(item);
                  }}
                >
                  {renderRow(item).map((cell, idx) => (
                    <td key={idx}>
                      {cell && cell !== "" ? (
                        cell
                      ) : (
                        <span className="not-available">-</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody className="empty-table">
              <tr>
                <td className="empty" colSpan="100%">
                  {renderEmpty()}
                </td>
              </tr>
            </tbody>
          )}
        </TableBase>
      </Col>
    </Row>
  );
};

InfiniteScrollTable.propTypes = {
  dataPaginator: PropTypes.instanceOf(Paginator).isRequired,
  headerCols: PropTypes.array.isRequired,
  renderRow: PropTypes.func.isRequired,
  renderEmpty: PropTypes.func.isRequired,
  keyExtractor: PropTypes.func.isRequired,

  onRowClick: PropTypes.func,
};

export default InfiniteScrollTable;
