import {
  Button,
  Col,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { RiCloseCircleLine } from "react-icons/ri";
import { useState, useEffect } from "react";
import styles from "./QueryBuilder.module.scss";
import FormModal from "../../Content/FormModal/FormModal";
const QueryBuilder = ({ features, discreteCols, onChange }) => {
  const [dialogStates, setDialogStates] = useState({
    addFilter: false,
    addAggregation: false,
    addGroupBy: false,
  });

  const [query, setQuery] = useState({
    filters: [],
    groupBy: null,
    aggregate: null,
  });

  const closeAddFilterDialog = () =>
    setDialogStates((prev) => ({ ...prev, addFilter: false }));
  const openAddFilterDialog = () =>
    setDialogStates((prev) => ({ ...prev, addFilter: true }));

  const closeAggregationDialog = () =>
    setDialogStates((prev) => ({ ...prev, addAggregation: false }));
  const openAggregationDialog = () =>
    setDialogStates((prev) => ({ ...prev, addAggregation: true }));

  const closeGroupByDialog = () =>
    setDialogStates((prev) => ({ ...prev, addGroupBy: false }));
  const openGroupByDialog = () =>
    setDialogStates((prev) => ({ ...prev, addGroupBy: true }));

  const onFilterAdd = (filter) =>
    setQuery((prev) => ({ ...prev, filters: [...prev.filters, filter] }));

  const onAggregationAdd = (aggregate) =>{
    setQuery((prev) => ({ ...prev, aggregate }));
    closeAggregationDialog();
  }

  const onGroupByAdd = (col) =>{
    setQuery((prev) => ({ ...prev, groupBy: col.col }));
    closeGroupByDialog();
  }

  const removeAggregate = () => {
    setQuery((prev) => ({ ...prev, aggregate: null }));
  };
  const removeFilter = (filter) => {
    setQuery((prev) => ({
      ...prev,
      filters: prev.filters.filter((f) => f !== filter),
    }));
  };

  const removeGroupBy = () => setQuery((prev) => ({ ...prev, groupBy: null }));
  useEffect(() => {
    onChange(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);
  return (
    <Row className={styles.container}>
      <Col className={styles.whereContainer}>
        <AddFilterDialog
          show={dialogStates.addFilter}
          onClose={closeAddFilterDialog}
          onAdd={onFilterAdd}
          columns={features}
          discreteCols={discreteCols}
        />
        <div className={styles.filters}>
          {query.filters.length > 0 ? (
            query.filters.map((filter) => (
              <Tag
                onRemove={() => removeFilter(filter)}
              >{`${filter.lhs} ${filter.op} ${filter.rhs}`}</Tag>
            ))
          ) : (
            <p className={styles.empty}>Add filter</p>
          )}
        </div>
        <div className={styles.addButtonContainer}>
          <Button
            onClick={openAddFilterDialog}
            variant="outline-primary"
            size="sm"
          >
            <FaPlus />
          </Button>
        </div>
      </Col>
      <Col className={styles.rightContainer}>
        <Row className={styles.groupByContainer}>
          <AddGroupByDialog
            show={dialogStates.addGroupBy}
            onClose={closeGroupByDialog}
            onAdd={onGroupByAdd}
            columns={features}
          />
          <div className={styles.filters}>
            {query.groupBy ? (
              <Tag onRemove={removeGroupBy}>{query.groupBy}</Tag>
            ) : (
              <p className={styles.empty}>Add Group By</p>
            )}
          </div>
          <div className={styles.addButtonContainer}>
            <Button
              onClick={openGroupByDialog}
              variant="outline-primary"
              size="sm"
              disabled={!!query.groupBy}
            >
              <FaPlus />
            </Button>
          </div>
        </Row>
        <Row className={styles.aggregateByContainer}>
          <AddAggregationDialog
            show={dialogStates.addAggregation}
            onClose={closeAggregationDialog}
            onAdd={onAggregationAdd}
            columns={features}
          />
          <div className={styles.filters}>
            {query.aggregate ? (
              <Tag
                onRemove={removeAggregate}
              >{`${query.aggregate.method} of ${query.aggregate.col}`}</Tag>
            ) : (
              <p className={styles.empty}>Add Aggregation</p>
            )}
          </div>
          <div className={styles.addButtonContainer}>
            <Button
              onClick={openAggregationDialog}
              variant="outline-primary"
              size="sm"
              disabled={!!query.aggregate}
            >
              <FaPlus />
            </Button>
          </div>
        </Row>
      </Col>
    </Row>
  );
};

const Tag = ({ children, onRemove }) => {
  return (
    <div className={styles.tag}>
      <div className={styles.content}>{children}</div>
      <div className={styles.cancel}>
        <button onClick={onRemove}>
          <RiCloseCircleLine />
        </button>
      </div>
    </div>
  );
};



const AddFilterDialog = ({ show, onClose, onAdd, columns, discreteCols }) => {
  const [state, setState] = useState({});

  const onSubmit = () => onAdd(state);

  return (
    <FormModal
      show={show}
      onClose={onClose}
      onSubmit={onSubmit}
      ModalTitle="Add Filters"
      animation={true}
      closeOnSubmit={true}
    >
      <Row>
        <Form.Group as={Col} md="4" controlId="dataset-name">
          <Form.Label>Column Name</Form.Label>
          <InputGroup hasValidation>
            <Form.Control
              onChange={(e) => {
                setState((prev) => ({
                  ...prev,
                  lhs: e.target.value,
                }));
              }}
              as="select"
              required
            >
              <option value="">Select Column</option>
              {columns.map((column) => (
                <option key={column.column_name} value={column.column_name}>{column.column_name}</option>
              ))}
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              Please select Column
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
        <Form.Group as={Col} md="4" controlId="dataset-name">
          <Form.Label>Operator</Form.Label>
          <InputGroup hasValidation>
            <Form.Control
              onChange={(e) => {
                setState((prev) => ({
                  ...prev,
                  op: e.target.value,
                }));
              }}
              as="select"
              required
            >
              <option value="">Select Operator</option>
              <option  key=">" value=">">{">"}</option>
              <option key=">=" value=">=">{">="}</option>
              <option key="<=" value="<=">{"<="}</option>
              <option key="<" value="<">{"<"}</option>
              <option key="==" value="==">{"="}</option>
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              Please Column
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
        <Form.Group as={Col} md="4" controlId="dataset-name">
          <Form.Label>Value</Form.Label>
          <InputGroup hasValidation>
            {discreteCols[state.lhs] &&
            discreteCols[state.lhs].data_type === "STRING" ? (
              <Form.Control
                onChange={(e) => {
                  setState((prev) => ({
                    ...prev,
                    rhs: e.target.value,
                  }));
                }}
                as="select"
                required
              >
                <option value="">Select Column</option>
                {discreteCols[state.lhs].values.map((val) => (
                  <option key={val} value={val}>{val}</option>
                ))}
              </Form.Control>
            ) : (
              <Form.Control
                type="text"
                placeholder="Value"
                aria-describedby="inputGroupPrepend"
                onChange={(e) => {
                  setState((prev) => ({
                    ...prev,
                    rhs: e.target.value,
                  }));
                }}
                required
              />
            )}
            <Form.Control.Feedback type="invalid">
              Please enter value
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
      </Row>
    </FormModal>
  );
};

const AddAggregationDialog = ({ show, onClose, onAdd, columns }) => {
  const [state, setState] = useState({});

  const onSubmit = () => onAdd(state);

  return (
    <FormModal
      show={show}
      onClose={onClose}
      onSubmit={onSubmit}
      ModalTitle="Add Aggregation"
    >
      <Row>
        <Form.Group as={Col} md="6" controlId="col-name">
          <Form.Label>Column Name</Form.Label>
          <InputGroup hasValidation>
            <Form.Control
              onChange={(e) => {
                setState((prev) => ({
                  ...prev,
                  col: e.target.value,
                }));
              }}
              as="select"
              required
            >
              <option value="">Select Column</option>
              {columns
                .filter((column) => column.dataType !== "string")
                .map((column) => (
                  <option key={column.column_name} value={column.column_name}>
                    {column.column_name}
                  </option>
                ))}
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              Please select Column
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
        <Form.Group as={Col} md="6" controlId="aggregation-name">
          <Form.Label>Aggregation Method</Form.Label>
          <InputGroup hasValidation>
            <Form.Control
              onChange={(e) => {
                setState((prev) => ({
                  ...prev,
                  method: e.target.value,
                }));
              }}
              as="select"
              required
            >
              <option value="">Select aggregation method</option>
              <option key="min" value="min">{"min"}</option>
              <option key="max" value="max">{"max"}</option>
              <option key="sum" value="sum">{"sum"}</option>
              <option key="count" value="count">{"count"}</option>
              <option key="mean" value="mean">{"mean"}</option>
              <option key="unique" value="unique">{"Unique"}</option>
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              Please select aggregation method
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
      </Row>
    </FormModal>
  );
};

const AddGroupByDialog = ({ show, onClose, onAdd, columns }) => {
  const [state, setState] = useState({});

  const onSubmit = () => onAdd(state);

  return (
    <FormModal
      show={show}
      onClose={onClose}
      onSubmit={onSubmit}
      ModalTitle="Add Group By Field"
    >
      <Row>
        <Form.Group as={Col} controlId="col-name">
          <Form.Label>Column Name</Form.Label>
          <InputGroup hasValidation>
            <Form.Control
              onChange={(e) => {
                setState((prev) => ({
                  ...prev,
                  col: e.target.value,
                }));
              }}
              as="select"
              required
            >
              <option value="">Select Column</option>
              {columns.map((column) => (
                <option key={column.column_name} value={column.column_name}>{column.column_name}</option>
              ))}
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              Please select Column
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
      </Row>
    </FormModal>
  );
};

export default QueryBuilder;
