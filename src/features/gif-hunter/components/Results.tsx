"use client";

import { useState, useCallback, useEffect } from "react"
import React from "react";
import Box from "@mui/material/Box";
import Masonry from "@mui/lab/Masonry";

interface Props {
  source_1: React.ReactNode;
  source_2: React.ReactNode;
}

const Results: React.FC<Props> = (props) => {
  const [loadedCount, setLoadedCount] = useState(0)
  const totalCount = props.source_1.length + props.source_2.length
  const allLoaded = loadedCount >= totalCount

  const handleLoad = useCallback(() => {
    setLoadedCount(prev => prev + 1)
  }, [])

  useEffect(() => {
    setLoadedCount(0)
  }, [props])

  return (
    <Box sx={{ width: 900, minHeight: 829, m: "auto" }}>
      {!allLoaded && (<div className="flex justify-center">Loading...</div>)}
      <Masonry columns={3} spacing={2} style={{visibility: allLoaded ? "visible" : "hidden"}}>
        {props.source_1.map((source_1: React.ReactNode, index: number) => (
          <div key={index}>
            <img
              src={`https://i.giphy.com/${source_1.id}.webp`}
              alt={source_1.title}
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
        {props.source_2.map((source_2: React.ReactNode, index: number) => (
          <div key={index + 10}>
            <img
              src={source_2.file.hd.gif.url}
              alt={source_2.title}
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
