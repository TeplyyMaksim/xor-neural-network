<template>
  <el-row :gutter="20">
    <el-col :span="12">
      <el-card>
        <div slot="header" class="clearfix">
          <h4>Training</h4>
        </div>
        <div class="card-content-row">
          <div class="card-content-row-label">Epoch train:</div>
          <div>
            <el-input-number v-model="epochNum" :min="1" :max="20000"></el-input-number>
            <el-button
              @click="() => trainEpoch({ epochNum })"
              type="success"
              plain>
              Train
            </el-button>
          </div>
        </div>
        <hr>
        <div class="card-content-row">
          <div class="card-content-row-label">Custom train:</div>
          <div class="card-content-controll-wrapper">
            <div>
              <div class="card-content-switch-row">
                <span class="card-content-switch-label">X1:</span>
                <el-switch
                  v-model="trainX1"
                  active-text="1"
                  :active-value="1"
                  inactive-text="0"
                  :inactive-value="0"/>
              </div>
              <div class="card-content-switch-row">
                <span class="card-content-switch-label">X2:</span>
                <el-switch
                  v-model="trainX2"
                  active-text="1"
                  :active-value="1"
                  inactive-text="0"
                  :inactive-value="0"/>
              </div>
              <div class="card-content-switch-row">
                <span class="card-content-switch-label">Expected result:</span>
                <el-switch
                  v-model="trainExpected"
                  active-text="1"
                  :active-value="1"
                  inactive-text="0"
                  :inactive-value="0"/>
              </div>
            </div>
            <el-button
              @click="() => trainOnce({
                x1: trainX1,
                x2: trainX2,
                result: trainExpected
              })"
              type="success"
              plain>
              Train
            </el-button>
          </div>
        </div>
      </el-card>
      <el-card class="card-content-log">
        <div slot="header" class="clearfix">
          <h4>Training log</h4>
        </div>
        <ul class="card-content-log-list">
          <li
            v-for="(log, index) in logs"
            :key="index"
            :class="`card-content-log-element ${Math.round(log.predict[0]) === log.result
              ? 'valid-log-prediction'
              : 'failed-log-prediction'}`">
            {{`x1:  ${log.x1}, x2: ${log.x2}, Predicted Result: ${Math.round(log.predict[0])}, Right Result: ${log.result}`}}
          </li>
        </ul>
        <div v-if="!logs.length">
          There are no logs at this moment
        </div>
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card>
        <div slot="header" class="clearfix">
          <h4>Testing</h4>
        </div>
        <div class="card-content-row">
          <div class="card-content-row-label">Test values:</div>
          <div class="card-content-controll-wrapper">
            <div>
              <div class="card-content-switch-row">
                <span class="card-content-switch-label">X1:</span>
                <el-switch
                  v-model="testX1"
                  active-text="1"
                  :active-value="1"
                  inactive-text="0"
                  :inactive-value="0"/>
              </div>
              <div class="card-content-switch-row">
                <span class="card-content-switch-label">X2:</span>
                <el-switch
                  v-model="testX2"
                  active-text="1"
                  :active-value="1"
                  inactive-text="0"
                  :inactive-value="0"/>
              </div>
            </div>
            <el-button
              @click="() => test({
                x1: testX1,
                x2: testX2
              })"
              type="success"
              plain>
              Test
            </el-button>
          </div>
        </div>
      </el-card>
      <el-card class="card-test-results" v-if="testResults">
        <div slot="header" class="clearfix">
          <h4>Test results</h4>
        </div>
        <div class="test-results-row">
          <div class="test-results-label">X1:</div>
          <div>{{testResults.x1}}</div>
        </div>
        <div class="test-results-row">
          <div class="test-results-label">X2:</div>
          <div>{{testResults.x2}}</div>
        </div>
        <div class="test-results-row">
          <div class="test-results-label">Rounded result:</div>
          <div>{{Math.round(testResults.result)}}</div>
        </div>
        <div class="test-results-row">
          <div class="test-results-label">Actual result:</div>
          <div>{{testResults.result}}</div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import NeuralNetwork from '../services/neural-network';

const MAX_LOGS = 50;

export default {
  name: 'Xor',
  data () {
    return {
      xorNetwork: null,
      epochNum: 10,
      logs: [],

      trainX1: 0,
      trainX2: 0,
      trainExpected: 0,

      testX1: 0,
      testX2: 0,
      testResults: null
    }
  },
  mounted() {
    this.xorNetwork = new NeuralNetwork({ learningRateP: .3 });
  },
  methods: {
    trainEpoch({ epochNum=20000 }) {
      for (var i = 0; i < epochNum; i++) {
        // 0,0 => 0
        this.trainOnce({ x1: 0, x2: 0, result: 0 });
        // 0,1 => 1
        this.trainOnce({ x1: 0, x2: 1, result: 1 });
        // 1,0 => 1
        this.trainOnce({ x1: 1, x2: 0, result: 1 });
        // 1,1 => 0
        this.trainOnce({ x1: 1, x2: 1, result: 0 });
      }
    },

    trainOnce({ x1, x2, result }) {
      const log = this.xorNetwork.train({ x1, x2, result });

      this.addLog(log);
    },

    test({ x1, x2 }) {
      this.testResults = this.xorNetwork.test({ x1, x2 });
    },

    addLog(log) {
      this.logs.unshift(log);
      if (this.logs.length > MAX_LOGS) {
        this.logs.splice(-1,1);
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import './../styles/variables';

.card-content-row {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .card-content-row-label {
    font-weight: bold;
    font-size: 1.25em;
  }
}

.card-content-controll-wrapper {
  display: flex;
  align-items: center;

  .card-content-switch-row {
    margin-right: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .card-content-switch-label {
      margin-right: 10px;
      font-weight: bold;
      padding: 10px 0;
    }
  }
}

hr {
  border-color: $background;
}

.card-test-results,
.card-content-log {
  margin-top: 15px;
}

.card-test-results {
  .test-results-row {
    padding: 10px;
    display: flex;
    align-items: center;

    .test-results-label {
      font-weight: bold;
      width: 150px;
    }
  }
}

.card-content-log {
  .card-content-log-list {
    max-height: 100px;
    overflow-y: auto;
    border-radius: 5px;

    .card-content-log-element {
      padding: 5px 20px;

      $success: #98E39C;
      $fail: #FE8F94;

      &.valid-log-prediction {
        background: $success;
      }

      &.failed-log-prediction {
        background: $fail;
      }
    }
  }
}
</style>
