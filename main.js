// CRÉDITOS: https://stackoverflow.com/questions/8170431/using-web-workers-for-drawing-using-native-canvas-functions
// O Web Workers permite executar tarefas como disparar scripts de longa duração para executar tarefas muito dispendiosas, mas sem bloquear a interface de usuário ou outros scripts para manipular interações com o usuário.
// O Service Worker irá introduzir uma nova API de armazenamento, um local para armazenar respostas codificadas por solicitações, semelhante ao cache do navegador.
const hebert = new Worker('counter.js'); // worker para executar o counter.js


finalizar = (message) => {
    if(message.data.executar == "OK") {
        // desenhar amostra de cores
        this.desenharAmostraCor(message.data.contador);
        hebert.removeEventListener("message", finalizar);
                
        // esconder carregando
        const carregando = document.getElementById("carregando");
        carregando.classList.add("invisible");        

        // rolagem na amostra de cores
        const pixelCores = document.getElementById('pixel-cores'); 
        pixelCores.scrollIntoView({ behavior: 'smooth'});

        const contadorMarca = document.getElementById('color-count');
        contadorMarca.innerText = Object.keys(message.data.contador).length;
    }
};

/* ATUALIZAÇÃO ARQUIVO CARREGADO */

document.getElementById("image").addEventListener('change', (e) => 
{

    this.loadImage(e.target.files[0]);
}, false);

/* Pegar uma imagem válida e carregar a imagem no canvas.
 * Explicação sobre o image data: https://css-tricks.com/manipulating-pixels-using-canvas/#article-header-id-1
 */
loadImage = (arquivo_imagem) => {                                                           // carregar o arquivo
    const url = window.URL.createObjectURL(arquivo_imagem);
    const img = new Image();                                                                // criando objeto imagem no js, assim teremos uma variável img com objeto imagem dentro
    img.src = url;                                                                          // rota para incluir o arquivo. Com isso fazemos com que o objeto "Image" carregue a imagem que está no arquivo 'arquivo.jpg ou png'.
    img.onload = () => {                                                                    // esperar a imagem onload
        this.reset();

        const canvas = document.getElementById('canvas');                                   // encontrando o elemento canvas do HTML
        canvas.width = img.width;                                                           // canvas largura   = img largura
        canvas.height = img.height;                                                         // canvas altura    = img altura

        const context = canvas.getContext('2d');                                            // criando o objeto contexto do elemento 2d 
        context.drawImage(img, 0, 0);                                                       // exibir a imagem (objeto imagem) no canvas
                
        const uploadContainer = document.getElementById('container');        
        uploadContainer.appendChild(img);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

        window.URL.revokeObjectURL(this.src);                                               // O método estático URL.revokeObjectURL() libera um objeto URL que foi criado préviamente chamando URL.createObjectURL().  Utilize este método quando terminar de usar um objeto URL, para informar o navegador que não é mais necessário manter a referência para o arquivo.
        hebert.addEventListener("message", finalizar, false);
        hebert.postMessage({                                                                // A comunicação entre um worker e sua página de origem é feita por um modelo de evento e pelo método postMessage()
            "imageData": imageData.data
        });
        
        const carregando = document.getElementById("carregando");
        carregando.classList.remove("invisible");
    }  
};


desenharAmostraCor = (contador) => 
{
    let AmostraCoreS = document.getElementById('amostra-de-cores');

    for(const color in contador) {
        const container = document.createElement("section");
        const swatch = document.createElement("div");
        const contadorMarca = document.createElement("span");

        container.classList.add("color-swatch-container");

        swatch.classList.add("color-swatch");
        swatch.style.background = color;
        swatch.title = color;

        contadorMarca.innerHTML = `: ${contador[color]}`;

        container.appendChild(swatch);
        container.appendChild(contadorMarca);
        AmostraCoreS.appendChild(container);
    }
    
    let pixelCores = document.getElementById('pixel-cores');
    pixelCores.classList.remove('invisible');
};



/*
 * apagar memória
 */

reset = () => {                                                                                            //  restaurar os valores padrão
    let pixelCores = document.getElementById('pixel-cores');
    pixelCores.classList.add('invisible');

    let AmostraCoreS = document.getElementById('amostra-de-cores');
    while (AmostraCoreS.firstChild) {
        AmostraCoreS.removeChild(AmostraCoreS.firstChild);
    }
    
    let uploadContainer = document.getElementById('container');
    let image = uploadContainer.getElementsByTagName('img')[0];  

    if (image) {
        uploadContainer.removeChild(image);
    }

    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');  
    context.clearRect(0, 0, canvas.width, canvas.height);                                                   // apagar a tela com a dimensão da imagem
}


/*
The getImageData() method returns an ImageData object that copies the pixel data for the specified rectangle on a canvas.
Note: The ImageData object is not a picture, it specifies a part (rectangle) on the canvas, and holds information of every pixel inside that rectangle.
red=imgData.data[0];
green=imgData.data[1];
blue=imgData.data[2];
alpha=imgData.data[3];

*/
