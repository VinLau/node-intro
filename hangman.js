//TODO: Implement a single character only version of this game? Sometimes I play the game such that I can guess the whole word so this was excluded here.
var inquirer = require('inquirer');
var request = require('request-promise');

var questions =
   [
      {
         type: 'input',
         name: 'letterGuess',
         message: 'Guess a letter!'
      }
   ];

getWord()
   .then( (response) => {
      var parsed = JSON.parse(response);
      var correctWord = parsed.word;
      return correctWord;
   })
   .then( (responseWord) => {
      askMe(generateUnderscores(responseWord), 8, responseWord);
   });

function getWord(){
   return request("http://api.wordnik.com/v4/words.json/randomWord?hasDictionaryDef=true&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=10&maxDictionaryCount=55&minLength=7&maxLength=12&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5");
}

function askMe(builtString, lives, ansWord) { //We need to return a promise after assigning it to a variable (or with function declaration) to allow loop back/recursion
   return inquirer.prompt(questions).then(function (answers) {
      var guess = answers.letterGuess;
      var matchesTest = ansWord.match(new RegExp(guess, 'gi')); // gi are the REGEX flags global and case-insensitive respectively

      if (matchesTest) {
         console.log("Correct, you guessed " + guess);
         var passBuildString = "";
         for (var i = 0; i < builtString.length; i++) { //just building the answer to help the user in this for loop!
            if (ansWord.charAt(i) === guess) {
               passBuildString += guess;
            }
            else {
               passBuildString += builtString.charAt(i);
            }
         } //end building answer string!
         if (passBuildString === ansWord) {
            console.log("Winner Winner Chicken Dinner!");
            return;
         }
         console.log("The current string is " + passBuildString + " Lives left: " + lives);
         askMe(passBuildString, lives, ansWord);
      }

      else {
         console.log("Incorrect!");
         lives--;
         console.log("Current string is " + builtString + " Lives left: " + lives);
         if (lives <= 7) {
            console.log("------");
         }
         if (lives <= 6) {
            console.log("     |");
         }
         if (lives <= 5) {
            console.log("     0");
         }
         if (lives <= 4) {
            console.log("     |");
         }
         if (lives <= 3) {
            console.log("    -|-");
         }
         if (lives <= 2) {
            console.log("     |");
         }
         if (lives <= 1) {
            console.log('    / \\');
         }
         if (lives <= 0) {
            console.log("YOU LOST! ANSWER WAS " + ansWord);
            return;
         }
         askMe(builtString, lives, ansWord); //i.e. after drawing art
      }

   });

}


function generateUnderscores(ansWord) {
   var returnString = "";
   for (var i = 0; i < ansWord.length; i++) {
      returnString += "_";
   }
   return returnString;
}

