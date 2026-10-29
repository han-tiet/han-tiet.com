// @vitest-environment node
// fetchResults never touches the DOM, so skip the global jsdom environment.
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  fetchResults,
  APIErrorMessage,
} from "@/features/gif-hunter/lib/fetchResults";

const GH_API_KEY_1 = "giphy-test-key";
const GH_API_KEY_2 = "klipy-test-key";
const QUERY = "cats";

// --- Fixtures: raw API items, shaped like the real responses -------------

const giphyGif = (id: string) => ({ id, title: `Giphy ${id}` });

const klipyGif = (id: string) => ({
  id,
  title: `Klipy ${id}`,
  file: { hd: { gif: { url: `https://static.klipy.com/${id}.gif` } } },
});

// fetchResults reads json.data for Giphy and json.data.data for Klipy.
const giphyBody = (gifs: unknown[]) => ({ data: gifs });
const klipyBody = (gifs: unknown[]) => ({ data: { data: gifs } });

// --- fetch mock, routed by URL ------------------------------------------

// An Error makes fetch reject (network failure); anything else is returned
// as a JSON response with the given status.
type ApiOutcome = Error | { status?: number; body: unknown };

function mockApis({ giphy, klipy }: { giphy: ApiOutcome; klipy: ApiOutcome }) {
  // Both requests start together inside Promise.allSettled, so route by URL
  // rather than relying on call order.
  vi.mocked(fetch).mockImplementation(async (input) => {
    const outcome = String(input).includes("api.giphy.com") ? giphy : klipy;
    if (outcome instanceof Error) throw outcome;
    return Response.json(outcome.body, { status: outcome.status ?? 200 });
  });
}

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn());
  vi.stubEnv("GH_API_KEY_1", GH_API_KEY_1);
  vi.stubEnv("GH_API_KEY_2", GH_API_KEY_2);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

// --- Tests --------------------------------------------------------------

describe("fetchResults", () => {
  it("1. merges both APIs, Giphy first then Klipy", async () => {
    mockApis({
      giphy: { body: giphyBody([giphyGif("g1"), giphyGif("g2")]) },
      klipy: { body: klipyBody([klipyGif("k1")]) },
    });

    const result = await fetchResults(QUERY);

    expect(result.gifs.map((gif) => gif.id)).toEqual(["g1", "g2", "k1"]);
    expect(result.status1).toBe("fulfilled");
    expect(result.status2).toBe("fulfilled");
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("2. maps each provider into the shared { key, src, id, title } shape", async () => {
    mockApis({
      giphy: { body: giphyBody([giphyGif("g1")]) },
      klipy: { body: klipyBody([klipyGif("k1")]) },
    });

    const { gifs } = await fetchResults(QUERY);

    expect(gifs).toEqual([
      {
        key: "g1",
        src: "https://i.giphy.com/g1.webp",
        id: "g1",
        title: "Giphy g1",
      },
      {
        key: "k1",
        src: "https://static.klipy.com/k1.gif",
        id: "k1",
        title: "Klipy k1",
      },
    ]);
  });

  it("3. keeps Klipy results when the Giphy request fails", async () => {
    mockApis({
      giphy: new TypeError("fetch failed"),
      klipy: { body: klipyBody([klipyGif("k1")]) },
    });

    const result = await fetchResults(QUERY);

    expect(result.gifs.map((gif) => gif.id)).toEqual(["k1"]);
    expect(result.status1).toBe("rejected");
    expect(result.status2).toBe("fulfilled");
  });

  it("4. keeps Giphy results when the Klipy request fails", async () => {
    mockApis({
      giphy: { body: giphyBody([giphyGif("g1")]) },
      klipy: new TypeError("fetch failed"),
    });

    const result = await fetchResults(QUERY);

    expect(result.gifs.map((gif) => gif.id)).toEqual(["g1"]);
    expect(result.status1).toBe("fulfilled");
    expect(result.status2).toBe("rejected");
  });

  it("5. returns no gifs when both requests fail", async () => {
    mockApis({
      giphy: new TypeError("fetch failed"),
      klipy: new TypeError("fetch failed"),
    });

    const result = await fetchResults(QUERY);

    expect(result.gifs).toEqual([]);
    expect(result.status1).toBe("rejected");
    expect(result.status2).toBe("rejected");
  });

  it("6. handles one API returning an empty list", async () => {
    mockApis({
      giphy: { body: giphyBody([]) },
      klipy: { body: klipyBody([klipyGif("k1")]) },
    });

    const result = await fetchResults(QUERY);

    expect(result.gifs.map((gif) => gif.id)).toEqual(["k1"]);
    expect(APIErrorMessage(result.status1, result.status2)).toBeUndefined();
  });

  it("7. treats a Giphy HTTP 500 error body as a Giphy failure", async () => {
    mockApis({
      giphy: { status: 500, body: { message: "Internal Server Error" } },
      klipy: { body: klipyBody([klipyGif("k1")]) },
    });

    const result = await fetchResults(QUERY);

    expect(result.gifs.map((gif) => gif.id)).toEqual(["k1"]);
    expect(result.status1).toBe("rejected");
    expect(result.status2).toBe("fulfilled");
  });

  it("8. treats a Klipy body without data.data as a Klipy failure", async () => {
    mockApis({
      giphy: { body: giphyBody([giphyGif("g1")]) },
      klipy: { body: { data: {} } }, // data is empty object
    });

    const result = await fetchResults(QUERY);

    expect(result.gifs.map((gif) => gif.id)).toEqual(["g1"]);
    expect(result.status1).toBe("fulfilled");
    expect(result.status2).toBe("rejected");
  });

  it("9. survives a Klipy item that has no file.hd", async () => {
    mockApis({
      giphy: { body: giphyBody([giphyGif("g1")]) },
      klipy: { body: klipyBody([{ id: "k1", title: "Klipy k1", file: {} }]) },
    });

    const result = await fetchResults(QUERY);

    expect(result.gifs.map((gif) => gif.id)).toEqual(["g1"]);
    expect(result.status1).toBe("fulfilled");
    expect(result.status2).toBe("rejected");
  });

  it.fails(
    "10. produces unique keys when both providers return the same id",
    async () => {
      mockApis({
        giphy: { body: giphyBody([giphyGif("123")]) },
        klipy: { body: klipyBody([klipyGif("123")]) },
      });

      const result = await fetchResults(QUERY);

      const keys = result.gifs.map((gif) => gif.key);

      // Duplicate keys are dropped when adding to a Set. If set size = keys.length, no duplicates
      expect(new Set(keys).size).toBe(keys.length);
    },
  );
});

describe("APIErrorMessage", () => {
  it("returns nothing when both APIs succeed", () => {
    expect(APIErrorMessage("fulfilled", "fulfilled")).toBeUndefined();
  });

  it("reports a Giphy failure", () => {
    expect(APIErrorMessage("rejected", "fulfilled")?.message).toBe(
      "Error: Cannot connect to Giphy API",
    );
  });

  it("reports a Klipy failure", () => {
    expect(APIErrorMessage("fulfilled", "rejected")?.message).toBe(
      "Error: Cannot connect to Klipy API",
    );
  });

  it("reports Giphy first when both fail", () => {
    expect(APIErrorMessage("rejected", "rejected")?.message).toBe(
      "Error: Cannot connect to Giphy API",
    );
  });
});
