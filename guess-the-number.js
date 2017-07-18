var inquirer = require('inquirer');
var randomNum = Math.floor((Math.random() * 100) + 1);
console.log("Actual number is :" + randomNum);

var questions =
   [
      {
         type : 'input',
         name : 'numberGuess',
         message : 'what is your number between 1 and 100?'
      }
   ];

function askMe (lives) { //We need to return a promise after assigning it to a variable (or with function declaration) to allow loop back/recursion
   return inquirer.prompt(questions).then(function (answers) {
      var guess = answers.numberGuess;
      console.log(guess);
      if (guess === randomNum) {
         console.log("Winner!");
         return; //nothing needs to be passed to another then() after this callback
      }
      else if (guess < randomNum) {
         console.log("the guess is lower than the actual number");
         lives--;
         console.log("lives left: " + lives);
         if ( lives > 0 ) {
            askMe(lives).then();
         }
      }
      else if (guess > randomNum) {
         console.log("the guess is higher than the actual number");
         lives--;
         console.log("lives left: " + lives);
         if ( lives > 0 ) {
            askMe(lives).then();
         }
      }
   });
};

askMe(5);
