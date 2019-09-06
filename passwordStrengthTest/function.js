window.onload = function(){
  var checkPasswordButton = document.getElementById("checkPassword");
  checkPasswordButton.addEventListener("click", checkPasswordStrength, false);
  var passwordStrength = document.getElementById("passwordStrength");
};



function consoleLog(theme, obj){
  console.group(theme);
    console.log("Count:", obj.count);
    console.log("Bonus:", obj.bonus);
  console.groupEnd();
}

function showBonus(theme, obj){
  const count = document.getElementById(`${theme}Count`);
  const bonus = document.getElementById(`${theme}Bonus`);
  count.innerText = obj.count;
  bonus.innerText = obj.bonus;
}

const type = {
  additions: ["Number of Characters", "Uppercase Letters", "Lowercase Letters", "Numbers", "Symbols", "Middle Numbers or Symbols", "Requirements"],
  deductions: ['Letters Only', 'Numbers Only', 'Repeat Characters (Case Insensitive)', 'Consecutive Uppercase Letters', 'Consecutive Lowercase Letters', 'Consecutive Numbers', 'Sequential Letters (3+)', 'Sequential Numbers (3+)', 'Sequential Symbols (3+)']
};

const theme = [
  'length',
  'upperLetter',
  'lowerLetter',
  'number',
  'symbol',
  'middleNumberOrSymbol',
  'requirement',
  'lettersOnly',
  'numbersOnly',
  'repeatCharacters',
  'consecutiveUpperLetter',
  'consecutiveLowerLetter',
  'consecutiveNumber',
  'sequentialLetter',
  'sequentialNumber',
  'sequentialSymbol'
];


//base function
function getBonusByCountAndWeight(getCount, weight, predicate = _.identity){
  return function(password){
    let count = 0;
    let bonus = 0;
    if (predicate(password)){
      count = getCount(password);
      bonus = (count * weight);
    }
    return {count, bonus};
  }
}

function getRegExpMatchCount(str, regExp){
  const matchs = str.match(regExp) || [];
  return matchs.length;
}

function getConsecutiveCharacterCount(regExp){
  return function(string){
    const matchs = string.match(regExp) || [];
    const count = _.reduce(matchs, (result, value) => {
      return result + (value.length - 1);
    }, 0);
    return count;
  };
}

function strReverse(string){
  const reversedString = _.reduce(string, (result, value) => {
    return `${value}${result}`;
  }, '');
  return reversedString;
}

function getLength(string){
  return string.length;
}

const weight = {
  length: 4,
  upperLetter: 2,
  lowerLetter: 2,
  number: 4,
  symbol: 6,
  middleNumberOrSymbol: 2,
  requirement: 2,

  lettersOnly: -1,
  numbersOnly: -1,
  repeatCharacters: -1,
  consecutiveUpperLetter: -2,
  consecutiveLowerLetter: -2,
  consecutiveNumber: -2,
  sequentialLetter: -3,
  sequentialNumber: -3,
  sequentialSymbol: -3
};

//Consecutive Character function
const getConsecutiveUpperLetterCount = getConsecutiveCharacterCount(/[A-Z]+/g);
const getConsecutiveLowerLetterCount = getConsecutiveCharacterCount(/[a-z]+/g);
const getConsecutiveNumberCount = getConsecutiveCharacterCount(/[0-9]+/g);

//sequential Character function
const sequentialCharacterConfig = {
  sequentialLetter: 'abcdefghijklmnopqrstuvwxyz',
  sequentialNumber: '0123456789',
  sequentialSymbol: '~!@#$%^&*()',
  sequentialLength: 3,
}

function getSequentialSubstrings(string, substringLength){
  const recArray = [];
  const count = (string.length - substringLength + 1);
  if (count >= 0){
    for (let i = 0; i < count; i++){
      recArray.push(string.substring(i, parseInt(i+substringLength)));
    }
  }
  return recArray;
}

function getSequentialCharacterCount(sequentialCharacter, sequentialLength){
  return function(string){
    let count = 0;
    const lowerString = string.toLowerCase();
    const sequentialSubstrings = getSequentialSubstrings(sequentialCharacter, sequentialLength);
    _.forEach(sequentialSubstrings, (value) => {
      if (lowerString.indexOf(value) !== -1 || lowerString.indexOf(strReverse(value)) !== -1){
        count++;
      }
    });
    return count;
  }
}

const getSequentialLetterCount = getSequentialCharacterCount(sequentialCharacterConfig.sequentialLetter, sequentialCharacterConfig.sequentialLength);
const getSequentialNumberCount = getSequentialCharacterCount(sequentialCharacterConfig.sequentialNumber, sequentialCharacterConfig.sequentialLength);
const getSequentialSymbolCount = getSequentialCharacterCount(sequentialCharacterConfig.sequentialSymbol, sequentialCharacterConfig.sequentialLength);



//is function
function isNumber(char){
  return /^[0-9]+$/.test(char);
}

function isUpperLetter(char){
  return /^[A-Z]+$/.test(char);
}

function isLowerLetter(char){
  return /^[a-z]+$/.test(char);
}

function isLetter(char){
  return (isLowerLetter(char) || isUpperLetter(char));
}

function isSymbol(char){
  if (char === ''){
    return false;
  }
  return !(isNumber(char) || isLetter(char));
}

//has function
function containNumber(string){
  return (/[0-9]/.test(string));
}

function containUpperLetter(string){
  return (/[A-Z]/.test(string));
}

function containLowerLetter(string){
  return (/[a-z]/.test(string));
}

function containLetter(string){
  return (containUpperLetter(string) || containLowerLetter(string));
}

function containSymbol(string){
  //不全为数字或字母即认为含有符号
  return (!(/^[0-9a-zA-Z]+$/.test(string)));
}

//getCount function
function getNumberCount(string){
  return getRegExpMatchCount(string, /[0-9]/g);
}

function getUpperLetterCount(string){
  return getRegExpMatchCount(string, /[A-Z]/g);
}

function getLowerLetterCount(string){
  return getRegExpMatchCount(string, /[a-z]/g);
}

function getLetterCount(string){
  return (getUpperLetterCount(string) + getLowerLetterCount(string));
}

function getSymbolNum(string){
  return (string.length - getNumberCount(string) - getLetterCount(string));
}

//Additions Count
function getMiddleNumberAndSymbolCount(password){
  const startIndex = 0;
  const endIndex = password.length - 1;
  const count = _.reduce(password, (result, value, index) => {
    if ((isNumber(value) || isSymbol(value)) && ((index > startIndex) && (index < endIndex))){
      result++;
    }
    return result;
  }, 0);
  return count;
}

function getRequirementCount(password){
  const require = {
    minLength: function(password){
      return (password.length >= 8);
    },
    containNumber,
    containLowerLetter,
    containUpperLetter,
    containSymbol
  };
  const count = _.reduce(require, (result, item) => {
    if (item(password)){
      result++;
    }
    return result;
  }, 0);
  return count;
}



//getBonus function
//Additions Bonus
const Additions = {
  getLengthBonus: getBonusByCountAndWeight(getLength, weight.length),

  getUpperLetterBonus: function(password){
    const weight = 2;
    const count = getUpperLetterCount(password);
    let bonus = 0;
    if ((containNumber(password) || containSymbol(password) || containLowerLetter(password)) && count !== 0){
      bonus = ((password.length - count) * weight);
    }
    return {count, bonus};
  },

  getLowerLetterBonus: function(password){
    const weight = 2;
    const count = getLowerLetterCount(password);
    let bonus = 0;
    if ((containNumber(password) || containSymbol(password) || containUpperLetter(password)) && count !== 0){
      bonus = ((password.length - count) * weight);
    }
    return {count, bonus};
  },

  getNumberBonus: getBonusByCountAndWeight(getNumberCount, weight.number, (password) => {
    return (containLetter(password) || containSymbol(password));
  }),

  getSymbolBonus: getBonusByCountAndWeight(getSymbolNum, weight.symbol),

  getMiddleNumberAndSymbolBonus: getBonusByCountAndWeight(getMiddleNumberAndSymbolCount, weight.middleNumberOrSymbol),

  getRequirementBonus: getBonusByCountAndWeight(getRequirementCount, weight.requirement, (password) => {
    return (getRequirementCount(password) >= 4);
  })
};


//Deductions
const Deductions = {
  getLetterOnlyBonus: getBonusByCountAndWeight(getLength, weight.lettersOnly, isLetter),

  getNumberOnlyBonus: getBonusByCountAndWeight(getLength, weight.numbersOnly, isNumber),

  getRepeatCharactersBonus: function(password){
    const passwordLength = password.length;
    let nRepInc = 0;
    let nRepChar = 0;
    for (let i = 0; i < passwordLength; i++){
      let bCharExists = false;
      for (let j = 0; j < passwordLength; j++){
        if (password[i] === password[j] && i !== j){
          bCharExists = true;
          nRepInc += Math.abs(passwordLength/(j-i));
        }
      }
      if (bCharExists){
        nRepChar++;
        const nUnqChar = passwordLength-nRepChar;
        nRepInc = (nUnqChar) ? Math.ceil(nRepInc/nUnqChar) : Math.ceil(nRepInc);
      }
    }
    const count = nRepChar;
    const bonus = (-1 * nRepInc);
    return {count, bonus};
  },

  getConsecutiveUpperLetterBonus: getBonusByCountAndWeight(getConsecutiveUpperLetterCount, weight.consecutiveUpperLetter),

  getConsecutiveLowerLetterBonus: getBonusByCountAndWeight(getConsecutiveLowerLetterCount, weight.consecutiveLowerLetter),

  getConsecutiveNumberBonus: getBonusByCountAndWeight(getConsecutiveNumberCount, weight.consecutiveNumber),

  getSequentialLetterBonus: getBonusByCountAndWeight(getSequentialLetterCount, weight.sequentialLetter),

  getSequentialNumberBonus: getBonusByCountAndWeight(getSequentialNumberCount, weight.sequentialNumber),

  getSequentialSymbolBonus: getBonusByCountAndWeight(getSequentialSymbolCount, weight.sequentialSymbol)
};


function checkPasswordStrength(event){
  const password = document.getElementById("password").value;
  const passwordStrength = document.getElementById('passwordStrength');

  const additionBonusArray = _.map(Additions, (item) => (item(password)));
  const deductionBonusArray = _.map(Deductions, (item) => (item(password)));
  const bonusArray = [...additionBonusArray, ...deductionBonusArray];

  const bonus = _.reduce(bonusArray, (result, value) => {
    return result + value.bonus;
  }, 0);

  passwordStrength.innerText = bonus;

  _.forEach(bonusArray, (value, index) => {
    consoleLog(type.additions[index], value);
  });

  _.forEach(bonusArray, (value, index) => {
    showBonus(theme[index], value);
  })

};
