import { fork } from "node:child_process";

export class Cluster {
  clustersMap;
  idx;
  taskFilePath;
  nCluster;
  totalItems;
  process;

  constructor(taskFilePath, nCluster, totalItems) {
    this.taskFilePath = taskFilePath;
    this.nCluster = nCluster;
    this.totalItems = totalItems;
    this.process = 0;
  }

  async initialize() {
    this.clustersMap = new Map();

    for (let i = 0; i < this.nCluster; i++) {
      const childFork = fork(this.taskFilePath);

      childFork.on("exit", () => {
        console.log(`Exiting process - PID: ${childFork.pid}`);
        this.clustersMap.delete(childFork.pid);
      });

      childFork.on("error", () => {
        process.exit(1);
      });

      childFork.on("message", (message) => {
        if (message != "ok") return;
        this.onMessage(message);
      });

      this.clustersMap.set(childFork.pid, childFork);
    }

    this.idx = 0;
  }

  clusterLoadBalancer(arrayLength, current) {
    if (current >= arrayLength - 1) return 0;
    return (current += 1);
  }

  getProcess(idx) {
    const idx_ = this.clusterLoadBalancer(this.clustersMap.size, idx);
    this.idx = idx_;
    const values = [...this.clustersMap.values()];
    return values[this.idx];
  }

  kill() {
    this.clustersMap.forEach((child) => child.kill());
  }

  sendToChild(message) {
    const child = this.getProcess(this.idx);
    child.send(message);
  }

  async onMessage(message) {
    if (++this.process != this.totalItems) return;
    console.log(`Cluster size: ${this.clustersMap.size}`);
    this.kill();
    console.timeEnd("Execution Time");
    setTimeout(() => {
      console.log(`All items processed, exiting... ${this.process}`);
      console.log(`Cluster size: ${this.clustersMap.size}`);

      process.exit();
    }, 2000);
  }
}
