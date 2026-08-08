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

# EventEmitter in Node.js

## What is an EventEmitter?

An EventEmitter is a class provided by Node.js through the built-in `events` module.

It is used to build event-driven applications by allowing objects to:

- Emit (trigger) events.
- Listen for events.
- Execute callback functions when an event occurs.

---

## Importing EventEmitter

```javascript
const EventEmitter = require("events");
```

---

## Creating an EventEmitter Object

```javascript
const EventEmitter = require("events");

const myEmitter = new EventEmitter();
```

Here:

- `events` is the built-in Node.js module.
- `EventEmitter` is the class exported by the `events` module.
- `myEmitter` is an object (instance) of the `EventEmitter` class.

---

## Registering an Event Listener

The `on()` method is used to listen for an event.

```javascript
myEmitter.on("greet", () => {
  console.log("Hello!");
});
```

Syntax:

```javascript
emitter.on(eventName, callbackFunction);
```

---

## Emitting an Event

The `emit()` method triggers an event.

```javascript
myEmitter.emit("greet");
```

Output:

```text
Hello!
```

---

## Passing Arguments

Arguments can be passed while emitting an event.

```javascript
myEmitter.on("stock", (quantity) => {
  console.log(`${quantity} items available`);
});

myEmitter.emit("stock", 7);
```

Output:

```text
7 items available
```

---

## Multiple Listeners

Multiple listeners can listen to the same event.

```javascript
myEmitter.on("sale", () => {
  console.log("Listener 1");
});

myEmitter.on("sale", () => {
  console.log("Listener 2");
});

myEmitter.emit("sale");
```

Output:

```text
Listener 1
Listener 2
```

The listeners execute in the order they were registered.

---

# EventEmitter and the HTTP Module

The `http` module itself does **not** inherit from `EventEmitter`.

Instead, the **Server class** inside the `http` module inherits from `EventEmitter`.

```text
events module
      │
      ▼
EventEmitter class
      ▲
      │ extends
      │
http.Server class
      ▲
      │
server object
```

---

## Why can we use `server.on()`?

When we create a server:

```javascript
const http = require("http");

const server = http.createServer();
```

`server` is an object of the `Server` class.

Since `Server` extends `EventEmitter`, the server object automatically has methods such as:

- `on()`
- `emit()`
- `once()`
- `removeListener()`

---

## Listening for HTTP Requests

```javascript
const http = require("http");

const server = http.createServer();

server.on("request", (req, res) => {
  res.end("Hello from Node.js");
});

server.listen(8000);
```

When a client sends an HTTP request, Node.js internally emits the `"request"` event.

Conceptually, it behaves like this:

```javascript
server.emit("request", req, res);
```

You never need to call `emit("request")` yourself.

The HTTP module automatically emits the event whenever a request arrives.

---

# Common EventEmitter Methods

| Method                 | Description                               |
| ---------------------- | ----------------------------------------- |
| `on()`                 | Registers an event listener.              |
| `emit()`               | Triggers an event.                        |
| `once()`               | Registers a listener that runs only once. |
| `removeListener()`     | Removes a specific listener.              |
| `removeAllListeners()` | Removes all listeners for an event.       |

---

# Important Notes

- `EventEmitter` is a class.
- `events` is the built-in Node.js module.
- `http.Server` extends `EventEmitter`.
- The callback passed to `server.on("request")` executes whenever Node.js emits the `"request"` event.
- `server.listen()` **does not** emit the `"request"` event. It only starts listening for incoming connections.
- The `"request"` event is emitted automatically when a client (browser, Postman, curl, etc.) sends an HTTP request
