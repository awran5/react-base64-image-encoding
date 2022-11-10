import React from "react";
import { ImageInfoProps } from "../App";

type CopyBlockProps = {
  imageInfo: ImageInfoProps;
  usage: "image" | "css";
  // eslint-disable-next-line no-unused-vars
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

export function CopyBlock({ imageInfo, usage, onClick }: CopyBlockProps) {
  return (
    <div className='p-2 my-2 bg-light position-relative'>
      <div className='bd-clipboard'>
        <button
          type='button'
          className='btn btn-outline-primary btn-sm btn-clipboard'
          title='Copy to clipboard'
          onClick={onClick}
        >
          Copy
        </button>
      </div>
      <pre className='chroma my-3'>
        <code className='language-html'>
          <span className='d-block code-comment'>
            &lt;!-- For use {usage === "image" ? "as a <img> src" : "as CSS background"} --&gt;
          </span>
          <span className='d-block pb-2'>{usage === "image" ? imageInfo.base64 : `url('${imageInfo.base64}')`}</span>
        </code>
      </pre>
    </div>
  );
}
