const GenerateBaseGame = require("./generateBaseGame");
const  {loadJson} = require("./helpers")
const _ = require("lodash")


class StatisticalAnalysis{
    round = 2000000
    gameRun;
    rtpGame;
    rtpBaseGame;
    rtpFreeSpinGame;
    hit = {};
    probOfHittingSym = {};
    hitFrq;
    maxBasePayout = 0;
    variance;
    stdDev;
    volatility;

    constructor(){
      
        this.hitSym = [] ;
        this.sqrOfEach = 0;
        this.avgWinPerSpin = 0; 
        this.roundPayment = 0
        this.netpayment =0;
        this.getSlotGame()
        this.setHits()
        this.statisticalCalculations()
    
    }

    getSlotGame(){
        this.gameRun = new GenerateBaseGame()
    }

    statisticalCalculations(){
        for(let r = 0; r < this.round; r++){
            this.gameRun.generateBaseRound();
            this.getHits();
            this.probabilityOfHitting();
            this.hitFrequency();
            this.calculatePayments();
            this.calculateRtp();
            this.calculateVariance();
            this.calculateStdDev();
            this.calculateVolatility();
          
            if(r%50000 === 0){
                console.log("round",r)
            }
        }
        
    }

    setHits(){
        let r = loadJson("baseReelSymbols");
        this.hitSym = r.Hits
        for (let s of this.hitSym){
            this.hit[s] = 0
        }
    }

    getHits(){ 
    
        for(let payline of this.gameRun.winlines){
            let sym = payline[0];
            let c = payline[1];
            this.hitSym.forEach(hs => {
                if(hs.includes("W")&&(sym==="W")){
                    (c == parseInt(hs.substring(hs.length -1, hs.length)) && sym == hs.substring(0, 1)) ? this.hit[hs] += 1 : this.hit[hs] +=0;
                }
                else{
                    (c == parseInt(hs.substring(hs.length -1, hs.length)) && sym == hs.substring(0, 2)) ? this.hit[hs] += 1 : this.hit[hs] +=0;
                }
                
            })
            this.hit["S X3"]=this.gameRun.threeScatter;

        }
    }
    probabilityOfHitting(){
        for (let [symName, symCount] of Object.entries(this.hit)) {
            this.probOfHittingSym[symName] = symCount/this.round;
          }
    }
    hitFrequency(){
        //shows the probability of hitting a payouted symbol in a spin round of base game.
        let getHitPayoutedSym = {};
        for(let key of Object.keys(this.hit)){
            if(key.includes("L")||key.includes("H")){
                getHitPayoutedSym[key]=this.hit[key];
            }
        }
    
        // let hitValue = Object.values(getHitPayoutedSym);
        // let totHitVal = _.sum(hitValue);
     
        // this.hitFrq = totHitVal/this.round; 
        let hitValue = Object.values(this.hit);
        let totHitVal = _.sum(hitValue);
        this.hitFrq = totHitVal/this.round; 
    }

    calculatePayments(){
        this.roundPayment =  this.gameRun.roundPayment
        this.netpayment += this.roundPayment

    }
    calculateRtp(){
        this.rtpGame = (this.gameRun.netPayment/this.round)*100
        this.rtpBaseGame = (this.gameRun.netBasePayment/this.round)*100
        this.rtpFreeSpinGame = (this.gameRun.netFSPayment/this.round)*100
    }
    calculateVariance(){
        this.avgWinPerSpin = this.gameRun.netPayment/this.round;
        this.sqrOfEach += Math.pow(( this.gameRun.netRoundPay - this.avgWinPerSpin),2)
        this.variance = (this.sqrOfEach)/this.round;

    }

    calculateStdDev(){
        this.stdDev = Math.sqrt(this.variance)
    }

    calculateVolatility(){
        this.volatility = this.stdDev*(1.64)
    }



    print(){ 
        console.log("\n ----STATISTICAL RESULTS---- \n ","Hit :",this.hit, "\n Probability of hitting a symbol that has payout : \n  ",this.probOfHittingSym, "\n Hit frequency : ", this.hitFrq)
        console.log("\n **Variance** :", this.variance, " \n **Std dev** :", this.stdDev , " \n **Volatility** : ", this.volatility, "\n RTP Game:", this.rtpGame, "\n RTP Base Game:", this.rtpBaseGame, "\n RTP Free Spin Game:", this.rtpFreeSpinGame, "\n ------------");
        console.log("\n ----PAYMENTS----  \n","\n Total payment :",this.netpayment, this.gameRun.roundPayment,"scatters 5 and 4", this.gameRun.fiveScatter,this.gameRun.fourScatter)
        console.log("max base payment" , this.gameRun.maxBasePayment , "max fs payment" , this.gameRun.maxFsPayment)

   
    }

}

a = new StatisticalAnalysis()
a.print()
