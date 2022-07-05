self.addEventListener("message", (event) => {
    const {data} = event;
    self.postMessage(`Received: ${data}`);
});