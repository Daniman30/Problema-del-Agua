let data;

fetch('data.json')
  .then(response => response.json())
  .then(datos => {
    data = datos;
    
    function crearGradiente(svgID, gradienteID, porcentaje, color){
        var svg = document.getElementById(svgID);
        
        var defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        
        var linearGradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
        linearGradient.setAttribute("id", gradienteID);
        linearGradient.setAttribute("gradientTransform", "rotate(90)");
        
        var stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
        stop1.setAttribute("offset", "0%");
        stop1.setAttribute("stop-color", "#c3e3ff");
        
        var stop11 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
        stop11.setAttribute("offset", 100 - porcentaje + "%");
        stop11.setAttribute("stop-color", "#c3e3ff");
        
        var stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
        stop2.setAttribute("offset", 100 - porcentaje + "%");
        stop2.setAttribute("stop-color", color);
        
        var stop21 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
        stop21.setAttribute("offset", "100%");
        stop21.setAttribute("stop-color", color);
        
        linearGradient.appendChild(stop1);
        linearGradient.appendChild(stop11);
        linearGradient.appendChild(stop2);
        linearGradient.appendChild(stop21);
        
        defs.appendChild(linearGradient);
        
        svg.appendChild(defs);
    }
    
    function actualizarGradiente(gradienteID, porcentaje, color){
        
        var linearGradient = document.getElementById(gradienteID);
        let stops = [];
        
        
        var stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
        stop1.setAttribute("offset", "0%");
        stop1.setAttribute("stop-color", "#c3e3ff");
        stops.push(stop1);
        
        var stop11 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
        stop11.setAttribute("offset", 100 - porcentaje + "%");
        stop11.setAttribute("stop-color", "#c3e3ff");
        stops.push(stop11);
        
        var stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
        stop2.setAttribute("offset", 100 - porcentaje + "%");
        stop2.setAttribute("stop-color", color);
        stops.push(stop2);
        
        var stop21 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
        stop21.setAttribute("offset", "100%");
        stop21.setAttribute("stop-color", color);
        stops.push(stop21);
        
        if (porcentaje == -1){
            stop1.setAttribute("stop-color", "transparent");
            stop11.setAttribute("stop-color", "transparent");
            stop2.setAttribute("stop-color", "transparent");
            stop21.setAttribute("stop-color", "transparent");
        }
        
        let collect = linearGradient.getElementsByTagName("stop");
        for (let index = 0; index < collect.length; index++) {
            linearGradient.replaceChild(stops[index],collect[index]);
        }
    }
    function asignarColor(gradienteID, valor) {
        // Convierte el valor a un número hexadecimal
        var hex = Math.round(valor * 255 / 100).toString(16);
        
        // Asegúrate de que el hexadecimal tenga dos dígitos
        if (hex.length < 2) {
            hex = "0" + hex;
        }
        
        // Crea el color en formato hexadecimal
        var color = "#" + hex + hex + hex;
        
        // Cambia el color del gradiente
        var gradiente = document.getElementById(gradienteID);
        var stops = gradiente.getElementsByTagName("stop");
        
        for (var i = 0; i < stops.length; i++) {
            stops[i].setAttribute("stop-color", color);
        }
    }

    function FillCountries(){
        var countries = [];
        var i = -1;
        for (var country in data.countries){
            i++;
            countries[i] = country;
        }
        return countries;
    }

    function GetCountryNames(countries, bool){
        var countryNames = [];
        for (var i = 0; i < countries.length; i++) {
          countryNames[i] = data.countries[countries[i]].country_name;
        }
        if (bool) return ordenarArray(countryNames);
        return countryNames;
    }

    function GetCountryName(countryID){
        return data.countries[countryID].country_name;
    }

        var select = document.getElementById("Countries");
        var nombres = FillCountries();
        var countryNames = GetCountryNames(nombres, false);
        
        for (var i = 0; i < nombres.length; i++) {
            var option = document.createElement("option");
            option.text = countryNames[i];
            option.value = nombres[i];
            select.add(option);
        }
        
        function ordenarArray(array){
            for (var i = 0; i < array.length; i++) {
            for (var j = 0; j < array.length - 1; j++) {
                if (array[j] > array[j + 1]) {
                var temp = array[j];
                array[j] = array[j + 1];
                array[j + 1] = temp;
                }
            }
            }
            return array;
        }

        function value(value){
            for(var country in data.countries){
                if (country == value) 
                return Math.floor((data.countries[country].water_access * 100) / data.countries[country].population);
            }
        }

        function fillMoneyOnu(countries){
            var money = [];
            for (var i = 0; i < countries.length; i++) {
                money[i] = data.countries[countries[i]].ONU_inversion;
            }
            return money;
        }

        function fillMoneyMrBeast(countries){
            var money = [];
            for (var i = 0; i < countries.length; i++) {
                money[i] = data.countries[countries[i]].MrBeast_inversion;
            }
            return money;
        }

        let valorSeleccionadoGlobal;

        document.getElementById("Countries").addEventListener("change", miFuncion);

        function miFuncion() {
            valorSeleccionadoGlobal = this.value;
            let valor;
            let pais;
            
            if (valorSeleccionadoGlobal == 'Todos') {
                valor = Math.floor((accesoAguaTotal(FillCountries()) * 100) / poblacionTotal(FillCountries()));
                pais = 'toda Africa';
            }
            else {
                valor = value(valorSeleccionadoGlobal);
                pais = GetCountryName(valorSeleccionadoGlobal);
            }

            actualizarGradiente('F1g', valor, '#84b6f4')
            actualizarGradiente('F2g', 100 - valor, '#97572B')
            let parrafoLimpio = document.getElementById('aguaLimpia');
            let parrafoSucio = document.getElementById('aguaSucia');

            parrafoLimpio.innerText = 'El ' + valor + '% de la población de ' + pais + ' tiene acceso a agua limpia';
            parrafoSucio.innerText = 'El ' + (100 - valor) + '% de la población de ' + pais + ' no tiene acceso a agua limpia';
        }

    
    crearGradiente('botella', 'F1g', 100, '#84b6f4');
    crearGradiente('botella', 'F2g', 100, '#97572B');




    let array = fillMoneyOnu(FillCountries()); // Este es el array de enteros
    array.push(3);

    let originalArray = [...array]; // Crea una copia del array original

    let labels = GetCountryNames(FillCountries(), false); // Obtiene los nombres de los países
    labels.push('Inversión de MrBeast'); // Agrega el nombre de la última barra

    let backgroundColors = array.map(() => '#5b92e5'); // Crea un array de colores
    backgroundColors[backgroundColors.length - 1] = '#97572B'; // Cambia el color del último elemento

    let borderColors = array.map(() => '#5b92e5'); // Crea un array de colores para los bordes
    borderColors[borderColors.length - 1] = '#97572B'; // Cambia el color del último elemento

    // Crea el gráfico
    let ctx = document.getElementById('myChart').getContext('2d');
    let myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'ONU',
                data: array,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y', // Cambia el eje de índice a 'y'
            scales: {
                x: {
                    beginAtZero: true
                }
            },
            responsive: true,
            aspectRatio: 7/9
        }
    });

    // Obtiene el contenedor para el gráfico y los selectores
    let container = document.getElementById('checkboxes');

    // Crea las casillas de verificación
    labels.forEach((label, index) => {
        // Crea un nuevo div para cada par de checkbox y etiqueta
        let checkboxDiv = document.createElement('div');
        checkboxDiv.className = 'custom-checkbox'; // Aplica la clase de estilo al div

        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `checkbox-${index}`;
        checkbox.checked = true;
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                myChart.data.datasets[0].data[index] = originalArray[index]; // Restaura el valor original
            } else {
                myChart.data.datasets[0].data[index] = null;
            }
            myChart.update();
    });

    let labelElement = document.createElement('label');
    labelElement.htmlFor = `checkbox-${index}`;

    // Añade el checkbox y la etiqueta al div
    checkboxDiv.appendChild(checkbox);
    checkboxDiv.appendChild(labelElement);

    // Añade el div al contenedor
    container.appendChild(checkboxDiv);
});

    
    

    function poblacionTotal(countries){
        var total = 0;
        for (var i = 0; i < countries.length; i++) {
            total += data.countries[countries[i]].population;
        }
        return total;
    }

    function accesoAguaTotal(countries){
        var total = 0;
        for (var i = 0; i < countries.length; i++) {
            total += data.countries[countries[i]].water_access;
        }
        return total;
    }
myChart.update();
})

// Asegúrate de que el documento HTML ha cargado completamente
document.addEventListener("DOMContentLoaded", function(){
    // Selecciona el SVG
    const miSVG = document.querySelector('object[data="/Data js/water-outline-svgrepo-com.svg"]');
  
    // Espera a que el SVG se haya cargado completamente
    miSVG.addEventListener("load", function(){
      // Accede al contenido del SVG
      const svgDoc = miSVG.contentDocument;
  
      // Selecciona el elemento dentro del SVG que quieres animar
      const gota = svgDoc.querySelector('#gota');
  
      // Anima tu SVG
      TweenMax.to(gota, 1, { attr: { viewBox: "-19 -40 40 40" }, repeat: -1, repeatDelay: 2});
    });
  });

var boy = document.getElementById('boy');
var girl = document.getElementById('girl');

// Asegúrate de que el documento HTML ha cargado completamente
document.addEventListener("DOMContentLoaded", function(){
    // Selecciona el SVG
    const miSVG = document.querySelector('object[data="/Data js/girl-child-svgrepo-com.svg"]');
  
    // Espera a que el SVG se haya cargado completamente
    miSVG.addEventListener("load", function(){
      // Accede al contenido del SVG
      const svgDoc = miSVG.contentDocument;
  
      // Selecciona los elementos dentro del SVG que quieres animar
      const boy = svgDoc.querySelector('#boy');
      const girl = svgDoc.querySelector('#girl');
  
      // Inicialmente, hacemos que 'girl' sea invisible
      boy.style.display = 'inline';
      girl.style.display = 'none';
  
      // Cada 12 segundos, alternamos la visibilidad de los paths
      setInterval(function() {
          if (boy.style.display === 'none') {
              boy.style.display = 'inline';
              girl.style.display = 'none';
          } else {
              girl.style.display = 'inline';
              boy.style.display = 'none';
          }
      }, 12000);
    });
  });
  


// Asegúrate de que el documento HTML ha cargado completamente
document.addEventListener("DOMContentLoaded", function(){
    // Selecciona el SVG
    const miSVG = document.querySelector('object[data="/Data js/Africa_cm.svg"]');
  
    // Espera a que el SVG se haya cargado completamente
    miSVG.addEventListener("load", function(){
        // Accede al contenido del SVG
        const svgDoc = miSVG.contentDocument;

        // Obten el contenedor para el gráfico y los selectores
        let container = document.getElementById('graficaMapa');

        // Crea el cartel
        const cartel = document.createElement('div');
        cartel.style.display = 'block';
        cartel.style.position = 'relative';
        cartel.style.right = '-100px'; // Posiciona el cartel a la derecha
        cartel.style.top = '0px'; // Posiciona el cartel en el centro verticalmente
        cartel.style.marginBottom = 'auto';
        cartel.style.fontSize = '35px';
        container.appendChild(cartel); // Agrega el cartel al div "graficaMapa"

        // Crea el bloque para el SVG
        const bloqueSvg = document.createElement('div');
        bloqueSvg.innerHTML = '<object id="miSvg" data="/Data js/youtube-color-svgrepo-com.svg" type="image/svg+xml" width="200" height="200"></object>';
        cartel.appendChild(bloqueSvg);

        // Crea el bloque para el texto
        const bloqueTexto = document.createElement('div');
        bloqueTexto.textContent = "TOTAL construidos 100 pozos"; // Añade el texto inicial
        bloqueTexto.style.width = '180px';
        cartel.appendChild(bloqueTexto);
  
        // Información personalizada para cada id
        const info = {
            'so': { texto: 'SOMALIA construidos 10 pozos', svg: 'Data js/flag-for-flag-somalia-svgrepo-com.svg' },
            'zw': { texto: 'ZIMBABWE construidos 17 pozos', svg: 'Data js/flag-for-flag-zimbabwe-svgrepo-com.svg' },
            'ke': { texto: 'KENIA construidos 52 pozos', svg: 'Data js/flag-for-flag-kenya-svgrepo-com.svg' },
            'ug': { texto: 'UGANDA construidos 6 pozos', svg: 'Data js/flag-for-flag-uganda-svgrepo-com.svg' },
            'cm': { texto: 'CAMERUN construidos 15 pozos', svg: 'Data js/flag-for-flag-cameroon-svgrepo-com.svg' }
        };
    
        // Para cada id en la lista
        for (let id in info) {
            // Selecciona el elemento dentro del SVG que quieres animar
            const elemento = svgDoc.querySelector('#' + id);
    
            // Cuando el ratón pasa por encima del elemento, muestra el cartel
            elemento.addEventListener('mouseover', function(event) {
                // Inserta el SVG en bloqueSvg
                bloqueSvg.innerHTML = '<object id="miSvg" data="' + info[id].svg + '" type="image/svg+xml" width="200" height="200"></object>';
                
                // Luego añade el texto al bloqueTexto
                bloqueTexto.textContent = info[id].texto;
                cartel.style.display = 'block';
                cartel.style.marginBottom = 'auto';
                cartel.style.fontSize = '35px';
                bloqueTexto.style.width = '180px';
                
            });
            
    
            // Cuando el ratón sale del elemento, oculta el cartel
            elemento.addEventListener('mouseout', function() {
                bloqueSvg.innerHTML = '<object id="miSvg" data = "/Data js/youtube-color-svgrepo-com.svg" type="image/svg+xml" width="200" height="200"></object>';
                bloqueTexto.textContent = "TOTAL: construidos 100 pozos";
                cartel.style.display = 'block';
                cartel.style.marginBottom = 'auto';
                cartel.style.fontSize = '35px';
                bloqueTexto.style.width = '200px';
            });
        }

    });
});
  

  
