"use client";

import * as Sentry from "@sentry/nextjs";
import notFound from "@/app/sentry-example-page/not-found";

export default function SentryTestPage() {
  if (process.env.VERCEL_ENV != "development") {
    return notFound();
  }
  // 1. Thrown error — tests error tracking + source maps
  const throwError = () => {
    throw new Error("Sentry test: thrown error");
  };

  // 2. Manually captured error — tests captureException works independently
  const captureError = () => {
    try {
      JSON.parse("{invalid json");
    } catch (err) {
      Sentry.captureException(err);
      alert("Error captured — check Sentry dashboard");
    }
  };

  // 3. Traced/slow action — tests tracing spans show up
  const runTracedAction = async () => {
    await Sentry.startSpan(
      { name: "test-traced-action", op: "test" },
      async () => {
        await new Promise((resolve) => setTimeout(resolve, 1500)); // simulate slow work
        await fetch("/api/sentry-test-slow"); // hits an API route, see below
      },
    );
    alert("Traced action done — check Sentry Performance tab");
  };

  // 4. Log call — tests Sentry Logs
  const sendLog = () => {
    Sentry.logger.warn("Sentry test: warning log", {
      testId: "sentry-test-page",
    });
    alert("Log sent — check Sentry Logs tab");
  };

  // 5. Error + replay — throws inside a click so a replay session gets attached
  const throwWithReplay = () => {
    Sentry.getReplay()?.flush(); // ensure replay is running
    throw new Error("Sentry test: error with replay");
  };

  return (
    <div
      style={{ padding: 40, display: "flex", flexDirection: "column", gap: 12 }}
    >
      <h1>Sentry Test Page</h1>
      <button onClick={throwError}>1. Throw uncaught error</button>
      <button onClick={captureError}>2. Manually capture error</button>
      <button onClick={runTracedAction}>3. Run traced slow action</button>
      <button onClick={sendLog}>4. Send log</button>
      <button onClick={throwWithReplay}>5. Throw error (check replay)</button>
    </div>
  );
}
