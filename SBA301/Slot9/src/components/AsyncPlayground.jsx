import React, { useState } from "react";
import { Card, Button, Table, Badge } from "react-bootstrap";

function AsyncPlayground() {
  const [logs, setLogs] = useState([]);
  const [running, setRunning] = useState(false);

  const runTrace = () => {
    setLogs([]);
    setRunning(true);
    const trace = [];

    // Step 1: Synchronous
    trace.push({ step: 1, type: "SYNC", msg: "1. Synchronous Console Log #1 executed immediately on Call Stack" });

    // Step 2: Macrotask (setTimeout)
    setTimeout(() => {
      setLogs((prev) => [
        ...prev,
        { step: 4, type: "MACROTASK", msg: "4. Timer callback fired from Macrotask Queue (setTimeout 0ms)" }
      ]);
      setRunning(false);
    }, 0);

    // Step 3: Microtask (Promise)
    Promise.resolve().then(() => {
      setLogs((prev) => [
        ...prev,
        { step: 3, type: "MICROTASK", msg: "3. Promise.then() resolved from Microtask Queue (before timers!)" }
      ]);
    });

    // Step 4: Synchronous
    trace.push({ step: 2, type: "SYNC", msg: "2. Synchronous Console Log #2 executed immediately on Call Stack" });

    setLogs(trace);
  };

  return (
    <Card className="border-0 shadow-sm rounded-4 p-4 mb-4">
      <h3 className="fw-bold mb-2">🧪 JavaScript Event Loop & Microtask Playground</h3>
      <p className="text-muted small mb-3">
        Consolidates Slot 09 Demo 1: Synchronous code → Microtasks (Promises) → Macrotasks (setTimeout / I/O).
      </p>

      <div className="bg-dark text-light p-3 rounded-3 font-monospace small mb-3">
        <div>console.log("1 sync");</div>
        <div>Promise.resolve().then(() =&gt; console.log("3 microtask"));</div>
        <div>setTimeout(() =&gt; console.log("4 timer"), 0);</div>
        <div>console.log("2 sync");</div>
      </div>

      <div className="mb-4">
        <Button variant="primary" onClick={runTrace} disabled={running}>
          {running ? "Executing Event Loop..." : "Run Event Loop Trace"}
        </Button>
      </div>

      <Table bordered hover responsive className="align-middle">
        <thead className="table-light">
          <tr>
            <th style={{ width: "80px" }}>Order</th>
            <th style={{ width: "130px" }}>Task Type</th>
            <th>Execution Description</th>
          </tr>
        </thead>
        <tbody>
          {logs.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center text-muted py-3">
                Click "Run Event Loop Trace" to observe the async order.
              </td>
            </tr>
          ) : (
            logs.map((log, i) => (
              <tr key={i}>
                <td className="fw-bold text-center">#{log.step}</td>
                <td>
                  <Badge
                    bg={
                      log.type === "SYNC"
                        ? "primary"
                        : log.type === "MICROTASK"
                        ? "warning"
                        : "danger"
                    }
                  >
                    {log.type}
                  </Badge>
                </td>
                <td>{log.msg}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Card>
  );
}

export default AsyncPlayground;
