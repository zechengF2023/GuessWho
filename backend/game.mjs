//game class
class Game{
    constructor(io, creator, roomNumber){
        this.io=io;
        this.roomNumber=roomNumber;
        this.players=[creator]; //an array of player names
        this.scores={}; //a dictionary, keys are names, values are scores
        this.scores[creator]=0;
        this.state="w"; //w--waiting, a--answering, g--guessing, e--ending
        this.questions=[]; //an array of questions
        this.answers=[]; //[{user1: answer, user2: answer}, {...}]
        this.questionNum=0; //the current question receiving answers
    }
    addPlayer(name){
        this.players.push(name);
        this.scores[name]=0;
    }
    removePlayer(name){
        let idxToRemove=this.players.indexOf(name);
        if(idxToRemove!=-1){
            this.players.splice(idxToRemove, 1);
            delete scores[name];
        }
    }
    //TODO: retrieve questions from DB
    getQuestions(){
        this.questions=["How old are you?", "Describe your hometown.", "What is your major?"];
    }
    // start a countdown, send the phase to clients when time is up
    startTimer(time, phase){
        let countDown=time;
        const id=setInterval(()=>{
            this.io.to(this.roomNumber).emit("setTimer", countDown)
            if(countDown==0){
                clearInterval(id);
                this.io.to(this.roomNumber).emit("setPhase", phase)
            }
            countDown--;
        }, 1000)
    }
    startGame(){
        //initialize answer array.
        this.answers.push({});
        //Answering phase: send question, send timer
        this.io.to(this.roomNumber).emit("setQuestion", this.questions[0]);
        this.startTimer(10, "guessing");
        //Guessing phase:
    }

}

export {Game}