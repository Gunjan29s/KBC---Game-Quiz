const questions = [
    {question:"Which country is the largest democracy in the world?", options:["USA","Russia","China","India"], answer:"India"},
    {question:"Who is known as the Father of the Indian Constitution?", options:["Mahatma Gandhi","Jawaharlal Nehru","B.R. Ambedkar","Sardar Patel"], answer:"B.R. Ambedkar"},
    {question:"Which planet is known as the Red Planet?", options:["Venus","Mars","Jupiter","Saturn"], answer:"Mars"},
    {question:"Which river is the longest river in the world?", options:["Amazon","Nile","Yangtze","Mississippi"], answer:"Nile"},
    {question:"In which year did India gain independence?", options:["1942","1947","1950","1952"], answer:"1947"},
    {question:"Which country hosted the 2020 Summer Olympics?", options:["China","Japan","Brazil","France"], answer:"Japan"},
    {question:"Who discovered gravity?", options:["Albert Einstein","Galileo Galilei","Isaac Newton","Nikola Tesla"], answer:"Isaac Newton"},
    {question:"Which is the largest continent by area?", options:["Africa","North America","Asia","Europe"], answer:"Asia"},
    {question:"Which is the smallest country in the world?", options:["Monaco","Maldives","Vatican City","Liechtenstein"], answer:"Vatican City"},
    {question:"Which Indian city is called Silicon Valley of India?", options:["Delhi","Mumbai","Bengaluru","Hyderabad"], answer:"Bengaluru"}
];

const priceLadder = [1000,2000,3000,5000,10000,20000,40000,80000,160000,320000];

let usedIndices = new Set();
let currentLevel = 0;
let currentQuestion = null;
let timerInterval = null;
let introTimer = null;
let timeLeft = 30;

let selectedAnswer = null;
let selectedButton = null;

let friendUsed = false;
let fiftyUsed = false;

window.onload = function(){

    introTimer = setTimeout(showLoginScreen,50000);

    let playBtn = document.getElementById("playIntroBtn");
    if(playBtn){
        playBtn.onclick = function(){
            clearTimeout(introTimer);
            this.style.display = "none";

            const frame = document.getElementById("introFrame");
            if(frame){
                frame.src = "https://www.youtube.com/embed/gf0VjCg2cn8?autoplay=1&mute=0&controls=0&rel=0";
            }

            introTimer = setTimeout(showLoginScreen,18000);
        };
    }

    let startBtn = document.getElementById("startBtn");
    if(startBtn){
        startBtn.onclick = function(){

            unlockAudios();

            const uname = document.getElementById("username").value;

            if(uname==""){
                alert("Please Enter Name");
                return;
            }

            document.getElementById("playerName").innerText = "👤 " + uname;
            document.getElementById("loginScreen").style.display = "none";
            document.getElementById("gameScreen").style.display = "block";

            loadQuestion();
        };
    }

    let lockBtn = document.getElementById("lockBtn");
    if(lockBtn){
        lockBtn.onclick = function(){
            if(selectedAnswer==null){
                alert("Please Select Any Option First");
                return;
            }

            this.style.display = "none";
            checkAnswer(selectedAnswer,currentQuestion.answer,selectedButton);
        };
    }

    document.getElementById("fifty").onclick = useFiftyFifty;
    document.getElementById("friend").onclick = callFriend;
};

function showLoginScreen(){
    let intro = document.getElementById("introOnlyVideo");
    if(intro){
        intro.remove();
    }
    document.getElementById("loginScreen").style.display = "block";
}

function unlockAudios(){
    let ids = ["timerAudio","correctSound","wrongSound"];
    ids.forEach(function(id){
        let a = document.getElementById(id);
        if(a){
            a.play();
            a.pause();
            a.currentTime = 0;
        }
    });
}

function playAudio(id){
    let a = document.getElementById(id);
    if(a){
        a.pause();
        a.currentTime = 0;
        a.play().catch(()=>{});
    }
}

function stopAllSounds(){
    ["timerAudio","correctSound","wrongSound"].forEach(function(id){
        let a = document.getElementById(id);
        if(a){
            a.pause();
            a.currentTime = 0;
        }
    });
}

function formatPrice(amount){
    return "₹" + amount.toLocaleString("en-IN");
}

function updatePrice(){
    document.getElementById("price").innerText = formatPrice(priceLadder[currentLevel] || 0);
}

function updateLadder(){
    const lis = document.querySelectorAll("#ladderList li");
    lis.forEach(function(li){
        li.style.background = "transparent";
    });

    const active = lis[lis.length-1-currentLevel];
    if(active){
        active.style.background = "rgba(0,217,255,.3)";
    }
}

function updateLifelines(){
    document.getElementById("fifty").disabled = fiftyUsed;
    document.getElementById("friend").disabled = friendUsed;
}

function stopTimer(){
    clearInterval(timerInterval);
    let t = document.getElementById("timerAudio");
    if(t){
        t.pause();
        t.currentTime = 0;
    }
}

function startTimer(){
    stopTimer();
    stopAllSounds();
    playAudio("timerAudio");

    timeLeft = 30;
    document.getElementById("result").innerText = timeLeft + " s";

    timerInterval = setInterval(function(){
        timeLeft--;
        document.getElementById("result").innerText = timeLeft + " s";

        if(timeLeft<=0){
            stopTimer();
            playAudio("wrongSound");
            gameOver();
        }
    },1000);
}

function disableButtons(){
    document.querySelectorAll(".option-btn").forEach(function(btn){
        btn.disabled = true;
    });
}

function loadQuestion(){

    document.getElementById("lockBtn").style.display = "none";
    selectedAnswer = null;
    selectedButton = null;

    if(currentLevel>=priceLadder.length){
        stopAllSounds();
        document.getElementById("question").innerHTML = "🎉 Congratulations!<br><br>You Won " + formatPrice(priceLadder[priceLadder.length-1]);
        document.getElementById("options").innerHTML = "<button onclick='location.reload()'>Play Again</button>";
        document.getElementById("result").innerText = "";
        document.querySelector(".lifeline-panel").style.display = "none";
        return;
    }

    if(usedIndices.size>=questions.length){
        usedIndices.clear();
    }

    let idx;
    do{
        idx = Math.floor(Math.random()*questions.length);
    }while(usedIndices.has(idx));

    usedIndices.add(idx);
    currentQuestion = questions[idx];

    document.getElementById("question").innerText = currentQuestion.question;

    const optionsDiv = document.getElementById("options");
    optionsDiv.innerHTML = "";

    const letters = ["A","B","C","D"];

    for(let i=0;i<4;i++){
        const btn = document.createElement("button");
        btn.className = "option-btn";
        btn.innerText = letters[i] + ": " + currentQuestion.options[i];

        btn.onclick = function(){
            document.querySelectorAll(".option-btn").forEach(function(b){
                b.style.outline = "none";
            });

            selectedAnswer = currentQuestion.options[i];
            selectedButton = btn;

            btn.style.outline = "3px solid yellow";
            document.getElementById("lockBtn").style.display = "inline-block";
        };

        optionsDiv.appendChild(btn);
    }

    updatePrice();
    updateLadder();
    updateLifelines();
    startTimer();
}

function checkAnswer(selected,correct,clickedBtn){
    disableButtons();
    stopTimer();

    document.querySelectorAll(".option-btn").forEach(function(btn){
        if(btn.innerText.substring(3)===correct){
            btn.classList.add("correct");
        }
    });

    if(selected===correct){
        playAudio("correctSound");
        document.getElementById("result").innerText = "✔ Correct";
        currentLevel++;

        setTimeout(loadQuestion,2000);
    }
    else{
        clickedBtn.classList.add("wrong");
        playAudio("wrongSound");

        setTimeout(gameOver,2000);
    }
}

function gameOver(){
    stopTimer();

    let wonAmount = 0;
    if(currentLevel>=9){ wonAmount=320000; }
    else if(currentLevel>=4){ wonAmount=10000; }

    document.getElementById("question").innerHTML =
    "❌ Wrong Answer! Game Over <br><br> Your Guaranteed Amount Is " + formatPrice(wonAmount);

    document.getElementById("options").innerHTML = "<button onclick='location.reload()'>Restart Game</button>";
    document.getElementById("result").innerText = "";
    document.querySelector(".lifeline-panel").style.display = "none";
    document.getElementById("lockBtn").style.display = "none";
}

function useFiftyFifty(){
    if(fiftyUsed || !currentQuestion) return;

    fiftyUsed = true;
    document.getElementById("fifty").disabled = true;

    let wrongBtns = [];

    document.querySelectorAll(".option-btn").forEach(function(btn){
        let txt = btn.innerText.substring(3);
        if(txt!==currentQuestion.answer){
            wrongBtns.push(btn);
        }
    });

    wrongBtns[0].style.visibility = "hidden";
    wrongBtns[1].style.visibility = "hidden";
}

function callFriend(){
    if(friendUsed || !currentQuestion) return;

    friendUsed = true;
    document.getElementById("friend").disabled = true;

    let msg = "Hello! Please help me in this KBC question: " + currentQuestion.question;
    window.open("https://wa.me/?text="+encodeURIComponent(msg),"_blank");
}