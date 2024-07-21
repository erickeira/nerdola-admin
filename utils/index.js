import axios from "axios";

const key_encrypt_login = "nerdola-admin"

const formatMoney = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value / 100).replace('R$', '');
}

const formatMoneyBase = (numero) => {
    if(!numero) return '';
    if(parseFloat(numero) == 0) return '';
    numero = numero.replace('.', '');
    if (numero && /^\d{2,}$/.test(numero) || numero.length < 3) {
        const parteDecimal = numero.length == 1 ? `0${numero}` : numero.slice(-2);
        const parteInteira = numero.slice(0, -2);
        let numeroFormatado = parseFloat(`${parteInteira}.${parteDecimal}`).toFixed(2).replace('.', ',');
        numeroFormatado = numeroFormatado.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        return numeroFormatado || '';
    } else {
        return '';
    }
}

const formatNumberBase = (numero) => {
    numero = numero.toString()
    return numero ? numero.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '';
}

const buscaCep = async (cep = '') => {
    try{
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        const { data } = response;
        if(data.cep){
            return data;
        }    
        return false;
    }catch(e){
        return false;   
    }
}

const meses = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
];

function dataAtualFormatada() {
  const data = new Date();
  const dia = data.getDate();
  const mes = meses[data.getMonth()];
  const ano = data.getFullYear();
  return `${dia} ${mes} de ${ano}`;
}


const resizeImage = (file) => {
    return new Promise((resolve) => {
    const img = new Image();
        img.src = file;
        img.onload = () => {
          const canvas = document?.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const originalWidth = img.width;
          const originalHeight = img.height;
    
          let width = originalWidth;
          let height = originalHeight;
    
          const maxWidth = 2048;
          const maxHeight = 1024;
    
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
    
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
          
          canvas.width = width;
          canvas.height = height;
    
          ctx.drawImage(img, 0, 0, width, height);
    
          resolve(canvas.toDataURL('image/jpeg')); 
        };
    });
}; 


function gerarCorAleatoriaRGBA() {
    var r = Math.floor(Math.random() * 256); 
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256); 

    var corRGBA = "rgba(" + r + ", " + g + ", " + b + ", " + 1 + ")";
    return corRGBA;
}

function removeAcentos(texto) {
    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") 
        .replace(/[^a-zA-Z0-9\s]/g, "") 
        .toLowerCase(); 
}

export {
    formatMoney,
    formatMoneyBase,
    formatNumberBase,
    buscaCep,
    dataAtualFormatada,
    resizeImage,
    gerarCorAleatoriaRGBA,
    removeAcentos,
    key_encrypt_login
};
