"use client"
import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Masonry from '@mui/lab/Masonry';
import { styled } from '@mui/material/styles';

interface Props {
  source_1: any
  source_2: any
}

const Results: React.FC<Props> = (props) => {
  return (
    <Box sx={{ width: 900, minHeight: 829, m:"auto"}}>
      <Masonry columns={3} spacing={2}>
        {props.source_1.map((gif: any, index: number) => (
          <div key={index}>
            <img
              src={`https://i.giphy.com/${gif.id}.webp`}
              alt={gif.title}
              loading="lazy"
              style={{
                borderBottomLeftRadius: 4,
                borderBottomRightRadius: 4,
                display: 'block',
                width: '100%',
              }}
            />
          </div>
        ))}
        {props.source_2.map((Gif: any, index: number) => (
            <div key={index + 10}>
              <img
                src={Gif.media_formats.gif.url}
                alt={Gif.title}
                loading="lazy"
                style={{
                  borderBottomLeftRadius: 4,
                  borderBottomRightRadius: 4,
                  display: 'block',
                  width: '100%',
                }}
              />
            </div>
          ))}
      </Masonry>
    </Box>
  );
}

export default Results