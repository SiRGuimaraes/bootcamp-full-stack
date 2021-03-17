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


start();