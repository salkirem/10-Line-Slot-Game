const BaseGameReel = require("./baseGameReel")

class BaseGameSlot{

    constructor(){
        this.reels = [[]];
        this.setReels();
        this.getReel();
        this.spin();
        this.numOfReels = 5;
    }

    setReels(){
        this.reels = [];
        for(let i = 0; i < this.numOfReels ; i ++){
            let r = new BaseGameReel(i) 
            this.reels.push(r);
        }
    }

    getReel(reelInd){
        return this.reels[reelInd];
    }

    spin(){
        this.reels.forEach((r)=> {
            r.updateReel();
        })
    }

    printSlot(){
        console.log("--Slot-- reels = \n", this.reels);
    }
}

module.exports = BaseGameSlot


