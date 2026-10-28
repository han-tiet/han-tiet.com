type GiphyGif = {
  id: string;
  title: string;
};

type KlipyGif = {
  file: { hd: { gif: { url: string } } };
  id: string;
  title: string;
};

export async function fetchResults(p: string) {
  async function fetchResults1() {
    const resp = await fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=${process.env.GH_API_KEY_1}&q=${p}&limit=10&offset=0&rating=r&lang=en&bundle=messaging_non_clips`,
    );
    const json = await resp.json();
    return json.data;
  }

  async function fetchResults2() {
    const resp = await fetch(
      `https://api.klipy.com/api/v1/${process.env.GH_API_KEY_2}/gifs/search?page=1&per_page=24&q=${p}&customer_id=guest&locale=uk&content_filter=off`,
    );
    const json = await resp.json();
    return json.data.data;
  }

  const [results1, results2] = await Promise.allSettled([
    fetchResults1(),
    fetchResults2(),
  ]);

  const gifs1 = results1.status === "fulfilled" ? results1.value : [];
  const gifs2 = results2.status === "fulfilled" ? results2.value : [];

  const fromGiphy = (gif: GiphyGif) => ({
    key: gif.id,
    src: `https://i.giphy.com/${gif.id}.webp`,
    id: gif.id,
    title: gif.title,
  });

  const fromKlipy = (gif: KlipyGif) => ({
    key: gif.id,
    src: gif.file.hd.gif.url,
    id: gif.id,
    title: gif.title,
  });

  const gifs = [...gifs1.map(fromGiphy), ...gifs2.map(fromKlipy)];

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
