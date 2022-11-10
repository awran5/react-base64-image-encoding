import React from "react";
import { ImageInfoProps } from "../App";

type Props = {
  imageInfo: ImageInfoProps;
};

export function ImageInfo({ imageInfo }: Props) {
  const { name, type, sizeBefore, sizeAfter } = imageInfo;
  return (
    <div className='image-info'>
      <dl className='row small m-0'>
        <dt className='col-sm-3'>File Name:</dt>
        <dd className='col-sm-9'>{name}</dd>

        <dt className='col-sm-3'>Type</dt>
        <dd className='col-sm-9'>{type}</dd>

        <dt className='col-sm-3'>Original Size</dt>
        <dd className='col-sm-9'>{sizeBefore}</dd>

        <dt className='col-sm-3'>Base64 Size</dt>
        <dd className='col-sm-9 '>
          <span className={sizeAfter > sizeBefore ? "danger" : "success"}>{sizeAfter}</span>
        </dd>
      </dl>
    </div>
  );
}
