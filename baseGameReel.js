const  {loadJson} = require("./helpers")
const Symbol = require("./baseGameSymbol");

class  BaseGameReel{
    rs= loadJson("baseGameReelSet")


    constructor( ind =-1){
        this.symbols = [];
        this.reelInd = ind;
        this.reelset = [];
        this.numOfSymbols = 3;
        this.generateReel();
        
    }

    generateReel(){
        this.getReelSet();
        this.setSymbols();
        this.updateReel();
    }

    getReelSet(){        
        this.reelset = this.rs.baseReels[this.reelInd]
        console.log(this.reelset)
    }
    setSymbols(){
        for(let i = 0; i < this.numOfSymbols; i++){
            let s = new Symbol(i)
            this.symbols.push(s)
        }
    }

    updateReel(){
        let start = Math.floor(Math.random()*this.reelset.length);
        this.symbols.forEach((s)=>{ 
            s.updateSymbol(this.reelset[(start + s.symbolIndex)%this.reelset.length]);
        });
    }

    getSymbol(symInd){
        return this.symbols[symInd]
    }

    printReel(){
        console.log("Reel",this.reelIndex, "-/)symbols = ", this.symbols)
        this.symbols.forEach((s)=>{
            s.printSym();
        })
    }
    
}



module.exports =  BaseGameReel


