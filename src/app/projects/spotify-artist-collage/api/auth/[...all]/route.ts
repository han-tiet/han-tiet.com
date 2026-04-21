// API route to catch all requests that begin with api/auth.
// Uses route handlers that provide a custom request handler for requests and responses.

import { auth } from "@/lib/auth"; // path to your auth file
import { toNextJsHandler } from "better-auth/next-js";

export const { POST, GET } = toNextJsHandler(auth);
