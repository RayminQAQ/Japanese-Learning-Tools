/*
    TO-DO:
        - Add more feature: 片假名, 清音, 濁音, 拗音
        - feature selection banner => using "display: none"
        - Time counting mode
*/


/* 
    Create data: 2023.08.15 
    Program: JS handle for 平假名_QA     
    Author: RayminQAQ
*/
// for rendering next question
function getRandomNumberInRange(a, b) {
    // 確保 a 不大於 b，如果是，則交換 a 和 b
    if (a > b) {
        [a, b] = [b, a];
    }

    // 生成 a 到 b 之間的隨機整數（包含 a 和 b）
    const randomNum = Math.floor(Math.random() * (b - a + 1)) + a;
    return randomNum;
}

function nextQuestion(dictionary_URL){
    function selectWord_JP(data){
        var DATASIZE = Object.keys(data["word"]).length;
        var SEED = getRandomNumberInRange(0, DATASIZE - 1);
        return data["word"][SEED]["JP_Hgn"]; 
    }

    // Process the JSON data here
    function processData(data) {
        // replace <label>
        const word_JP = document.getElementById("question");
        word_JP.innerText = selectWord_JP(data);
    }

    // Fetch the JSON file and pass it to the processData function
    fetch(dictionary_URL)
        .then(response => response.json())
        .then(data => processData(data))
        .catch(error => console.error('Error fetching JSON:', error));
}

// for checking answer
document.getElementById("answer").addEventListener("keypress", function(event){
    // Function to fetch JSON data
    async function getJSON(dictionary_URL) {
        try {
            const response = await fetch(dictionary_URL);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching JSON:', error);
            throw error;
        }
    }

    // Function to check answer
    async function checkAnswer(word_EN, word_JP, dictionary_URL) {
        const dataJSON = await getJSON(dictionary_URL); // Wait for JSON data
        const DATASIZE = Object.keys(dataJSON["word"]).length; // Use correct data structure
        for (let i = 0; i < DATASIZE; i++) {
            if (dataJSON["word"][i]["EN"] === word_EN.toLowerCase() && 
                dataJSON["word"][i]["JP_Hgn"] === word_JP) {
                return true;
            }
        }
        return false;
    }

    // show result
    function showRightResult(text, label){
        label.innerText = text;
        console.log(`${text}`);
        return;
    }

    function showWrongResult(text, label, userInput){
        label.innerText = text;
        console.log(`${text}, 但你的回答是: ${userInput}`);
        return;
    }
    
    // translate JP_Hgn into English
    function JPHgn_to_EN(JPHgn){
        const DICT = {
            "あ": "a", "い": "i", "う": "u", "え": "e", "お": "o",
            "か": "ka", "き": "ki", "く": "ku", "け": "ke", "こ": "ko",
            "さ": "sa", "し": "shi", "す": "su", "せ": "se", "そ": "so",
            "た": "ta", "ち": "chi", "つ": "tsu", "て": "te", "と": "to",
            "な": "na", "に": "ni", "ぬ": "nu", "ね": "ne", "の": "no",
            "は": "ha", "ひ": "hi", "ふ": "fu", "へ": "he", "ほ": "ho",
            "ま": "ma", "み": "mi", "む": "mu", "め": "me", "も": "mo",
            "や": "ya", "ゆ": "yu", "よ": "yo",
            "ら": "ra", "り": "ri", "る": "ru", "れ": "re", "ろ": "ro",
            "わ": "wa", "を": "wo", "ん": "n"
        }

        if (DICT.hasOwnProperty(JPHgn)) 
        {
            return DICT[JPHgn];
        } 
        else 
        {
            console.error(`平假名 ${JPHgn} 在字典中找不到對應的英文字母`);
            return ''; 
        }
    }

    // Enter Event
    if (event.key === "Enter") {
        const userInputValue = this.value;
        const dictionary_URL = "dictionary_main.json";
        const label = document.getElementById("result");
        const inputAnswerWeb = document.getElementById("question").innerText;
        checkAnswer(userInputValue, inputAnswerWeb, dictionary_URL)
            .then(result => {
                result ? showRightResult(`答案正確：${inputAnswerWeb}(${JPHgn_to_EN(inputAnswerWeb)})`, label)
                : showWrongResult(`答案錯誤：${inputAnswerWeb}(${JPHgn_to_EN(inputAnswerWeb)})`, label, userInputValue);
            })
            .catch(error => {
                console.error('An error occurred:', error);
            })

        // Clear <input> prompt
        this.value = "";

        nextQuestion(dictionary_URL);
    }
});