var map = L.map('map', {
	center: [-23.5505, -46.6333], // Coordenadas de São Paulo
	zoom: 7,
	zoomControl: false // Desabilita o controle de zoom padrão
});

// Adicionando a camada de tiles do OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Adicionando um controle de zoom no canto superior direito
L.control.zoom({
	position: 'topright' // Posição do controle de zoom
}).addTo(map);

 // Definindo a máscara com um grande polígono e uma "buraco" para o estado de São Paulo
 var mask = [
	// Coordenadas ao redor do mundo (fazendo o exterior do polígono)
	[[-90, -180], [-90, 180], [90, 180], [90, -180]],

	// Coordenadas do "buraco" (interior) que delimita o estado de São Paulo
	[
		[-25.5, -54.0], // Canto sudoeste
		[-25.5, -44.0], // Canto sudeste
		[-19.5, -44.0], // Canto nordeste
		[-19.5, -54.0], // Canto noroeste
		[-25.0, -54.0]  // Fechando o polígono
	]
];

// Criando o polígono da máscara
L.polygon(mask, {
	color: 'black',
	fillOpacity: 1, // Define a opacidade da máscara
	interactive: false // Torna o polígono não interativo
}).addTo(map);

// Definindo os limites (bounding box) para o estado de São Paulo
var bounds = [
	[-25.5, -54.0], // Coordenada do canto sudoeste (Sul, Oeste)
	[-19.5, -44.0]  // Coordenada do canto nordeste (Norte, Leste)
];

// Definindo os limites máximos do mapa para São Paulo
map.setMaxBounds(bounds);

// Impede o usuário de sair da área ao fazer zoom out
map.setMinZoom(7);
map.setMaxZoom(12);

// Quando o usuário tenta arrastar para fora dos limites, o mapa volta para a área visível
map.on('drag', function() {
	map.panInsideBounds(bounds, { animate: true });
});

 // URL do arquivo GeoJSON com os estados brasileiros
 var geojsonUrl = 'https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson';

 // Função para definir o estilo do polígono
 function style(feature) {
	 return {
		 fillColor: 'black',
		 fillOpacity: 0.5,
		 color: 'black',
		 weight: 2
	 };
 }

 // Carregando o arquivo GeoJSON do estado de São Paulo
 fetch(geojsonUrl)
	 .then(response => response.json())
	 .then(data => {
		 // Adicionando o GeoJSON ao mapa
		 L.geoJSON(data, {
			 style: style,
			 filter: function(feature) {
				 return feature.properties.sigla != 'SP'; // Filtrando apenas o estado de São Paulo
			 }
		 }).addTo(map);

		 // Ajustar o mapa para os limites do GeoJSON
		 map.fitBounds(L.geoJSON(data, {
			 filter: function(feature) {
				 return feature.properties.sigla === 'SP'; // Filtrando apenas o estado de São Paulo
			 }
		 }).getBounds());
	 })
	 .catch(error => console.error('Erro ao carregar o GeoJSON:', error));

// -----------------------------

// Capturando os elementos do DOM
const selectCidade = document.getElementById('cidade');
const inputData = document.getElementById('data');
const filtrarBtn = document.getElementById('filtrar');

// Evento de clique para o botão de filtrar
filtrarBtn.addEventListener('click', () => {
    const cidadeSelecionada = selectCidade.value;
    const dataSelecionada = inputData.value;

    if (cidadeSelecionada && dataSelecionada) {
        buscarDados(cidadeSelecionada, dataSelecionada);
    } else {
        alert("Por favor, selecione uma cidade e uma data.");
    }
});

// Função para buscar dados da API
async function buscarDados(cidade, data) {
    try {
        // const url = `URL_DA_API?cidade=${cidade}&data=${data}`;  // Substitua pela URL da sua API
        // const response = await fetch(url);
        // const dados = await response.json();
		var dados = [];

		// Simulando a resposta da API
		if (cidade === "sao-paulo") {
			dados = [
				{
					"latitude": -23.5505,
					"longitude": -46.6333,
					"descricao": "Evento em São Paulo"
				}
			]
		} else if (cidade === "rio-de-janeiro" ) {
			dados = [
				{
					"latitude": -22.9068,
					"longitude": -43.1729,
					"descricao": "Evento no Rio de Janeiro"
				}
			]
		}

        // Limpar os markers antigos, se necessário
        map.eachLayer(layer => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });

        // Adiciona os novos markers no mapa
        dados.forEach(item => {
            L.marker([item.latitude, item.longitude])
              .addTo(map)
              .bindPopup(item.descricao);
        });
    } catch (error) {
        console.error('Erro ao carregar dados da API', error);
    }
}

// Chamar a função para adicionar pins ao mapa
//adicionarPins();
