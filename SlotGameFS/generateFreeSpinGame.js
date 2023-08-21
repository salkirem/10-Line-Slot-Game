const FreeSpinGameMechanism = require("./FreeSpinGameMechanics")

class GenerateFreeSpinGame extends FreeSpinGameMechanism{
    constructor(){
        super();
        this.rounds = 10;
        this.totalSessionFreeSpinRound = 0;

        this.totalPayment= 0;
        this.generateRounds()
        this.curMultiplierCount = 1;
        // this.totalPayout();
    }

    generateRounds(){
        this.totalPayment = 0;
        this.totalSessionFreeSpinRound = 0;
        this.updateSpin(); //I suppose there is no need to add one.  
        while(this.rounds > 0){
            if(this.totalSessionFreeSpinRound >= 20){
                this.rounds=0;
                console.log("fs counter :" , this.totalSessionFreeSpinRound)
                continue;
            }
            this.updateSpin();
            this.setPaytable();
            this.countScatter();
            this.paylines();
            this.paytable();
            this.roundsPayout();
            this.updatePlayedCount();
            this.totalPayout();
            this.retriggeredOccurs();    
        }
        // console.log("while , " , this.totalPayment)
        // console.log("in",this.totalSessionFreeSpinRound)

    }

    updatePlayedCount(){

        this.rounds--;
        this.totalSessionFreeSpinRound++;

    }

    
    retriggeredOccurs(){
        let retrigUpperLimit = 0;
        let additionalSpins = 0;

        if(this.threeScatter ===1){
            additionalSpins = 10;
        }
        if (additionalSpins > 0) {
            this.rounds += additionalSpins;
            this.threeScatter = 0;
            retrigUpperLimit++;
            // console.log(`Free Spin Game is retriggered with ${additionalSpins} additional spins.`);
        
        }
    }
    totalPayout(){
        //TOTAL PAYOUT FOR N rounds.
        if (this.roundsPayment > 0) {
            this.curMultiplierCount+=1;
            // console.log(this.curMultiplierCount,"mult count")
        } 
        else {
            this.curMultiplierCount = 1;
        }

        if (this.curMultiplierCount>= 10) {
            this.curMultiplierCount = 10;
        }
        this.totalPayment += (this.roundsPayment*this.curMultiplierCount)   
        // console.log( "rounds count down",this.rounds,"rounds payment", this.roundsPayment,"tot",this.totalPayment ,"multCount",this.curMultiplierCount)
    }

}

module.exports = GenerateFreeSpinGame;

// m = new GenerateFreeSpinGame()
// m.generateR.ounds()

// console.log(m.slot,"++","\n", m.winlines,"++","\n",m.payment,"++","\n",m.roundsPayment)





