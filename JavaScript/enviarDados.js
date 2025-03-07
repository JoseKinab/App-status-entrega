let form = document.querySelector('form');
let load = document.querySelector('.loading');

form.addEventListener("submit", async function(e) {
  e.preventDefault();
  load.style.display = 'block';

  let file1 = document.getElementById("file1").files[0];
  let file2 = document.getElementById("file2").files[0];

  let formData = new FormData();

  // Adiciona todos os campos do formulário ao FormData
  new FormData(form).forEach((value, key) => {
    formData.append(key, value);
  });

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      new Compressor(file, {
        quality: 0.6,
        maxWidth: 300,
        success(result) {
          // Converte o arquivo comprimido para base64
          let reader = new FileReader();
          reader.onload = function(event) {
            resolve(event.target.result.split(",")[1]);
          };
          reader.readAsDataURL(result);
        },
        error(err) {
          reject(err);
        },
      });
    });
  };

  if (file1) {
    try {
      let compressedFile1 = await compressImage(file1);
      formData.set("file1", compressedFile1);
    } catch (error) {
      console.error("Erro ao comprimir a imagem 1: ", error);
    }
  }

  if (file2) {
    try {
      let compressedFile2 = await compressImage(file2);
      formData.set("file2", compressedFile2);
    } catch (error) {
      console.error("Erro ao comprimir a imagem 2: ", error);
    }
  }

  fetch("https://script.google.com/macros/s/AKfycbzeI-qpwJkh5L9Jb10rn6mn78Q6y6kplQH3gFq72EinwPtZU8I0lIUhmzyLg0DgwBhG/exec", {
    method: "POST",
    body: formData
  }).then(response => response.text()).then(result => {
    console.log(result);
    alert("Dados enviados com sucesso!");
    form.reset();
    load.style.display = 'none';
  }).catch(error => {
    console.error("Erro ao enviar o formulário: ", error);
    load.style.display = 'none';
  });
});
