const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

let button_start = document.querySelector('#button_start');
let p_guessesCorrect = document.querySelector('#p_guessesCorrect');
let p_guessesAll = document.querySelector('#p_guessesAll');
let p_answer = document.querySelector('#p_answer');
let div_progress_inner = document.querySelector('#div_progress_inner');
let p_hp = document.querySelector('#p_hp');
let p_result = document.querySelector('#p_result');

let wordBank = [
    'pine', 'spruce', 'larch', 'juniper', 'aspen', 'hornbeam', 'birch', 'alder', 'beech', 'oak', 'elm', 'cherry', 'pear', 'maple', 'linden', 'ash'
];

let wins = 0;
let losses = 0;

//choose how many chances you get
let totalMistake = 11;
let mistakeCount = 0;
let correctCount = 0;

p_hp.innerHTML = `${totalMistake - mistakeCount}/${totalMistake}`;


var sound_correct = new Audio('./assets/sounds/sound_correct.mp3');
var sound_incorrect = new Audio('./assets/sounds/sound_incorrect.mp3');
var sound_success = new Audio('./assets/sounds/sound_success.mp3');
var sound_failure = new Audio('./assets/sounds/sound_failure.mp3');
sound_correct.volume = 0.7;
sound_incorrect.volume = 0.7;
sound_success.volume = 0.2;
sound_failure.volume = 0.2;




var gameObject = {
    gameStart: function () {
        //reset UI
        p_hp.innerHTML = `${totalMistake - mistakeCount}/${totalMistake}`;
        p_guessesCorrect.textContent = '';
        p_guessesAll.textContent = '';
        p_answer.textContent = '';

        p_result.textContent = '';

        div_progress_inner.style.width = "100%";
        div_progress_inner.style.backgroundColor = "rgb(17, 210, 26)";

        sound_success.pause();
        sound_failure.pause();

        //game variables
        let answer = wordBank[parseInt(Math.random() * wordBank.length)];
        let guessesAll = [];
        let guessesCorrect = [];

        //setup UI
        button_start.innerHTML = 'PLAYING...';
        button_start.disabled = true;

        for (let i = 0; i < answer.length; i++) {
            guessesCorrect.push('_ ');
            p_guessesCorrect.innerHTML += guessesCorrect[i];
        }
        p_answer.textContent = `hint: ${answer}`;

        //setup keyboard
        document.addEventListener('keydown', keyResponse);
        function keyResponse(e) {
            let letter = e.key.toLowerCase();
            if (letter == 'a' || letter == 'b' || letter == 'c' || letter == 'd' || letter == 'e' || letter == 'f' || letter == 'g' || letter == 'h' || letter == 'i' || letter == 'j' || letter == 'k' || letter == 'l' || letter == 'm' || letter == 'n' || letter == 'o' || letter == 'p' || letter == 'q' || letter == 'r' || letter == 's' || letter == 't' || letter == 'u' || letter == 'v' || letter == 'w' || letter == 'x' || letter == 'y' || letter == 'z') {
                //search for a condition that will trigger an action
                let storeLetter = true;
                for (x of guessesAll) {
                    if (letter === x) {
                        storeLetter = false;
                    }
                }
                if (storeLetter) {
                    guessesAll.push(letter);
                    //rewrite in alphabetical order
                    p_guessesAll.innerHTML = '';
                    guessesAll = gameObject.sortAlphabetical(guessesAll);
                    for (x of guessesAll) {
                        p_guessesAll.innerHTML += `${x} `;
                    }

                    //check correct answers
                    let recordMistake = true;
                    for (let i = 0; i < answer.length; i++) {
                        if (letter === answer[i]) {
                            guessesCorrect[i] = letter;
                            correctCount++;
                            recordMistake = false;

                            p_guessesCorrect.innerHTML = '';
                            for (let j = 0; j < answer.length; j++) {
                                p_guessesCorrect.innerHTML += `${guessesCorrect[j]} `;
                            }
                        }
                    }
                    if (recordMistake) {
                        sound_incorrect.pause();
                        sound_incorrect.currentTime = 0;
                        sound_incorrect.play();
                    } else {
                        sound_correct.pause();
                        sound_correct.currentTime = 0;
                        sound_correct.play();
                    }

                    //render HP bar
                    if (recordMistake) {
                        mistakeCount++;
                        div_progress_inner.style.width = `${((totalMistake - mistakeCount) / totalMistake) * 100}%`;
                        if ((totalMistake - mistakeCount) / totalMistake < 0.2) {
                            div_progress_inner.style.backgroundColor = "rgb(248, 87, 55)";
                        } else if (((totalMistake - mistakeCount) / totalMistake < 0.5)) {
                            div_progress_inner.style.backgroundColor = "rgb(248, 226, 53)";
                        }
                    }
                    p_hp.innerHTML = `${totalMistake - mistakeCount}/${totalMistake}`;
                }
            }

            //end game actions
            ////outcome message
            if (correctCount === answer.length) {
                p_result.textContent += 'YOU WIN!!!';
                p_result.style.color = 'green';
                wins++;

                setTimeout(function () {
                    sound_success.pause();
                    sound_success.currentTime = 0;
                    sound_success.play();
                }, 500);
            } else if (mistakeCount === totalMistake) {
                p_result.textContent += 'YOU LOSE!!!';
                p_result.style.color = 'red';
                losses++;

                setTimeout(function () {
                    sound_failure.pause();
                    sound_failure.currentTime = 0;
                    sound_failure.play();
                }, 500);
            }
            ////reset counters, enable buttons, disable keyboard
            if (correctCount === answer.length || mistakeCount === totalMistake) {
                correctCount = 0;
                mistakeCount = 0;
                button_start.disabled = false;
                document.removeEventListener('keydown', keyResponse);
                button_start.innerHTML = 'REPLAY';
                div_score.textContent = `Wins: ${wins} | Losses: ${losses}`;
            }
        }
    },
    sortAlphabetical: function (array) {
        let tempArray = [];
        for (x of ALPHABET) {
            for (let i = 0; i < array.length; i++) {
                if (array[i] == x) {
                    tempArray.push(x);
                }
            }
        }
        return tempArray;
    }
}

button_start.addEventListener('click', gameObject.gameStart);
div_score.textContent = `Wins: ${wins} | Losses: ${losses}`;