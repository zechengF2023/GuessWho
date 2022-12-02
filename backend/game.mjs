import {Mutex, Semaphore, withTimeout} from 'async-mutex';

//game class
class Game{
    constructor(io, creator, roomNumber){
        this.answersMutex=new Mutex();
        this.guessesMutex=new Mutex();
        this.io=io;
        this.roomNumber=roomNumber;
        this.players=[creator]; //an array of player names
        this.scores={}; //a dictionary, keys are names, values are scores
        this.scores[creator]=0;
        this.questions=[]; //an array of questions
        this.answers=[]; //[{user1: answer, user2: answer}, {...}]
        this.correctWriters=[]; //an array of usernames
        this.userAnswersToGuess=[]; //an array of answers picked as questions
        this.guesses=[]; //[{user1: guess, user2: guess}, {...}]
        this.questionCount=0; //the current question receiving answers
    }
    addPlayer(name){
        this.players.push(name);
        this.scores[name]=0;
    }
    removePlayer(name){
        let idxToRemove=this.players.indexOf(name);
        if(idxToRemove!=-1){
            this.players.splice(idxToRemove, 1);
            delete this.scores[name];
        }
    }
    //TODO: retrieve n questions from DB
    getQuestions(n){
        this.questions=["How old are you?", "Describe your hometown.", "What is your major?"];
    }
    broadcast(socket, event, data){
        socket.broadcast.to(this.roomNumber).emit(event, data);
        socket.emit(event, data);
    }
    // start a countdown
    async startTimer(time,socket){
        return new Promise((resolve)=>{
            let countDown=time;
            const id=setInterval(()=>{
                this.broadcast(socket, "setTimer", countDown);
                // this.io.to(this.roomNumber).emit("setTimer", countDown)
                if(countDown==0){
                    clearInterval(id);
                    resolve();
                    // this.io.to(this.roomNumber).emit("setPhase", phase)
                }
                countDown--;
            }, 1000)
        })
    }
    async wait_for_answer(r){
        return new Promise(resolve=>{
            const id=setInterval(()=>{
                //if room no longer exists
                if(!this.io.sockets.adapter.rooms.get(this.roomNumber)){
                    resolve();
                    clearInterval(id);
                }
                else if(Object.getOwnPropertyNames(this.answers[r]).length>=this.io.sockets.adapter.rooms.get(this.roomNumber).size){
                    resolve();
                    clearInterval(id);
                }
            }, 500);
        })
    }
    async wait_for_guess(r){
        return new Promise(resolve=>{
            const id=setInterval(()=>{
                //if room no longer exists
                if(!this.io.sockets.adapter.rooms.get(this.roomNumber)){
                    resolve();
                    clearInterval(id);
                }
                else if(Object.getOwnPropertyNames(this.guesses[r]).length>=this.io.sockets.adapter.rooms.get(this.roomNumber).size){
                    resolve();
                    clearInterval(id);
                }
            }, 500);
        })
    }
    //start a game 
    async startGame(round, socket){
        //get questions
        await this.getQuestions(round);
        for(let r=0;r<round;r++){
            this.answers.push({});
            this.guesses.push({});
        }
        for(let r=0;r<round;r++){
            //----------------------Answering phase: send question, send timer----------------------
            this.broadcast(socket, "setQuestion", this.questions[r]);
            await this.startTimer(3, socket);
            //TODO: wait until all players' answers are recorded
            await this.wait_for_answer(r);
            //pick one answer
            await this.answersMutex.acquire();
            const idx=Math.floor(Math.random()*Object.getOwnPropertyNames(this.answers[r]).length);
            console.log("answers this round:",this.answers[r]);
            const writer=Object.getOwnPropertyNames(this.answers[r])[idx];
            const answerToGuess=this.answers[r][writer];
            console.log("answerToGuess:", answerToGuess);
            this.answersMutex.release();
            this.userAnswersToGuess.push(answerToGuess);
            this.correctWriters.push(writer);
            //----------------------Guessing phase----------------------
            this.broadcast(socket, "setPhase", "guessing");
            this.broadcast(socket, "setAnswerToGuess", answerToGuess);
            await this.startTimer(3, socket);
            await this.wait_for_guess(r);
            //score answers
            await this.guessesMutex.acquire();
            const guessThisRound=this.guesses[r];
            console.log("Guess this round:", guessThisRound);
            const newScore=this.players.reduce((obj, p)=>{
                if(guessThisRound[p]===this.correctWriters[r]){
                    obj[p]=this.scores[p]+1;
                }
                else{obj[p]=this.scores[p];}
                return obj;
            },{})
            this.guessesMutex.release();
            this.scores=newScore;
            console.log("new scores:", this.scores);
            this.broadcast(socket, "setScores", this.scores);
            if(r!=round-1){
                this.questionCount++;
                this.broadcast(socket, "setPhase", "answering");
            }
            else{
                this.broadcast(socket, "gameEnds");
            }
        }
    }
}

export {Game}

//reference: https://stackoverflow.com/questions/4550505/getting-a-random-value-from-a-javascript-array