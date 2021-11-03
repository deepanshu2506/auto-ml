import styles from "./styles.module.scss";
import { BsArrowDown } from "react-icons/bs";
const FullyConnectedLayer = ({ numNeurons, activation, ...props }) =>
  `Fully Connected, ${numNeurons} neurons, ${activation} activation`;

const RecurrentLayer = ({ numNeurons, activation, ...props }) =>
  `Recurrent, ${numNeurons} neurons, ${activation} activation`;

const ConvolutionalLayer = ({
  numFilters,
  kernelSize,
  kernelStride,
  activation,
  ...props
}) =>
  `Convolutional, ${numFilters} (${kernelSize} x ${kernelSize}) filters, stride = ${kernelStride}, ${activation} activation`;
const PoolingLayer = ({ kernelSize, kernelStride }) =>
  `Max Pooling, (${kernelSize} x ${kernelSize}) filters, stride = ${kernelStride}`;

const DropoutLayer = ({ dropout, ...props }) =>
  `Dropout , probability=${dropout}`;

const LayerTypes = {
  1: FullyConnectedLayer,
  2: ConvolutionalLayer,
  3: PoolingLayer,
  4: RecurrentLayer,
  5: DropoutLayer,
  6: null,
  7: null,
};

const activations = {
  0: "sigmoid",
  1: "tanh",
  2: "relu",
  3: "softmax",
  4: "linear",
};

const mapToObjects = (arch) => {
  return arch.map((layer) => {
    return {
      type: layer[0],
      numNeurons: layer[1],
      activation: activations[layer[2]],
      numFilters: layer[3],
      kernelSize: layer[4],
      kernelStride: layer[5],
      poolSize: layer[6],
      dropout: layer[7],
    };
  });
};

const ArchitectureDiagram = ({ architecture }) => {
  const arch = mapToObjects(architecture);
  return (
    <div className={styles.container}>
      {arch.map((layer, idx) => {
        const LayerContentComponent = LayerTypes[layer.type];
        return (
          <>
            <div className={styles.layerContainer}>
              <LayerContentComponent {...layer} />
            </div>
            {idx !== arch.length - 1 && (
              <BsArrowDown className={styles.downArrow} size={30} />
            )}
          </>
        );
      })}
    </div>
  );
};

export default ArchitectureDiagram;
