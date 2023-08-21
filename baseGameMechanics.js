const BaseGameSlot = require("./baseGameSlot");
const  {loadJson} = require("./helpers");


class BaseGameMechanism{
    bet = 1;

    constructor(){
        this.winlines = [];
        this.scatterLines = [];
        this.paymentsym = [];
        this.payment = [];
        this.roundPayment = 0;
        this.slot = [[]];
        
        this.threeScatter = 0; //shows total num of "hitting 3 scatter" symbol. 
        this.isThreeScatter = false ;

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
        this.slot = new BaseGameSlot()
        this.slot.setReels()
    }
    
    updateSpin(){
        this.slot.spin();
    }

    setPaytable(){
        let symJson = loadJson("baseReelSymbols");
        this.paymentsym = symJson.BaseSym;
    }

    paylines(){
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
            
                if(curSymObj.isWild||curSymObj.isLowSym || curSymObj.isMidSym|| curSymObj.isHighSym){
                    if(lastEvSym == ""||(curSymObj.isWild && count == 0)||(sym != "W" && !curSymObj.isWild && curIterSym == lastEvSym)||(sym == "W" && !curSymObj.isWild)){
                    lastEvSym = sym = curIterSym;
                    count++
                    }
                    else if((sym != "W" && curSymObj.isWild)||(sym != "W" && !curSymObj.isWild && (curIterSym != lastEvSym && lastEvSym == "W") && sym == curIterSym)||(sym==curIterSym==lastEvSym=="W")){
                        lastEvSym = "W";
                        count++;
                    }
                    else if (sym == "W" && curSymObj.isWild && curIterSym == lastEvSym && count >= 0) {
                    //wild symbol pays
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

    paytable(){
        this.payment = [];
        let payout = 0;
        // let paytable=[
            // [0,0,0.2,0.4,1.0], //l0
            // [0,0,0.2,0.6,2.0], //l1
            // [0,0,0.4,0.8,3.0], //l2
            // [0,0,0.4,1.0,4.5], //l3
            // [0,0,0.6,1.5,6.0], //m0
            // [0,0,0.6,2.0,8.0], //m1
            // [0,0,0.8,3.0,10.0], //m1
            // [0,0,1.0,5.0,12.0], //m1
            // [0,0,2.0,7.5,20.0], //h0
            // [0,0,3.0,10.0,35.0], //h1
            // [0,0,4.0,12.0,50.0], //h2
            // [0,0,100.0,0,0], //S
            // [0,0,5.0, 25.0, 200.0] //W
            // ];
        let paytable=[
                [0,0,0.6,1.2,3.0], //l0
                [0,0,0.8,1.5,4.5], //l1
                [0,0,0.8,2.0,6.0], //l2
                [0,0,1.0,2.0,8.0], //l3
                [0,0,1.0,3.0,10], //m0
                [0,0,1.5,4.5,13.0], //m1a
                [0,0,2.0,6.0,16.0], //m2
                [0,0,2.5,7.5,20.0], //m3
                [0,0,3.0,12.0,36.0], //h0
                [0,0,4.0,20.0,48.0], //h1
                [0,0,5.0,36.0,64.0], //h2
                [0,0,50.0,0,0], //S
                [0,0,5.0, 36.0, 160.0] //W
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
    roundPayout(){
        // ROUND PAYOUT SHOWS THE TOTAL PAYOUT OF X NUMBER OF WINLINES FOR A ROUND. 
        this.roundPayment = 0;
        for(let pay of this.payment){
            this.roundPayment += (pay[2]);
        }
    }

    countScatter(){
        this.scatterLines = [];
        this.isThreeScatter = false ;


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
            this.isThreeScatter = true ;

            this.threeScatter++  
            this.scatterLines.push(["S",sCount])
            // console.log(this.threeScatter,this.scatterLines)

        }
    }

    applyCascade() {
        let cascadeCount = 0;
        let hasCascaded = false;

        do {
            hasCascaded = false;

            for (let col = 0; col < 5; col++) {
                for (let row = 1; row < 3; row++) {
                    // let curSymObj = this.slot[col][row]; //test
                    let curSymObj = this.slot.getReel(col).getSymbol(row);

                    if (!curSymObj) continue; // Eğer sembol yoksa devam et

                    // let prevSymObj = this.slot[col][row - 1]; //test
                    let prevSymObj = this.slot.getReel(col).getSymbol(row - 1);

                    if (!prevSymObj) { // Eğer üstünde sembol yoksa, aşağıya düşür
                        // this.slot[col][row - 1] = curSymObj; //test
                        // this.slot[col][row] = null; //test
                        this.slot.getReel(col).setSymbol(row - 1, curSymObj);
                        this.slot.getReel(col).setSymbol(row, null);
                        hasCascaded = true;
                    }
                }
            }

            if (hasCascaded) {
                cascadeCount++;
                this.paylines(); // Yeni durumda kazançları kontrol et
                this.paytable(); // Yeni durumda ödemeleri hesapla
                this.roundPayout(); // Yeni durumda toplam ödeme hesapla
            }
        } while (hasCascaded);

        return cascadeCount;
    }

}


module.exports = BaseGameMechanism

