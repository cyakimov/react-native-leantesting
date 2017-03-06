export const base64MimeType = (encoded) => {
  let result = null;

  if (typeof encoded !== 'string') {
    return result;
  }

  const mime = encoded.substring(0, 30).match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);

  if (mime && mime.length) {
    result = mime[1];
  }

  return result;
}

export const isBase64Image = (base64) => {
  const type = base64MimeType(base64)

  switch (type) {
    case 'image/jpg':
    case 'image/jpeg':
    case 'image/png':
    case 'image/gif':
    case 'image/bmp':
    case 'image/tiff':
      return true
    default:
      return false
  }
}

export const isImage = (uri) => {

  if (typeof uri !== 'string') {
    return false
  }


  if (uri.indexOf('data:image/') === 0) {
    return isBase64Image(uri)
  }

  return uri.toLowerCase().match(/\.(jpg|jpeg|png|gif|bmp|tiff)$/) !== null
}