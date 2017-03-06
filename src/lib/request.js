const TOKEN = 'hE8I7nnVXYG9hdMTA5ZIhGqQxvB9uiiGDUhiyT1R';

type Method =
  | "POST"
  | "GET";

type Props = {
  url: string,
  onSuccessCallback: (content) => {},
  onFailedCallback: (code, content) => {},
  onProgressCallback: (percentage) => {},
  formData: FormData,
  method: Method
}

export default {

  upload(props: Props): void {
    const {url, onSuccessCallback, onFailedCallback, onProgressCallback, formData, method = 'POST'} = props
    const xhr = new XMLHttpRequest();

    xhr.open(method, url);
    xhr.setRequestHeader('Authorization', `Bearer ${TOKEN}`)

    xhr.onload = () => {
      if (xhr.status !== 200) {
        onFailedCallback(xhr.status, JSON.parse(xhr.responseText))
        return;
      }

      onSuccessCallback(JSON.parse(xhr.responseText));
    };
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = (event.loaded / event.total) * 100
        onProgressCallback(percent)
      }
    };

    if (method == 'POST') {
      xhr.send(formData);
    }

  },

  get(url: String): Promise{
    return fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
      },
    });
  },

  post(url: String, body: Object): Promise{
    return fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
      },
      body: JSON.stringify(body)
    });
  },
};
