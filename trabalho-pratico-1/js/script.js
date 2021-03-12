function start(){
  const inputRange = document.querySelector('#inputRange');
  const inputValue = document.querySelector('#inputValue');
  const inputText = document.querySelector('#inputText');

  inputRange.addEventListener('input', handleRangeInput);

  function handleRangeInput(event){
    const currentValue = event.target.value;
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
  const first = value[0];
  const second = value[1];

  if(first !== '1' && second !== '0'){
    return `${dictionary[first + '00']} e ${units(second)}`;
  }
  if(first === '1'){
    return dictionary[value];
  }
  return dictionary[value];
}

function hundreds(value){
  const first = value[0];
  const rest = value.substring(1);

  if(rest !== '00'){
    const prefix = dictionary[first + '00'] + ' e ';

    if(rest[0] !== '0'){
      return prefix + dozens(rest);
    }
    return prefix + units(rest[1]);
  }
  if(first !== '1'){
    return dictionary[value];
  }
    return 'cem';
}

start();


