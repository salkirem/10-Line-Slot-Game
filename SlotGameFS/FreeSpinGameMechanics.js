const FreeSpinGameSlot = require("./FreeSpinGameSlot");
const  {loadJson} = require("./helpers");


class FreeSpinGameMechanism{
    bet = 1;

    constructor(){
        this.winlines = [];
        this.scatterLines = [];
        this.paymentsym = [];
        this.payment = [];
        this.roundsPayment = 0;
        this.slot = [[]];

        this.threeScatter = 0; //shows total num of "hitting 3 scatter" symbol. 

        this.getSlot(); 

    }

    getSlot(){
        // this.slot = [
        //     ["W","L0","L2"],
        //     ["W","M2","M2"],
        //     ["W","L0","H1"],
        //     ["M2","M0","L0"],
        //     ["M2","H0","L2"],
        // ]            //test
        this.slot = new FreeSpinGameSlot()
        this.slot.setReels()
    }
    
    updateSpin(){
        this.slot.spin();
    }

    setPaytable(){
        let symJson = loadJson("FreeSpinReelSymbols");
        this.paymentsym = symJson.FreeSpinSym;
    }

    paylines(){

        this.handleStickyWilds()
        let curIterSym = "" ;
        let paylines =  [
         
            [0,0,0,0,0],
            // [1,1,1,1,1], [2,2,2,2,2],
            // [0,1,2,1,0],[2,1,0,1,2],
            // [0,1,0,1,0],[2,1,2,1,2],[0,2,0,2,0],[1,0,1,0,1],[1,2,1,2,1],
            
        ];
        this.winlines = []

        for(let payline of paylines) {

            let count = 0;
            let lastEvSym = "";
            let sym = "";
            for(let [col,row] of payline.entries()){
                let curSymObj = this.slot.getReel(col).getSymbol(row)
                // let curSymObj = this.slot[col][row]//test
                curIterSym = curSymObj.symbolName
            
                if(curSymObj.isStickyWild||curSymObj.isLowSym || curSymObj.isMidSym|| curSymObj.isHighSym){
                    if(lastEvSym == ""||(curSymObj.isStickyWild && count == 0)||(sym != "W" && !curSymObj.isStickyWild && curIterSym == lastEvSym)||(sym == "W" && !curSymObj.isStickyWild)){
                    lastEvSym = sym = curIterSym;
                    count++
                    }
                    else if((sym != "W" && curSymObj.isStickyWild)||(sym != "W" && !curSymObj.isStickyWild && (curIterSym != lastEvSym && lastEvSym == "W") && sym == curIterSym)||(sym==curIterSym==lastEvSym=="W")){
                        lastEvSym = "W";
                        count++;
                    }
                    else if (sym == "W" && curSymObj.isStickyWild && curIterSym == lastEvSym && count > 0) {
                    //StickyWild symbol pays
                        count++;
                    }
                    else {
                        break;
                    }
                }    
            }
            if (count > 2) {           
                this.winlines.push([sym,count,payline]);
            }
        };
     
    }


    handleStickyWilds() {
        // Iterate through the reels and symbols to identify sticky wilds
        for (let col = 0; col < 5; col++) {
            for (let row = 0; row < 3; row++) {
                const symbolObj = this.slot.getReel(col).getSymbol(row);
                
                if (symbolObj.isSticky) {
                    symbolObj.updateSymbol(symbolObj);
                    console.log("Sticky Wild occured")
                }
            }
        }
    }
    

    paytable(){
        this.payment = [];
        let payout = 0;
        
        let paytable=[
            [0,0,0.6,1.2,3.0], //l0
            [0,0,0.8,1.5,4.5], //l1
            [0,0,0.8,2.0,6.0], //l2
            [0,0,1.0,2.0,8.0], //l3
            [0,0,1.0,3.0,10], //m0
            [0,0,1.5,4.5,13.0], //m1
            [0,0,2.0,6.0,16.0], //m2
            [0,0,2.5,7.5,20.0], //m3
            [0,0,3.0,12.0,36.0], //h0
            [0,0,4.0,20.0,48.0], //h1
            [0,0,5.0,36.0,64.0], //h2
            [0,0,50.0,0,0], //S
            [0,0,25.0, 100.0, 400.0] //W
        ];
    
        for(let payline of this.winlines){
            let s = payline[0];
            let cs = payline[1];
            let ind = this.paymentsym.indexOf(s);
            payout = paytable[ind][cs-1];            
            this.payment.push([s,cs,payout]);
        }
        for(let payline of this.scatterLines){
            let s = payline[0];
            let cs = payline[1];
            let ind = this.paymentsym.indexOf(s);
            payout = paytable[ind][cs-1];            
            this.payment.push([s,cs,payout]);
        }
    }
    roundsPayout(){
        // rounds PAYOUT SHOWS THE TOTAL PAYOUT OF X NUMBER OF WINLINES FOR A rounds. 
        this.roundsPayment = 0;
        for(let pay of this.payment){
            this.roundsPayment += pay[2];
        }
        // console.log("fs rounds   ",this.roundsPayment)
    }
 


    countScatter(){
        this.scatterLines = [];
        let sCount = 0;
        for( let i = 0; i<5; i++){
            for(let j = 0; j<3; j++){
                // let sym = this.slot[i][j] //test
                let sym = this.slot.getReel(i).getSymbol(j)
                if(sym.isScatter){
                    sCount++
                }
            }
        }
        if(sCount===3){
            this.threeScatter++  
            this.scatterLines.push(["S",sCount])

        }

    }
}


module.exports = FreeSpinGameMechanism

