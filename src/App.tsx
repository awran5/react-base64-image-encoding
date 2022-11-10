import React, { useRef, useReducer } from "react";
import { Buffer } from "buffer";
import "./App.css";

import { CopyBlock } from "./components/CopyBlock";
import { ImageInfo } from "./components/ImageInfo";
import { HeroSection } from "./components/HeroSection";

// SOF Answer
function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = parseFloat((bytes / k ** i).toFixed(dm));

  return `${size} ${sizes[i]}`;
}

function base64Size(file: string) {
  const size = Buffer.from(file?.substring(file.indexOf(",") + 1)).length;

  return formatBytes(size);
}

const initialValues = {
  name: "",
  type: "",
  sizeBefore: "",
  sizeAfter: "",
  base64: ""
};

export type ImageInfoProps = typeof initialValues;

type State = {
  imageInfo: ImageInfoProps;
  draging: boolean;
};

type Action = { type: "dragover" } | { type: "dragleave" } | { type: "imageInfo"; payload: ImageInfoProps };

function reducer(state: State, action: Action) {
  switch (action.type) {
    case "dragover":
      return {
        ...state,
        draging: true
      };
    case "dragleave":
      return {
        ...state,
        draging: false
      };
    case "imageInfo":
      return {
        ...state,
        imageInfo: action.payload
      };
    default:
      return state;
  }
}

export default function App() {
  const error = useRef("");
  const resultImageRef = useRef<HTMLImageElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [{ draging, imageInfo }, dispatch] = useReducer(reducer, {
    imageInfo: initialValues,
    draging: false
  });

  const handleCopy = async (event: React.MouseEvent<HTMLButtonElement>, text: string) => {
    if (!navigator.clipboard) return;

    const button = event.currentTarget;

    try {
      await navigator.clipboard.writeText(text);
      button.innerText = "Copied!";
    } catch (err) {
      console.error(`Could not copy the text ${err}`);
    }

    setTimeout(() => {
      button.innerText = "Copy";
    }, 1500);
  };

  const handleImages = (file: File) => {
    if (!file) return;

    error.current = "";
    dispatch({ type: "dragleave" });
    const { name, type, size } = file;

    // Check supported formats
    if (!type.match("image.*")) {
      error.current = "Failed: File is not supported.";
      return;
    }

    // Check max size (1M in Bytes)
    if (size > 1048576) {
      error.current = "Failed: Maximum file size is 1 MB";
      return;
    }

    const fileReader = new FileReader();

    fileReader.onerror = (err) => {
      error.current = `Failed to read file!\n\n ${err}`;
      return err;
    };

    fileReader.onload = () => {
      const base64 = fileReader.result as string;
      const sizeBefore = formatBytes(size);
      const sizeAfter = base64Size(base64);

      dispatch({
        type: "imageInfo",
        payload: {
          name,
          type,
          sizeBefore,
          sizeAfter,
          base64
        }
      });
    };
    fileReader.readAsDataURL(file);

    setTimeout(() => {
      if (resultImageRef.current) resultImageRef.current.scrollIntoView({ behavior: "smooth" });
    }, 500);
  };

  const handleClick = () => inputRef.current && inputRef.current.click();

  const handleDrop = (event: React.DragEvent<HTMLInputElement>) => {
    event.preventDefault();
    event.persist();

    const fileList = event.dataTransfer.files;

    if (!fileList) return;

    handleImages(fileList[0]);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;

    if (!fileList) return;

    handleImages(fileList[0]);
  };

  const handleDropLeave = (event: React.DragEvent<HTMLInputElement>) => {
    event.preventDefault();
    dispatch({ type: "dragleave" });
  };

  const handleDropOver = (event: React.DragEvent<HTMLInputElement>) => {
    event.preventDefault();
    dispatch({ type: "dragover" });
  };

  return (
    <div className='App'>
      <HeroSection />
      <section className='my-5 d-flex align-items-center justify-content-center upload-section'>
        <div className='container'>
          <div className='col-md-8 mx-auto'>
            <div
              className={draging ? "drag-area draging" : "drag-area"}
              onClick={handleClick}
              onDrop={handleDrop}
              onDragOver={handleDropOver}
              onDragLeave={handleDropLeave}
              role='application'
              aria-hidden='true'
            >
              <h2 className='fw-bold text-uppercase'>
                {draging ? (
                  <svg
                    focusable='false'
                    viewBox='0 0 24 24'
                    aria-hidden='true'
                    fill='currentColor'
                    width='48'
                    height='48'
                  >
                    <path d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z' />
                  </svg>
                ) : (
                  "Drag & drop images"
                )}
              </h2>
              <input
                accept='.gif,.jpg,.jpeg,.png,.gif,.bmp,.webp,.svg'
                style={{ display: "none" }}
                type='file'
                ref={inputRef}
                onChange={handleChange}
              />
            </div>

            {error.current && (
              <div className='alert alert-danger d-flex align-items-center mt-4' role='alert'>
                <svg
                  className='bi flex-shrink-0 me-2'
                  viewBox='0 0 16 16'
                  width='24'
                  height='24'
                  role='img'
                  aria-label='Danger'
                  fill='currentColor'
                >
                  <path d='M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z' />
                </svg>
                <div>{error.current}</div>
              </div>
            )}
            {imageInfo.base64 ? (
              <div className='mt-4 result'>
                <CopyBlock usage='image' imageInfo={imageInfo} onClick={(e) => handleCopy(e, imageInfo.base64)} />
                <CopyBlock usage='css' imageInfo={imageInfo} onClick={(e) => handleCopy(e, imageInfo.base64)} />
                <ImageInfo imageInfo={imageInfo} />

                <div className='text-center'>
                  <img ref={resultImageRef} src={imageInfo.base64} alt='base64-result' className='img-thumbnail mt-4' />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
