const MIN_ACCEPTED_CHARS = 1;
const inputSearch = document.querySelector('#inputSearch');
const searchButton = document.querySelector('#searchButton');

let allUsers = [];
let filteredUsers = [];
let inputText = '';

function start(){
  fetchUsers();
  handleInputText();
  enableSearchButton();
  handleSearch();
}

async function fetchUsers(){
  const res = await fetch('http://localhost:3001/users');
  const json = await res.json();

  allUsers = json.map(({name, picture, dob, gender}) => {
    const fullName = `${name.first} ${name.last}`;
    const lowerCaseName = fullName.toLowerCase();

    return {
      name: fullName,
      lowerCaseName,
      picture: picture.thumbnail,
      age: dob.age,
      gender
    };
  });
}

function render(){
  renderFilteredUsers();
  renderStatistics();
}

function enableSearchButton(shouldEnable){
  shouldEnable ? searchButton.classList.remove('disabled') : 
  searchButton.classList.add('disabled');
}

function handleInputText(){
  inputSearch.addEventListener('input', event => {
    inputText = event.currentTarget.value.toLowerCase();
    const shouldEnable = event.currentTarget.value.length >= MIN_ACCEPTED_CHARS;
    enableSearchButton(shouldEnable);
  });
}

function handleSearch(){
  searchButton.addEventListener('click', () => {
    filterUsers();
  });
  inputSearch.addEventListener('keyup', (event) => {
    if(event.key === 'Enter'){
      filterUsers();
    }
  });
}

function filterUsers(){
  filteredUsers = allUsers.filter(({lowerCaseName}) => {
    return lowerCaseName.includes(inputText);
  });
  searchButton.classList.add('disabled');
  inputSearch.value = '';
  inputSearch.focus();
  render();
}

function renderFilteredUsers(){
  const divFilteredUsers = document.querySelector('#divFilteredUsers');
  const h2 = divFilteredUsers.querySelector('h2');
  const ul = divFilteredUsers.querySelector('ul');

  ul.textContent = '';
  h2.textContent = `${filteredUsers.length} usuário(s) encontrado(s)`;

  filteredUsers.map(({name, picture, age}) => {
    const li = document.createElement('li');
    const img = document.createElement('img');
    const nameSpan = document.createElement('span');
    const ageSpan = document.createElement('span');

    img.src = picture;
    img.classList.add('circle');
    nameSpan.textContent = name;
    ageSpan.textContent = `, ${age} anos`;

    li.appendChild(img);
    li.appendChild(nameSpan);
    li.appendChild(ageSpan);
    ul.appendChild(li);
  });

}

function renderStatistics(){
  const divUsersStatistics = document.querySelector('#divUsersStatistics');
  const h2 = divUsersStatistics.querySelector('h2');
  const ul = divUsersStatistics.querySelector('ul');
  const {male, female} = genderCount();

  h2.textContent = 'Estatísticas';
  ul.textContent = '';

  ul.innerHTML = `
  <li>Sexo masculino: <strong>${male}</strong></li>
  <li>Sexo female: <strong>${female}</strong></li>
  <li>Soma das idades: <strong>${agesSum()}</strong></li>
  <li>Média das idades: <strong>${averageAge()}</strong></li>
  `
}

function genderCount(){
  let genders = {
    male: 0,
    female: 0
  }
  filteredUsers.forEach(({gender})=>{
    gender === 'male' ? genders['male']++ : genders['female']++;
  });
  return genders;
}

function agesSum(){
  return filteredUsers.reduce((acc, curr) => acc + curr.age, 0);
}

function averageAge(){
  return (agesSum() / filteredUsers.length).toFixed(2).replace('.', ',');
}

start();