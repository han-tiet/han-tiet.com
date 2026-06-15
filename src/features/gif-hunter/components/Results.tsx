"use client";

import { useState, useCallback, useEffect } from "react";
import React from "react";
import Box from "@mui/material/Box";
import Masonry from "@mui/lab/Masonry";
import CircularProgress from "@mui/material/CircularProgress";

interface Props {
  source: React.ReactNode,
}

const Results: React.FC<Props> = (props) => {
  const [loadedCount, setLoadedCount] = useState(0);
  const allLoaded = loadedCount >= props.source.length

  useEffect(() => {
    setLoadedCount(0);
  }, [props.source]);
  
  const handleLoad = useCallback(() => {
    setLoadedCount(prev => prev + 1)
  }, [])

  const imgRef = useCallback((node) => {
    if (!node) return
    if (node.complete) {
      handleLoad()
    }
  }, [handleLoad])

  
  return (
    <Box sx={{ width: 900, minHeight: 829, m: "auto" }}>
      <div className="flex flex-row justify-center">
        {!allLoaded && <CircularProgress />}
      </div>
      <Masonry
        columns={3}
        spacing={2}
        style={{ visibility: allLoaded ? "visible" : "hidden" }}
      >
        {props.source.map((gif: React.ReactNode) => (
          <div key={gif.id}>
            <img
              ref={imgRef}
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
              }}
            />
          </div>
        ))}
      </Masonry>
    </Box>
  );
};

export default Results;
