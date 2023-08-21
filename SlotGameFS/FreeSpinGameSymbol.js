class Symbol{
    constructor( ind = -1){
        this.symbolName = "";
        this.symbolIndex = ind;
        this.isLowSym = false;
        this.isLowestSym = false;
        this.isMidSym = false;
        this.isHighSym = false;
        this.isHighestSym = false;
        this.isStickyWild = false; //if there are StickyWild symbols on the reel set, it turns true. In this case, it always false.  
        this.isScatter = false;

    }

    updateSymbol(symName = ""){
        this.symbolName = symName;
        this.isLowSym = this.symbolName.includes("L") ?  true : false
        this.isLowestSym = this.isLowSym && this.symbolName.includes("0") ? true : false;
        this.isMidSym = this.symbolName.includes("M") ?  true : false;
        this.isHighSym = this.symbolName.includes("H") ?  true : false;
        this.isHighestSym = this.isHighSym && this.symbolName.includes("2") ? true : false;
        this.isStickyWild = this.symbolName.includes("W") ?  true : false;
        this.isScatter = (this.symbolName == "S") ?  true : false;
       
    }
        
    printSym(){
        console.log("Symbol",this.symbolIndex, "-)SymName = ", this.symbolName)
    }
    

}



module.exports = Symbol



