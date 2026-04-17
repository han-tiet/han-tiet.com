"use client";
import React from "react";
import Box from "@mui/material/Box";
import Masonry from "@mui/lab/Masonry";

interface Props {
  source_1: React.ReactNode;
  source_2: React.ReactNode;
}



const Results: React.FC<Props> = (props) => {
  return (
    <Box sx={{ width: 900, minHeight: 829, m: "auto" }}>
      <Masonry columns={3} spacing={2}>
        {props.source_1.map((source_1: React.ReactNode, index: number) => (
          <div key={index}>
            <img
              src={`https://i.giphy.com/${source_1.id}.webp`}
              alt={source_1.title}
              loading="lazy"
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
