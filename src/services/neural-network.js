import { Layer, Network } from 'synaptic';

export default class NeuralNetwork {
  constructor({ learningRate = 0.3 }) {
    /* Creating layers (first parameter is number in each layer) */
    const inputLayer = new Layer(2),
      hiddenLayer = new Layer(3),
      outputLayer = new Layer(1);

    /* Connecting layers */
    inputLayer.project(hiddenLayer);
    hiddenLayer.project(outputLayer);

    /* Creating Neural Network */
    this.Network = new Network({
      input: inputLayer,
      hidden: [hiddenLayer],
      output: outputLayer
    });
    this.learningRate = learningRate;
  }

  train({x1, x2, result}) {
    const predict = this.Network.activate([x1, x2]);

    this.Network.propagate(this.learningRate, [result]);

    return { predict, x1, x2, result };
  }

  test({x1, x2}) {
    const test = this.Network.activate([x1, x2])[0];
    return { x1, x2, result: test};
  }
}
