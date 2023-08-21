const BaseGameMechanism = require("./baseGameMechanics")
const GenerateFreeSpinGame = require("./SlotGameFS/generateFreeSpinGame.js")

class GenerateBaseGame extends BaseGameMechanism{
    freeSpin;
    constructor(){
        super();

        this.netPayment= 0;
        this.netFSPayment = 0;
        this.netBasePayment = 0;

        this.maxFsPayment = 0;
        this.maxBasePayment = 0;


        this.isFreeSpinRun = false;
        this.generateBaseRound()
        this.getFreeSpinGame();
        this.netPayments();
    }

    generateBaseRound(){
        this.updateSpin();
        this.setPaytable();
        this.countScatter();
        this.paylines();
        this.paytable();
        this.roundPayout();
        this.runFreeSpin();
        this.netPayments();
        this.netFreeSpinPayments();
        this.netBasePayments();
        this.maxPayments();
        
    }

    getFreeSpinGame(){
        this.freeSpin = new GenerateFreeSpinGame()
    }

    runFreeSpin(){
        this.isFreeSpinRun = false;
        let freeSpinCount = 0;

        if(this.isThreeScatter){
            freeSpinCount = 10;
        }
        if(freeSpinCount>0){
            this.freeSpin.rounds = freeSpinCount
            this.isFreeSpinRun = true;
            this.freeSpin.generateRounds();
            // console.log("if, ", this.freeSpin.roundsPayment,this.freeSpin.totalPayment)

            this.isThreeScatter = false;
            freeSpinCount = 0;
        }
    }

    netPayments(){
        //TOTAL PAYOUT FOR N ROUNDS.
        this.netRoundPay = this.isFreeSpinRun ? this.netRoundPay = this.roundPayment + this.freeSpin.totalPayment : this.netRoundPay = this.roundPayment ;
        this.netPayment += this.netRoundPay;  
    }

    netFreeSpinPayments(){        
        if(this.isFreeSpinRun)
            {this.netFSPayment += this.freeSpin.totalPayment
            // console.log("cumulative",this.netFSPayment)
        }
    }
    netBasePayments(){
        this.netBasePayment += this.roundPayment;
    }

    maxPayments(){
        this.maxBasePayment = (this.roundPayment >= this.maxBasePayment) ? this.roundPayment : this.maxBasePayment;
        if(this.isFreeSpinRun){
            this.maxFsPayment = (this.freeSpin.totalPayment >= this.maxFsPayment) ? this.freeSpin.totalPayment : this.maxFsPayment;
        }
    }


    
}

module.exports = GenerateBaseGame;

// m = new GenerateBaseGame()
// m.generateBaseRound()

// console.log(m.slot,"++","\n", m.winlines,"++","\n",m.payment,"++","\n",m.roundPayment)





