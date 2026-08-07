---
# What is the Event Loop?

The event loop is a mechanism that continuously checks different phases and executes callbacks whose tasks have already been completed.

The event loop itself does not perform the work. Its job is simply to determine when a callback should be executed.
---

# Main Components of Node.js

- Call Stack
- Event Loop
- Callback Queue
- Microtask Queue
- Thread Pool (libuv)
- Operating System

---

# General Workflow

```text
JavaScript code
       │
       ▼
Call stack
       │
       ▼
Asynchronous operation
       │
       ▼
Thread pool or operating system
       │
       ▼
Task completion
       │
       ▼
Callback queue
       │
       ▼
Event loop
       │
       ▼
Callback execution
```

---

# Event Loop Phases

```text
Timers
   │
   ▼
Pending Callbacks
   │
   ▼
Poll Phase
   │
   ▼
Check Phase
   │
   ▼
Close Callbacks
```

The event loop continuously moves from one phase to another.

---

# Timers Phase

The timers phase executes callbacks from:

```js
setTimeout();
setInterval();
```

Example:

```js
setTimeout(() => {
  console.log("Timer finished");
}, 0);
```

---

# Poll Phase

The poll phase is responsible for handling I/O operations such as:

- Reading files
- Writing files
- Database operations
- Network requests
- Socket operations

Example:

```js
fs.readFile("test-file.txt", "utf8", () => {
  console.log("File has been read.");
});
```

---

# Check Phase

The check phase executes callbacks from:

```js
setImmediate();
```

Example:

```js
setImmediate(() => {
  console.log("Immediate callback");
});
```

---

# What is a Tick?

A tick is one complete cycle of the event loop.

```text
Tick 1
-------
Timers
Pending callbacks
Poll
Check
Close callbacks

Tick 2
-------
Timers
Pending callbacks
Poll
Check
Close callbacks
```

---

# Does the Event Loop Wait?

No.

The event loop never waits for all operations to finish.

Suppose we have the following situation:

```text
Task 1   ✔ Finished
Task 2   ✘ Running
Task 3   ✘ Running
```

The event loop executes the callback for Task 1 and moves on.

---

# Task Completion vs Callback Execution

These two concepts are different.

## Task completion

```text
Thread pool
      │
      ▼
Task finished
```

## Callback execution

```text
Event loop
      │
      ▼
Callback executed
```

---

# Thread Pool Usage

| Function        | Uses thread pool |
| --------------- | ---------------- |
| fs.readFile()   | Yes              |
| fs.writeFile()  | Yes              |
| crypto.pbkdf2() | Yes              |
| zlib            | Yes              |
| setTimeout()    | No               |
| setImmediate()  | No               |

---

# Example

```js
const fs = require("fs");

setTimeout(() => {
  console.log("Timer");
}, 0);

setImmediate(() => {
  console.log("Immediate");
});

fs.readFile("test-file.txt", "utf8", () => {
  console.log("File read");
});

console.log("Top-level code");
```

---

# Top-Level Code Execution

```text
Top-level code
       │
       ▼
setTimeout()
setImmediate()
fs.readFile()
```

---

# Why Does setImmediate() Execute First Inside an I/O Callback?

Example:

```js
fs.readFile("test-file.txt", () => {
  setTimeout(() => {
    console.log("Timer");
  }, 0);

  setImmediate(() => {
    console.log("Immediate");
  });
});
```

Output:

```text
Immediate
Timer
```

Reason:

```text
Poll phase
     │
     ▼
Check phase
     │
     ▼
Next tick
     │
     ▼
Timers phase
```

The event loop reaches the check phase before the next timers phase.

---

# Priority Order

```text
Highest priority

process.nextTick()
        │
        ▼
Promise queue
        │
        ▼
Timers
        │
        ▼
Pending callbacks
        │
        ▼
Poll phase
        │
        ▼
Check phase
        │
        ▼
Close callbacks

Lowest priority
```

---

# Important Points

- JavaScript is single-threaded.
- Node.js itself is not completely single-threaded.
- The event loop continuously runs.
- The event loop never waits.
- Task completion and callback execution are different things.
- The event loop follows the order of phases.
- Each phase contains its own queue.

---

# Author

Sharjeel Khalid
