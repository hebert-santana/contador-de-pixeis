
self.addEventListener("message", agora);

// CARREGANDO
function agora(message) 
{
    const imageData = message.data.imageData;
    const contador = contador_pixeis(imageData);

    self.postMessage({
        "executar": "OK",
        contador
    });
}
/* Os campos RGB (red, green, blue) admitem valores numéricos de 0 a 255.
/* CONTAR NÚMERO DE PÍXEIS DE UMA ÚNICA COR. CRÉDITOS: https://stackoverflow.com/questions/19499500/canvas-getimagedata-for-optimal-performance-to-pull-out-all-data-or-one-at-a */

// EXECUTANDO
function contador_pixeis(data) 
{   
    const contador = {};                                                                                            // criando objeto vazio
    for(let index = 0; index < data.length; index = index + 4) {                                                    // colocando a lista HTML em uma string e armazenar no DOM (ligar array com string)
        const rgba = `rgba(${data[index]}, ${data[index + 1]}, ${data[index + 2]}, ${(data[index + 3] / 255)})`;    // varrendo as cores ([0, 0, 0, 0] até [255, 255, 255, 1]) // "${}" marcador de posição
  
       
       
        if (rgba in contador) {                                                                                     // se houver uma cor RGBA no contador
            contador[rgba] = contador[rgba] + 1;
        } else {
            contador[rgba] = 1;
        }
    }    
    return contador;                                                                                                // retornar a cor em RGBA
}

/*
red=imgData.data[0];
green=imgData.data[1];
blue=imgData.data[2];
alpha=imgData.data[3];
*/