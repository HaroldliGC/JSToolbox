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

//Consecutive Character function
const getConsecutiveUpperLetterCount = getConsecutiveCharacterCount(/[A-Z]+/g);
const getConsecutiveLowerLetterCount = getConsecutiveCharacterCount(/[a-z]+/g);
const getConsecutiveNumberCount = getConsecutiveCharacterCount(/[0-9]+/g);

//sequential Character function
const sequentialCharacterConfig = {
  sequentialLetter: 'abcdefghijklmnopqrstuvwxyz',
  sequentialNumber: '0123456789',
  sequentialSymbol: '~!@#$%^&*()',
  sequentialLength: 3
};

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
function isNumber(string){
  return /^[0-9]+$/.test(string);
}

function isUpperLetter(string){
  return /^[A-Z]+$/.test(string);
}

function isLowerLetter(string){
  return /^[a-z]+$/.test(string);
}

function isLetter(string){
  return (isLowerLetter(string) || isUpperLetter(string));
}

function isSymbol(string){
  if (_.isEmpty(string)){
    return false;
  }
  return !(isNumber(string) || isLetter(string));
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
  if (_.isEmpty(string)){
    return false;
  }
  //不全为数字或字母即认为含有符号
  return (!(/^[0-9a-zA-Z]+$/.test(string)));
}

//getCount function
function getRegExpMatchCount(str, regExp){
  const matchs = str.match(regExp) || [];
  return matchs.length;
}

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

function getSymbolCount(string){
  return (string.length - getNumberCount(string) - getLetterCount(string));
}

//getBonus function
//Additions
const Additions = {
  getLengthBonus: function(password){
    const weight = 4;
    const count = password.length;
    const bonus = count * weight;
    return {count, bonus};
  },

  getUpperLetterBonus: function(password){
    const weight = 2;
    const count = getUpperLetterCount(password);
    const bonus = ((containNumber(password) || containSymbol(password) || containLowerLetter(password)) && count !== 0) ? ((password.length - count) * weight) : 0;
    return {count, bonus};
  },

  getLowerLetterBonus: function(password){
    const weight = 2;
    const count = getLowerLetterCount(password);
    const bonus = ((containNumber(password) || containSymbol(password) || containUpperLetter(password)) && count !== 0) ? ((password.length - count) * weight) : 0;
    return {count, bonus};
  },

  getNumberBonus: function(password){
    const weight = 4;
    const count = getNumberCount(password)
    const bonus = (containLetter(password) || containSymbol(password)) ? (count * weight) : 0;
    return {count, bonus};
  },

  getSymbolBonus: function(password){
    const weight = 6;
    const count = getSymbolCount(password);
    const bonus = count * weight;
    return {count, bonus};
  },

  getMiddleNumberAndSymbolBonus: function(password){
    const weight = 2;
    const startIndex = 0;
    const endIndex = password.length - 1;
    const count = _.reduce(password, (result, value, index) => {
      if ((isNumber(value) || isSymbol(value)) && ((index > startIndex) && (index < endIndex))){
        result++;
      }
      return result;
    }, 0);
    const bonus = count * weight;
    return {count, bonus};
  },

  getRequirementBonus: function(password){
    const weight = 2;
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
    const bonus = count >= 4 ? (count * weight) : 0;
    return {count, bonus};
  }
};


//Deductions
const Deductions = {
  getLetterOnlyBonus: function(password){
    const weight = -1;
    let count = 0;
    let bonus = 0;
    if (isLetter(password)){
      count = password.length
      bonus = count * weight;
    }
    return {count, bonus};
  },

  getNumberOnlyBonus: function(password){
    const weight = -1;
    let count = 0;
    let bonus = 0;
    if (isNumber(password)){
      count = password.length;
      bonus = count * weight;
    }
    return {count, bonus};
  },

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

  getConsecutiveUpperLetterBonus: function(password){
    const weight = -2;
    const count = getConsecutiveUpperLetterCount(password);
    const bonus = count * weight;
    return {count, bonus};
  },

  getConsecutiveLowerLetterBonus: function(password){
    const weight = -2;
    const count = getConsecutiveLowerLetterCount(password);
    const bonus = count * weight;
    return {count, bonus};
  },

  getConsecutiveNumberBonus: function(password){
    const weight = -2;
    const count = getConsecutiveNumberCount(password);
    const bonus = count * weight;
    return {count, bonus};
  },

  getSequentialLetterBonus: function(password){
    const weight = -3;
    const count = getSequentialLetterCount(password);
    const bonus = count * weight;
    return {count, bonus};
  },

  getSequentialNumberBonus: function(password){
    const weight = -3;
    const count = getSequentialNumberCount(password);
    const bonus = count * weight;
    return {count, bonus};
  },

  getSequentialSymbolBonus: function(password){
    const weight = -3;
    const count = getSequentialSymbolCount(password);
    const bonus = count * weight;
    return {count, bonus};
  }
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





