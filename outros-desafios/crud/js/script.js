let globalNames = ['Um', 'Dois', 'Três', 'Quatro', 'Cinco'];
let inputName = null;
let currentIndex = null;
let isEditing = false;

window.addEventListener('load', () => {
  inputName = document.querySelector('#inputName');
  
  preventFormSubmit();
  activateInput();
  render();
});


function preventFormSubmit(){
  function handleFormSubmit(event){
    event.preventDefault();
  }

  var form = document.querySelector('form');
  form.addEventListener('submit', handleFormSubmit);
}

function activateInput(){
  function insertName(newName){
    //globalNames.push(newName);
    globalNames = [...globalNames, newName];
  }
  function updateName(newName){
    globalNames[currentIndex] = newName;
  }
  function handleTyping(event){
    if(event.key === 'Enter' && event.target.value.trim() !== ''){
      if(isEditing){
        updateName(event.target.value);
      }else{
        insertName(event.target.value);
      }
      render();
      isEditing = false;
    }
  }

  inputName.addEventListener('keyup', handleTyping);
  inputName.focus();

}

function render(){
  function createDeletebutton(index){
    function deleteName(){
      //globalNames.splice(index, 1);
      globalNames = globalNames.filter((name, i) => i !== index);
      
      render();
    }
    var button = document.createElement('button');
    button.classList.add('deleteButton');
    button.classList.add('clickable');
    button.textContent = 'x';
    button.addEventListener('click', deleteName);

    return button;
  }
  function createSpan(name, index){
    function editItem(){
      inputName.value = name;
      inputName.focus();
      isEditing = true;
      currentIndex = index;
    }
    const span = document.createElement('span');
    span.classList.add('clickable');
    span.textContent = name;
    span.addEventListener('click', editItem)

    return span;
  }
  const divNames = document.querySelector('#names');
  const ul = document.createElement('ul');

  divNames.innerHTML = '';

  for(var i = 0; i < globalNames.length; i++){
    const currentName = globalNames[i];
    const li = document.createElement('li');
    const button = createDeletebutton(i);
    const span = createSpan(currentName, i);

    li.appendChild(button);
    li.appendChild(span);
    ul.appendChild(li);
  }

  divNames.appendChild(ul);
  clearInput();
}

function clearInput(){
  inputName.value = '';
  inputName.focus();
}