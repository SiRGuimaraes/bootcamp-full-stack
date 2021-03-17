const tabCountries = document.querySelector('#tabCountries');
const tabFavorites = document.querySelector('#tabFavorites');
const countCountries = document.querySelector('#countCountries');
const countFavorites = document.querySelector('#countFavorites');
const totalPopulationList = document.querySelector('#totalPopulationList');
const totalPopulationFavorites = document.querySelector('#totalPopulationFavorites');

let allCountries = [];
let favoriteCountries = [];

function start(){
  fetchCountries();
}

async function fetchCountries(){
  const res = await fetch('https://restcountries.eu/rest/v2/all');
  const json = await res.json() ;

  allCountries = json.map(country => {
    const {numericCode, translations, population, flag} = country;

    return {
      id: numericCode,
      name: translations.br,
      population,
      flag
    }
  });
  render();
}

function render(){
  renderCountryList();
  renderFavorites();
  renderSumary();
  handleCountryButtons();
}

function renderCountryList(){
  let countriesHtml = '';

  allCountries.forEach(country => countriesHtml += handleHtmlList(country));

  tabCountries.innerHTML = countriesHtml;
}

function renderFavorites(){
  let favoritesHtml = '';

  favoriteCountries.forEach(country => favoritesHtml += handleHtmlList(country));

  tabFavorites.innerHTML = favoritesHtml;

  const buttons = tabFavorites.querySelectorAll('.btn');
  buttons.forEach((button)=>{
    button.classList.add('red', 'darken-4');
    button.textContent = '-';
  });
}

function handleHtmlList(country){
  const {id, name, population, flag} = country;
  const a = `<a id="${id}" class="waves-effect waves-light btn">+</a>`;
  const img = `<img src="${flag}" alt="${name}">`;
  const ul = `<ul><li>${name}</li><li>${formatNumber(population)}</li></ul>`
  
  return countryDiv = `
  <div class='country'>
    <div>${a}</div>
    <div>${img}</div>
    <div>${ul}</div>
  </div>
  `
}

start();