import Select from "react-select";
import makeAnimated from "react-select/animated";

const animatedComponents = makeAnimated();
const MultiSelect = ({ selected, options, ...props }) => (
  <Select
    closeMenuOnSelect={false}
    components={animatedComponents}
    value={convertOptionsToFormat(selected)}
    isMulti
    options={convertOptionsToFormat(options)}
    {...props}
  />
);

const convertOptionsToFormat = (items) =>
  items.map((item) => ({
    label: item,
    value: item,
  }));

export default MultiSelect;
