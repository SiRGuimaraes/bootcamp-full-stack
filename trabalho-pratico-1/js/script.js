function start(){
  var inputRange = document.querySelector('#inputRange');
  var inputValue = document.querySelector('#inputValue');
  var inputText = document.querySelector('#inputText');

  inputRange.addEventListener('input', handleRangeInput);

  function handleRangeInput(event){
    var currentValue = event.target.value;
    inputValue.value = currentValue;
    inputText.value = numberToDescription(currentValue);
  }
}

function numberToDescription(value){
  switch(value.length){
    case 1: return units(value);
    case 2: return dozens(value);
    case 3: return hundreds(value);
  }
}

function units(value){
  return dictionary[value];
}

function dozens(value){
  var first = value[0];
  var second = value[1];

  if(first !== '1' && second !== '0'){
    first += '0';
    return `${dictionary[first]} e ${units(second)}`;
  }
  if(first === '1'){
    return dictionary[value];
  }
  return dictionary[value];
}

function hundreds(value){
  var first = value[0];
  var rest = value.substring(1);
  var prefix;

  if(rest !== '00'){
    first += '00';
    prefix = dictionary[first] + ' e ';

    if(rest[0] !== '0'){
      return prefix += dozens(rest);
    }
    var unit = rest[1];
    return prefix += units(unit);
  }
  if(first !== '1'){
    return dictionary[value];
  }
    return 'cem';
}

start();


