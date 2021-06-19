//create an artifcat/abstraction to interact with our contract
var Polling = artifacts.require("./Polling.sol");

contract("Polling",function(accounts){

    //TEST1   it is from mocha  - this first test is to check if initialization is good.
    it("TEST1-initializes poll data" , function() {
        return Polling.deployed().then(function(instance) { 
                      return instance.getWinningYear();
  
           }).then(function(yr) {
                      assert.equal(yr,0);  //assert() is from chai
            });
       });


  //TEST2   
    it("TEST2-check vote event and vote counts for optionA and optionB" , function() {
        return Polling.deployed().then(function(instance) { 
                    pollInstance = instance;
                      return pollInstance.vote(2022,{from:accounts[1]});
  
           }).then(function(receipt) {      
         //testing after event triggered
         assert.equal(receipt.logs.length,1, "an event is triggered");
         assert.equal(receipt.logs[0].event,"votedYear", "the vote year is correct");
     
         return pollInstance.votersACount();

       }).then(function(countA) {
       
        assert.equal(countA,1,"one vote counted"); //check if the votecount is 1
        pollInstance.vote(2024,{from:accounts[2]});
        return pollInstance.vote(2024,{from:accounts[3]});
  }).then(function(receipt) {      
    //testing after event triggered
    assert.equal(receipt.logs.length,1, "an event is triggered");
    assert.equal(receipt.logs[0].event,"votedYear", "the vote year event is correct");

    return pollInstance.votersBCount();

  }).then(function(countB) {
       
    assert.equal(countB,2,"one vote counted"); //check if the votecount is 1
    
})
});



  //TEST3 
  it("TEST3-Check stake of first user" , function() {
    return Polling.deployed().then(function(instance) { 
                pollInstance = instance;
                  return pollInstance.getVoterStake({from:accounts[1]});

       }).then(function(stake) {      
     //testing after event triggered
     assert.equal(stake,2,"stake should be 2 tokens");    

})
});


  //TEST4 
  it("TEST4-Check vote end event and if winner is 2022" , function() {
    return Polling.deployed().then(function(instance) { 
                pollInstance = instance;
                  return pollInstance.votingEnds(2022,{from:accounts[0]});

       }).then(function(receipt) {      
     //testing after event triggered
     assert.equal(receipt.logs.length,1, "an event is triggered");
     assert.equal(receipt.logs[0].event,"winnerAnnounced", "the vote ends event is correct");
 
     return pollInstance.getWinningYear();

   }).then(function(yr) {
   
    assert.equal(yr,2022,"winning year"); //check if the winning year is 2022
    

})
});


  //TEST5
  it("TEST5-Check stake of first user after winning announced" , function() {
    return Polling.deployed().then(function(instance) { 
                pollInstance = instance;
                  return pollInstance.getVoterStake({from:accounts[1]});

       }).then(function(stake) {      
     //testing after event triggered
     assert.equal(stake,6,"stake should be 6 tokens");    

})
});


 //TEST6
 it("TEST6-Check stake of second user after winning announced" , function() {
  return Polling.deployed().then(function(instance) { 
              pollInstance = instance;
                return pollInstance.getVoterStake({from:accounts[2]});

     }).then(function(stake) {      
   //testing after event triggered
   assert.equal(stake,0,"stake should be 0 tokens");    

})
});




});
