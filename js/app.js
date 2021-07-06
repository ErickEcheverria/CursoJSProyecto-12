const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener('load', () => {
    formulario.addEventListener('submit',buscarClima);
})

function buscarClima(e) {
    e.preventDefault();

    // Validar
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;

    if(ciudad === '' || pais === '') {
        mostrarError('Campos Obligatorios');

        return;
    }

    // Consultar API
    consultarAPI(ciudad,pais);
}

function mostrarError(mensaje) {
    const alerta = document.querySelector('.bg-red-100');
    if(!alerta) {
        const alerta = document.createElement('div');
  
        alerta.classList.add('bg-red-100', "border-red-400", "text-red-700", "px-4", "py-3", "rounded", "relative", "max-w-md", "mx-auto", "mt-6", "text-center" );
  
        alerta.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block sm:inline">${mensaje}</span>
        `;
  
        container.appendChild(alerta);
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

function consultarAPI(ciudad, pais) {

    const appId = '71b2285696a5e0183eb0238268bee90a';

    const url = `http://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;

    Spinner();

    setTimeout(() => {
        fetch(url)
        .then( respuesta => respuesta.json())
        .then( datos => {

            limpiarHTML();

            if(datos.cod === "404"){
                mostrarError('Ciudad no Encontrada');
                return;
            }

            // Funcion para imprimir
            mostrarClima(datos);
        })
    }, 2500);

    
}

function mostrarClima(datos){
    const { name, main: { temp, temp_max, temp_min,humidity,pressure } } = datos;

    console.log(datos)

    const centigrados = kelvinACentigrados(temp);
    const max = kelvinACentigrados(temp_max);
    const min = kelvinACentigrados(temp_min);

    const nombreCiudad = document.createElement('p');
    nombreCiudad.textContent = `Ciudad: ${name}`;
    nombreCiudad.classList.add('font-bold','text-2xl');

    const actual = document.createElement('p');
    actual.innerHTML = `${centigrados} &#8451;`;
    actual.classList.add('font-bold','text-6xl');

    const maxT = document.createElement('p');
    maxT.innerHTML = `Temperatura Maxima: ${max} &#8451;`;
    maxT.classList.add('text-xl');

    const minT = document.createElement('p');
    minT.innerHTML = `Temperatura Minima: ${min} &#8451;`;
    minT.classList.add('text-xl');

    const humedad = document.createElement('p');
    humedad.innerHTML = `Humedad: ${humidity}`;
    humedad.classList.add('text-xl');

    const presion = document.createElement('p');
    presion.innerHTML = `Presion: ${pressure}`;
    presion.classList.add('text-xl');

    

    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('text-center','text-white');
    resultadoDiv.appendChild(nombreCiudad);
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(maxT);
    resultadoDiv.appendChild(minT);
    resultadoDiv.appendChild(humedad);
    resultadoDiv.appendChild(presion);

    resultado.appendChild(resultadoDiv);

}

const kelvinACentigrados = grados => parseInt(grados - 273.15);



function limpiarHTML() {
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}

function Spinner(){

    limpiarHTML();

    const divSpinner = document.createElement('div');
    divSpinner.classList.add('spinner');

    divSpinner.innerHTML = `
    <div class="double-bounce1"></div>
    <div class="double-bounce2"></div>
    `;

    resultado.appendChild(divSpinner);
}
