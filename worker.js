let worker;

function startWorker() {
  if (typeof Worker !== "undefined") {
    if (typeof worker === "undefined") {
      worker = new Worker("worker.js");

      // Assuming you want to send some data to the worker
      worker.postMessage(500);

      // Receive messages from the worker
      worker.onmessage = function (event) {
        document.getElementById("result").innerHTML =
          "Result: " + event.data;
      };
    } else {
      console.log("Worker already started.");
    }
  } else {
    console.log("Web Workers not supported in this environment.");
  }
}

function stopWorker() {
  if (typeof worker !== "undefined") {
    worker.terminate();
    worker = undefined;
    console.log("Worker terminated.");
  } else {
    console.log("No worker to terminate.");
  }
}
