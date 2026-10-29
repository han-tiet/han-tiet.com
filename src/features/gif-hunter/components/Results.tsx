"use client";

import { useState, useCallback } from "react";
import React from "react";
import Box from "@mui/material/Box";
import Masonry from "@mui/lab/Masonry";
import CircularProgress from "@mui/material/CircularProgress";

interface Props {
  source: React.ReactNode;
}

const Results: React.FC<Props> = (props) => {
  const [loadedIds, setLoadedIds] = useState<Set<string>>(() => new Set());
  const allLoaded = loadedIds.size >= props.source.length;

  const markLoaded = useCallback((id: string) => {
    setLoadedIds((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));
  }, []);

  return (
    <Box
      sx={{
        width: { xs: "100%", md: 900 },
        maxWidth: "100%",
        minHeight: { xs: 400, md: 829 },
        m: "auto",
        px: { xs: 2, md: 0 },
      }}
    >
      <div className="flex flex-row justify-center">
        {!allLoaded && <CircularProgress />}
      </div>
      <Masonry
        columns={{ xs: 1, sm: 2, md: 3, lg: 3 }}
        spacing={{ xs: 1, md: 2 }}
        style={{ visibility: allLoaded ? "visible" : "hidden" }}
      >
        {props.source.map((gif: React.ReactNode) => (
          <div key={gif.key}>
            <img
              ref={(el) => {
                if (el?.complete) markLoaded(gif.key);
              }}
              src={gif.src}
              alt={gif.title}
              onLoad={() => markLoaded(gif.key)}
              onError={() => markLoaded(gif.key)}
              style={{
                borderBottomLeftRadius: 4,
                borderBottomRightRadius: 4,
                display: "block",
                width: "100%",
                // Keeps each GIF within one screen on short (landscape)
                // viewports; `contain` scales it down rather than cropping.
                maxHeight: "calc(100svh - 2rem)",
                objectFit: "contain",
              }}
            />
          </div>
        ))}
      </Masonry>
    </Box>
  );
};

export default Results;
