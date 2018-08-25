//https://learn.freecodecamp.org/javascript-algorithms-and-data-structures/javascript-algorithms-and-data-structures-projects/cash-register

const compare = {
  'PENNY': 0.01,
  'NICKEL': 0.05,
  'DIME': 0.1,
  'QUARTER': 0.25,
  'ONE': 1,
  'FIVE': 5,
  'TEN': 10,
  'TWENTY': 20,
  'ONE HUNDRED': 100
};

function checkCashRegister(price, cash, cid) {
   let diff = cash - price;
   let cidCopy = JSON.parse(JSON.stringify( cid ));

   if (diff == 0) {
     let rez = {status: "CLOSED", change: cid};
     console.log(rez);
     return rez;
   } else {
     console.log(diff);
     console.log(cid);

     let availableBanknotes = cid.filter((elem) => elem[1] > 0).map((elem) => {
      if (elem[0] == "PENNY" || elem[0] == "NICKEL" || elem[0] == "DIME" || elem[0] == "QUARTER") {// we have to do this weird hack, because we recieved params as penny - 1.01 (wich means we have 101 penny) or quarter = 4.25 wich means we have 14 quarters etc
        elem[1] = (elem[1] / compare[elem[0]]).toFixed(2);
      }

      elem[0] = compare[elem[0]];
      return elem;
     }).sort((a,b) => a[0] > b[0]);//here we get asc sorted available banknotes in format [X, Y] where X (1,10,20,100 etc) and Y - qunatity of banknotes
     console.log(availableBanknotes);


     let exchangePossible = false;
     let exchangeStory = [];//We have to return within this array info about how we built exchange
     let ourMoney = 0;//we'll count how much money do we have to get final status of the returned object
     for (let i=availableBanknotes.length-1; i>=0; i--) {
      let banknote = availableBanknotes[i][0], qty = availableBanknotes[i][1];
      ourMoney += convertToDollar(banknote, qty);
      let banknotesRequired = Math.trunc(diff / banknote);//Number of current banknotes required
      if (banknotesRequired < 1) {//too big banknote, lets find a smaller one
        console.log("TOO BIG BANKNOTE");
        continue;
      }

      if (qty < banknotesRequired) {//We dont have required amount of this banknote
        console.log("FEW: banknote - " + banknote + "; qty - " + qty);
        diff -= banknote * qty;//take all tour banknotes that we have available
        exchangeStory.push(pushToHistory(banknote, qty));
      } else {//We have enough banknotes of this type, give all required qty
        console.log("ENOUGH: banknote - " + banknote + "; qty - " + banknotesRequired);
        diff -= banknote * banknotesRequired;
        exchangeStory.push(pushToHistory(banknote, banknotesRequired));
      }

      diff = diff.toFixed(2);

      console.log("DIFF AFTER CICLE: " + diff);

      if (diff == 0) {//we can give exchange to a customer!
        exchangePossible = true;
        break;
      }

     }//for

    if (exchangePossible) {
      let rez;
      if (ourMoney == cash - price) {
        rez = {status: "CLOSED", change: cidCopy}//we dont have no more money for future operations, so we are closed now
      } else {
        rez = {status: "OPEN", change: exchangeStory}
      }
      console.log(rez);
      return rez;
    } else {
      let rez = {status: "INSUFFICIENT_FUNDS", change: []};
      console.log(rez);
      return rez;
    }


   }//else
}

function pushToHistory(banknote, qty) {
  for (let prop in compare) {
    if (compare[prop] == banknote) {
      return [prop, convertToDollar(banknote, qty)];
    }
  }
}

function convertToDollar(banknote, qty) {
  banknote = banknote >= 1 ? 1 : banknote;//we dont wont to multiplicate 1,10,20,100 banknotes, just 0.1, 0.25 etc
  return banknote * qty;//for example 0.01 - 50 - it's 0.5$
}

// Example cash-in-drawer array:
// [["PENNY", 1.01],
// ["NICKEL", 2.05],
// ["DIME", 3.1],
// ["QUARTER", 4.25],
// ["ONE", 90],
// ["FIVE", 55],
// ["TEN", 20],
// ["TWENTY", 60],
// ["ONE HUNDRED", 100]]

checkCashRegister(3.26, 100, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]]);