import { Col, Form, Row } from "react-bootstrap";

const MinMaxFilterInput = ({
  label,
  range,
  stepSize,
  currValues,
  onChange,
}) => {
  const onInputChange = (type) => (e) => {
    onChange({ ...currValues, [type]: e.target.value });
  };
  return (
    <Form.Group>
      <Form.Label>
        <span className="lead">{label}</span>
      </Form.Label>
      <Row>
        <Col xs={6}>
          <Form.Group>
            <Form.Label>Min</Form.Label>
            <Form.Control
              value={currValues.min}
              min={range.min}
              max={range.max}
              onChange={onInputChange("min")}
              type="number"
              stepSize={stepSize}
            />
          </Form.Group>
        </Col>
        <Col xs={6}>
          <Form.Group>
            <Form.Label>max</Form.Label>
            <Form.Control
              value={currValues.max}
              min={range.min}
              max={range.max}
              type="number"
              onChange={onInputChange("max")}
              stepSize={stepSize}
            />
          </Form.Group>
        </Col>
      </Row>
    </Form.Group>
  );
};
export default MinMaxFilterInput;
