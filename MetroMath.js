//Copyright © 2015 Boris Avrumov
FARE=2.75;	BONUS=1.11;

function Metrocard(p)		//Metrocard Object
{
	this.currentValue=Number(p);	//Decimal value of money on card
	this.currentRides=function() {
		return Math.floor(this.currentValue/FARE);  //Total rides on card
	}
	this.roundTrips=function() {
		return Math.floor(this.currentValue/(FARE*2));	//Total round trips (2 rides)
	}
	this.remainder=function() {
		return (this.currentValue-(this.currentRides()*FARE)).toFixed(2);
	}
	this.calcRemainder=function(cardValue, cardRides) {
		return (cardValue-(cardRides*FARE)).toFixed(2);
	}
	this.addedVal=0;
	this.add=function(val) {	//Adds specified money to metrocard
		var val=parseFloat(val);
		if (val<5.5)
			this.addedVal=val;
		else
			this.addedVal=parseFloat((val*BONUS).toFixed(2));
		this.currentValue=parseFloat((this.currentValue+this.addedVal).toFixed(2));
		return this.addedVal;	 //Calculates bonus, returns how much was added
	}
	this.howMuchToAdd=function(goal){	//target balance on card
		var goal=parseFloat(goal);
		neededValue=goal-this.currentValue;
		if (neededValue<2*FARE*BONUS)	//6.105 ~ $6.11	
			return nickleUpOrDown(neededValue);
		val=neededValue/1.11;
		return nickleUpOrDown(val);
	}
	this.undo=function() {
		this.currentValue-=this.addedVal;
		this.addedVal=0;
		return this.currentValue;
	}
	this.calcRides=function(desiredRides) {		//calculates how much money to add to achieve certain # of rudes
		target=desiredRides*FARE;
		return this.howMuchToAdd(target);
	}
	this.getRideTable=function(length){		//creates a table of values that give an even ride number
		var table = [[],[],[]];
		if (!length) {
			table[0].push(0.00);
			table[1].push(this.currentRides());
			table[2].push(this.remainder());
		}
		else
			for (i=this.currentRides()+1;i<this.currentRides()+1+length; i++)
			{
				table[0].push(this.calcRides(i));
				this.add(table[0][i-this.currentRides()-1]);
				table[1].push(i);
				table[2].push(this.remainder());
				this.undo();
			}
		return table;
	}
}

function roundToNickel(n)	{
	return parseFloat(((n*20).toFixed(0)/20).toFixed(2));
}

function nickleUpOrDown(n)	{
	roundedVal=roundToNickel(n);
	if (parseFloat(n.toFixed(3))-0.004>roundedVal)
				return (roundedVal+0.05).toFixed(2);
	return roundedVal.toFixed(2);
}