const READFILE_DATA_URL = Symbol('READFILE_DATA_URL');
const READFILE_ARRAY_BUFFER = Symbol('READFILE_ARRAY_BUFFER');

function* bufToStrParts(buf) {
  const dataview = new DataView(buf, 0);
  for (let i = 0; i < buf.byteLength; ++i) {
    yield dataview.getUint8(i, true).toString(16);
  }
}

async function hash(str) {
  const { buffer: buf } = Uint8Array.from(atob(str.replace(/^data:image\/[^;]+;base64,/, '')), c => c.charCodeAt(0));
  const hashbuf = await crypto.subtle.digest('SHA-512', buf);
  return Array.from(bufToStrParts(hashbuf.slice(0, 32))).reduce((acc, cur) => acc + cur);
}

async function readFile(file, format) {
  const reader = new FileReader();
  let buf;

  return new Promise((resolve, reject) => {
    reader.onload = (e) => {
      buf = e.target.result;
    };

    reader.onerror = (e) => {
      reject(e);
    };

    reader.onloadend = () => {
      resolve(buf);
    };

    if (format === READFILE_ARRAY_BUFFER) {
      reader.readAsArrayBuffer(file);
    } else if (format === READFILE_DATA_URL) {
      reader.readAsDataURL(file);
    } else {
      reject('Unknown format');
    }
  });
}

class ImagesList {
  constructor(dest) {
    this.dest = dest;
    this.images = new Map();
  }

  async append(b64) {
    const imgHash = await hash(b64);
    if (!this.images.has(imgHash)) {
      this.images.set(imgHash, {
        image: b64,
        name: '',
        role: '',
      });
    }
  }

  render() {
    this.dest.innerHTML = '';
    for (const [imgHash, { image, name, role }] of this.images) {
      const $li = document.createElement('li');
      $li.dataset.hash = imgHash;
      const $img = document.createElement('img');
      const $name = document.createElement('input');
      $name.type = 'text';
      $name.value = name;
      $name.placeholder = 'Name';
      $name.classList.add('name');
      $name.addEventListener('change', (e) => {
        this.images.get(imgHash).name = e.currentTarget.value;
      });
      const $role = document.createElement('input');
      $role.type = 'text';
      $role.value = role;
      $role.placeholder = 'Role';
      $role.classList.add('role');
      $role.addEventListener('change', (e) => {
        this.images.get(imgHash).role = e.currentTarget.value;
      });
      $img.src = image;
      $li.appendChild($img);
      $li.appendChild($name);
      $li.appendChild($role);

      const $delete = document.createElement('span');
      $delete.classList.add('delete');
      $delete.innerHTML = '❌';
      $delete.addEventListener('click', (e) => {
        const { hash } = e.currentTarget.parentElement.dataset;
        this.images.delete(hash);
        this.render();
      });
      $li.appendChild($delete);

      this.dest.appendChild($li);
    }
  }

  getUploadPayload() {
    return Array.from(this.images.values());
  }
}

const images = new ImagesList(document.getElementById('imageList'));

document.getElementById('uploader').addEventListener('change', async (event) => {
  const { files } = event.currentTarget;
  for (const file of files) {
    const img = await readFile(file, READFILE_DATA_URL);
    await images.append(img);
  }
  images.render();
});

function download(blob) {
  const a = document.createElement('a');
  const url = URL.createObjectURL(blob);
  a.href = url;
  a.download = 'cards.pdf';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }, 0);
}

document.getElementById('download').addEventListener('click', async () => {
  const payload = images.getUploadPayload();
  if (payload.length === 0) {
    return;
  }
  const res = await fetch('/api/download', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  }).then((r) => r.blob());

  download(res);
});