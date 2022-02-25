import React from 'react';
import { Table,Row } from "react-bootstrap";
import styles from "./styles.module.scss";

const ImputedValuesTable = (data) => {
    const {result,tuple_count}=data;
    var col_index=0;

    return (
        <Row style={{padding:"0 5%"}}>
            <h4 className={`${styles.datasetname} pb-1`}>
              Dataset Imputation results :
              <span style={{ float: "right" }} className="pb-2">
                {" "}
              </span>
            </h4>
            {"\n"}
            <Table
              striped
              bordered
              hover
              size="md"
              className={styles.table}
              //trStyle={rowStyleFormat}
            >
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Column Name</th>
                  <th>Imputed count</th>
                  <th>Imputed % count</th>
                </tr>
              </thead>
              <tbody>
                {result &&
                  result.data.map((column) => (
                    <tr
                      key={column.col_name}
                    >
                      <td style={{ width: "10%" }}>{(col_index = col_index + 1)}</td>
                      <td style={{ width: "30%" }}>{column.col_name} </td>
                      <td style={{ width: "25%" }}>{column.imputed_count} </td>
                      <td style={{ width: "25%" }}>{((column.imputed_count/tuple_count)*100).toFixed(2)}</td>
                    </tr>
                  ))
                  }
              </tbody>
            </Table>
          </Row>
    )
}

export default ImputedValuesTable
