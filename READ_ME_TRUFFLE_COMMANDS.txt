These commands to run in truffle console.

>>Polling.deployed().then(function(instance) { app = instance})
>>app.votersACount()
>>app.votersBCount()

>>web3.eth.getAccounts()

>>app.vote(2022,{from:accounts[1]})
>>app.vote(2022,{from:accounts[2]})
>>app.vote(2024,{from:accounts[3]})
>>app.vote(2024,{from:accounts[4]})
>>app.vote(2024,{from:accounts[5]})

>>app.votersACount()
>>app.votersBCount()

>>app.votingEnds(2022,{from:accounts[0]})

>>app.getWinningYear.call().then(function(r){n=r.toString(10);console.log(n)})

>>app.getVoterStake.call({from:accounts[1]}).then(function(r){n=r.toString(10);console.log(n)})
>>app.getVoterStake.call({from:accounts[5]}).then(function(r){n=r.toString(10);console.log(n)})
