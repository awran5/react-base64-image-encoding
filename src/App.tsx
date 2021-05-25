import React, { useState, useRef } from 'react'
import './App.css'

// SOF Answer
function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

function base64Size(file: string) {
  const size = Buffer.from(file.substring(file.indexOf(',') + 1)).length

  return formatBytes(size)
}

const initialValues = {
  name: '',
  type: '',
  sizeBefore: '',
  sizeAfter: '',
  base64: '',
}

export function App() {
  const [draging, setDraging] = useState(false)
  const [imageInfo, setImageInfo] = useState(initialValues)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleCopy = (event: React.MouseEvent<HTMLButtonElement>, text: string) => {
    const button = event.target as HTMLInputElement

    if (!navigator.clipboard) return

    navigator.clipboard.writeText(text).then(
      () => (button.innerText = 'copied'),
      () => console.error('Could not copy the text')
    )
    setTimeout(() => (button.innerText = 'copy'), 1000)
  }

  function handleImages(file: File) {
    setDraging(false)

    if (!file) return

    // Check supported formats
    if (!file.type.match('image.*')) {
      setError('Failed: File is not supported.')
      return
    }

    // Check max size (1 M in Bytes)
    if (file.size > 1048576) {
      setError('Faild: Maximum file size is 1 MB')
      return
    }

    setError('')
    setImageInfo(initialValues)

    const fileReader = new FileReader()

    fileReader.onerror = () => setError('Failed to read file!\n\n' + fileReader.error)

    fileReader.onload = () => {
      const base64 = fileReader.result as string

      setImageInfo({
        name: file.name,
        type: file.type,
        sizeBefore: formatBytes(file.size),
        sizeAfter: base64Size(base64),
        base64,
      })
    }

    fileReader.readAsDataURL(file)
  }

  const handleClick = () => inputRef.current && inputRef.current.click()

  const handleDrop = (e: React.DragEvent<HTMLInputElement>) => {
    e.preventDefault()
    e.persist()

    const fileList = e.dataTransfer.files

    if (!fileList) return

    handleImages(fileList[0])
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files

    if (!fileList) return

    handleImages(fileList[0])
  }

  const handleDropLeave = (e: React.DragEvent<HTMLInputElement>) => {
    e.preventDefault()

    setDraging(false)
  }

  const handleDropOver = (e: React.DragEvent<HTMLInputElement>) => {
    e.preventDefault()

    setDraging(true)
  }

  return (
    <div className='App'>
      <section className='bg-primary mb-4 header'>
        <div className='container'>
          <div className='row align-items-center no-gutters'>
            <div className='col-xl-5 col-lg-6 col-md-12'>
              <div className='py-5 py-lg-0'>
                <h1 className='text-white display-5 fw-bold'>IMAGES TO BASE64 ONLINE CONVERTER</h1>
                <p className='text-white mb-4 lead'>
                  Free online base64 encoding support JPG, JPEG, PNG, GIF, WebP, BMP, SVG formats (max. 1 MB).
                </p>
                <p className='small text-light'>
                  Base64 encoded images are good for tiny images, small icons, logos in emails, other than that, using
                  base64 images might actually kill your{' '}
                  <a href='https://bunny.net/blog/why-optimizing-your-images-with-base64-is-almost-always-a-bad-idea/'>
                    performance.
                  </a>
                </p>
                <a href='https://github.com/awran5/react-base64-image-encoding' className='btn btn-success me-1'>
                  Source code
                </a>
                <a href='https://github.com/awran5/react-base64-image-encoding/issues' className='btn btn-white'>
                  Report issue
                </a>
              </div>
            </div>
            <div className='col-xl-7 col-lg-6 col-md-12 text-lg-right text-center'>
              <img
                src='data:image/png;base64,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'
                alt=''
              />
            </div>
          </div>
        </div>
      </section>

      <section className='my-5 d-flex align-items-center justify-content-center upload-section'>
        <div className='container'>
          <div className='col-md-7 mx-auto'>
            <div
              className={draging ? 'drag-area draging' : 'drag-area'}
              onClick={handleClick}
              onDrop={handleDrop}
              onDragOver={handleDropOver}
              onDragLeave={handleDropLeave}
            >
              <h2 className='fw-bold text-uppercase'>{draging ? 'Drop..' : 'Drag & drop images'}</h2>
              <input
                accept='.gif,.jpg,.jpeg,.png,.gif,.bmp,.webp,.svg'
                style={{ display: 'none' }}
                type='file'
                ref={inputRef}
                onChange={handleChange}
              />
            </div>

            {error ? (
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
                  <path d='M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z'></path>
                </svg>
                <div>{error}</div>
              </div>
            ) : imageInfo.base64 ? (
              <div className='mt-5 result'>
                <div className='bd-clipboard'>
                  <button
                    type='button'
                    className='btn-clipboard'
                    title='Copy to clipboard'
                    onClick={(e) => handleCopy(e, imageInfo.base64)}
                  >
                    Copy
                  </button>
                </div>
                <div className='highlight'>
                  <pre className='chroma'>
                    <code className='language-html' data-lang='html'>
                      <span className='d-block code-comment'>&lt;!-- For use in {`<img>`} elements --&gt;</span>
                      {imageInfo.base64}
                    </code>
                  </pre>
                </div>
                <div className='bd-clipboard'>
                  <button
                    type='button'
                    className='btn-clipboard'
                    title='Copy to clipboard'
                    onClick={(e) => handleCopy(e, `url('${imageInfo.base64}')`)}
                  >
                    Copy
                  </button>
                </div>
                <div className='highlight'>
                  <pre className='chroma'>
                    <code className='language-html' data-lang='html'>
                      <span className='d-block code-comment'>&lt;!-- For use as CSS background --&gt;</span>
                      {`url('${imageInfo.base64}')`}
                    </code>
                  </pre>
                </div>

                <div className='text-center'>
                  <img src={imageInfo.base64} alt='your file' className='img-thumbnail mt-4' />
                </div>
                <div className='image-info mt-4'>
                  <dl className='row small m-0'>
                    <dt className='col-sm-3'>File Name:</dt>
                    <dd className='col-sm-9'>{imageInfo.name}</dd>

                    <dt className='col-sm-3'>Type</dt>
                    <dd className='col-sm-9'>{imageInfo.type}</dd>

                    <dt className='col-sm-3'>Original Size</dt>
                    <dd className='col-sm-9'>{imageInfo.sizeBefore}</dd>

                    <dt className='col-sm-3'>Base64 Size</dt>
                    <dd className='col-sm-9'>{imageInfo.sizeAfter}</dd>
                  </dl>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  )
}

export default App
