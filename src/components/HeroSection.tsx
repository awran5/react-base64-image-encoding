import React from "react";
import base64Logo from "../assets/base64-logo.png";

export function HeroSection() {
  return (
    <section className='bg-primary mb-4 header'>
      <div className='container'>
        <main>
          <div className='py-5 text-center'>
            <img src={base64Logo} alt='base64-logo' className='d-block mx-auto mb-2' width={90} height={119} />
            <h1 className='text-white fw-bold'>IMAGES TO BASE64 ONLINE CONVERTER</h1>
            <p className='text-white mb-2 lead'>
              Free online base64 encoding support JPG, JPEG, PNG, GIF, WebP, BMP, SVG formats (max. 1 MB).
            </p>
            <p className='small text-light'>
              Base64 encoded images are good for tiny images, small icons, logos in emails, other than that, using
              base64 images might actually kill your{" "}
              <a href='https://bunny.net/blog/why-optimizing-your-images-with-base64-is-almost-always-a-bad-idea/'>
                performance.
              </a>
            </p>
            <div className='d-grid gap-2 d-sm-flex justify-content-sm-center mt-4'>
              <a href='https://github.com/awran5/react-base64-image-encoding' className='btn btn-sm btn-dark'>
                Github
              </a>
              <a href='https://github.com/awran5/react-base64-image-encoding/issues' className='btn btn-sm btn-warning'>
                Report issue
              </a>
            </div>
          </div>
        </main>
      </div>
    </section>
  );
}
