"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import React from "react";
import Box from "@mui/material/Box";
import Masonry from "@mui/lab/Masonry";
import CircularProgress from "@mui/material/CircularProgress";

interface Props {
  source: React.ReactNode;
}

const Results: React.FC<Props> = (props) => {
  const [loadedCount, setLoadedCount] = useState(0);
  const imgRefs = useRef([]);
  const allLoaded = loadedCount >= props.source.length;

  useEffect(() => {
    setLoadedCount(0);
    imgRefs.current = imgRefs.current.slice(0, props.source.length);
  }, [props.source]);

  useEffect(() => {
    let cachedCount = 0;
    imgRefs.current.forEach((img) => {
      if (img && img.complete) {
        cachedCount++;
      }
    });
    if (cachedCount > 0) {
      setLoadedCount((prev) => prev + cachedCount);
    }
  }, [props.source.length]);

  const handleLoad = useCallback(() => {
    setLoadedCount((prev) => prev + 1);
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
        {props.source.map((gif: React.ReactNode, index: number) => (
          <div key={gif.id}>
            <img
              ref={(el) => (imgRefs.current[index] = el)}
              src={gif.src}
              alt={gif.title}
              loading="lazy"
              onLoad={handleLoad}
              onError={handleLoad}
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
