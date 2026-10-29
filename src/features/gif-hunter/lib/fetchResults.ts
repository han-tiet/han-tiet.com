type GiphyGif = {
  id: string;
  title: string;
};

type KlipyGif = {
  file: { hd: { gif: { url: string } } };
  id: string;
  title: string;
};

// Keys are prefixed by provider: Giphy and Klipy ids are independent, so the
// same id can come back from both.
const fromGiphy = (gif: GiphyGif) => ({
  key: `giphy-${gif.id}`,
  src: `https://i.giphy.com/${gif.id}.webp`,
  id: gif.id,
  title: gif.title,
});

const fromKlipy = (gif: KlipyGif) => ({
  key: `klipy-${gif.id}`,
  src: gif.file.hd.gif.url,
  id: gif.id,
  title: gif.title,
});

export async function fetchResults(p: string) {
  const q = encodeURIComponent(p);

  async function fetchResults1() {
    const resp = await fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=${process.env.GH_API_KEY_1}&q=${q}&limit=10&offset=0&rating=r&lang=en&bundle=messaging_non_clips`,
    );

    if (!resp.ok) {
      throw new Error(`Giphy responded with ${resp.status}`);
    }

    const json = await resp.json();
    return json.data.map(fromGiphy);
  }

  async function fetchResults2() {
    const resp = await fetch(
      `https://api.klipy.com/api/v1/${process.env.GH_API_KEY_2}/gifs/search?page=1&per_page=24&q=${q}&customer_id=guest&locale=uk&content_filter=off`,
    );

    if (!resp.ok) {
      throw new Error(`Klipy responded with ${resp.status}`);
    }

    const json = await resp.json();
    return json.data.data.map(fromKlipy);
  }

  const [results1, results2] = await Promise.allSettled([
    fetchResults1(),
    fetchResults2(),
  ]);

  const gifs1 = results1.status === "fulfilled" ? results1.value : [];
  const gifs2 = results2.status === "fulfilled" ? results2.value : [];

  const gifs = [...gifs1, ...gifs2];

  return { gifs: gifs, status1: results1.status, status2: results2.status };
}

export function APIErrorMessage(
  status1: PromiseSettledResult<unknown>["status"],
  status2: PromiseSettledResult<unknown>["status"],
) {
  if (status1 === "rejected") {
    return {
      message: "Error: Cannot connect to Giphy API",
    };
  }

  if (status2 === "rejected") {
    return {
      message: "Error: Cannot connect to Klipy API",
    };
  }
}
