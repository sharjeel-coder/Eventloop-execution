const fs = require("fs");

setTimeout(() => {
  console.log("timer 1 finished");
}, 0);

setImmediate(() => {
  console.log("immediate finshed just");
});

fs.readFile("test-file.txt", "utf-8", () => {
  console.log("I/O have just finished it work");

  console.log("------------------------");

  setTimeout(() => {
    console.log("timer 2 finished");
  }, 0);

  setImmediate(() => {
    console.log("immediate 3 finshed just");
  });
});

console.log("hello from top level code ");
