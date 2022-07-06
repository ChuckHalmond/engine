self.addEventListener("message", (event) => {
    const {data: sab} = event;
    const array = new Uint32Array(sab);
    array[10] = 360;
    self.postMessage(`Updated!`);
});