App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    return App.initWeb3();
  },

  //this function is from video but outdated, so change name to initWeb4 and not using it
  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      
     //added this line of code as need to seek permission to get and display address of accounts
      //however browser error - this method is deprecated and might be remove, Please use the 'eth_requestAccounts' RPC method instead
     ethereum.enable(); 

      // If a web3 instance is already provided by Meta Mask.
      //However browser error - You are accessing the MetaMask window.web3.currentProvider shim. This property is deprecated; use window.ethereum instead. For details, see:
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);

    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },


  initWeb4: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
    
      const ethEnabled = () => {
        if(window.ethereum){
          window.web3 = new Web3(window.ethereum);
          window.ethereum.enable();
          return true;
        }
     
      return false;
    }
    if(!ethEnabled()){
      alert("please install an etherum comatible brower or exten metamask");
    }
    web3 = window.web3;
    App.web3Provider = web3.currentProvider;
  } else {
          //specify default instance if no web3 instance is provided
          App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
          web3 = new Web3(App.web3Provider);
  }
  return App.initContract();
  },

   




  //loads the contract into the front end so it can interact with it
  initContract: function() {

    //this json file comes from the browser sync package (bs) , check bs-config.json which reads it from build/contracts
    $.getJSON("Polling.json", function(polling) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Polling = TruffleContract(polling);
      // Connect provider to interact with contract
      App.contracts.Polling.setProvider(App.web3Provider);

      //start listening to events
     App.listenForEvents();

     // return App.render();
     return App.render1();
    });
  },

//function to listen for events
listenForEvents: function(){
  App.contracts.Polling.deployed().then(function(instance) {
    pollInstance = instance; //variable declared in this method

    //the {} is meant for solidity which allows to pass a filter to our events which we are not using here, 
    //next {} is metadata 0 to latest means we are listening to all events that can be triggered anywhere in the blockchain

    pollInstance.winnerAnnounced({},{    
      fromBlock:0,
     // fromBlock:'latest',
      toBlock: 'latest'
    }).watch(function(error,event){
       console.log("event triggered",event)
       App.render1();
    });
    });

},



  render: function() {
    var pollingInstance;
    var loader = $("#loader");
    var content = $("#content");   //asynchronous operations, so show and hide in the following lines

    loader.show();
    content.hide();
  //  $("#ownerOnly").hide();
   
    // Load account data
   /* web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#acctAddress").html("Your Account: " + account);  //see html for id
      }
    }); */

   web3.eth.getAccounts(function(error, accounts){
      if (error === null) {
        App.account = accounts;
      $("#acctAddress").html("Your Account: " + accounts[0]);
      }
}); 

    // Load contract data
    App.contracts.Polling.deployed().then(function(instance) {
      pollingInstance = instance; //variable declared in this method
      console.log(App.account[0]);
      return pollingInstance.votersACount();
    }).then(function(aCount) {
     
   
    }).catch(function(error) {
      console.warn(error);
    });
  },


  render1: function() {
    var pollingInstance;
    var loader = $("#loader");
    var content = $("#content");   //asynchronous operations, so show and hide in the following lines

    loader.show();
    content.hide();



   web3.eth.getAccounts(function(error, accounts){
      if (error === null) {
        App.account = accounts;
      $("#acctAddress").html("Your Account: " + accounts[0]);
      }
}); 

    // Load contract data
    App.contracts.Polling.deployed().then(function(instance) {
      pollingInstance = instance; //variable declared in this method
    
      return pollingInstance.getWinningYear.call({from:App.account[0]});

    }).then(function(winningYear) {
    
      var r = winningYear.toString(10);
      if(r == 0){
         // change <p> and <h1>
          $("#winningYr").html("Winner Year: not yet announced");
          $("#announcement").html("Polling Result - Results not announced yet");

      }
      else{
           // change <h1>
      $("#announcement").html("Polling Result - Results announced !!!");

      // change <p>
        $("#winningYr").html("Winner Year : " +r);
      }

      return pollingInstance.getVoterStake.call({from:App.account[0]});
    
    }).then(function(stakeCount) {
      var s = stakeCount.toString(10);
         // change <p>
         $("#payout").html("Your stake : " +s );
         return pollingInstance.getVoterChosenOption.call({from:App.account[0]});
   
    }).then(function(chosenOption) {
      var c = chosenOption.toString(10);
         // change <p>
         $("#chosenYr").html("Your choice of year: " +c);
       
   
    }).catch(function(error) {
      console.warn(error);
    });
  },


    castVote: function(){
      var chosenYear = $('#choice').val();      
      console.log("hello -  "+chosenYear);
      App.contracts.Polling.deployed().then(function(instance) {
       pollInstance = instance; //variable declared in this method
        console.log("addr -  "+App.account);

     return pollInstance.vote(chosenYear,{from:App.account[0]});   //changed this from original code ..added [0], but previous line no need, a bit confused here
    // return electionInstance.vote(candidateId);
      }).then(function(result){
        
        //wait for votes to update
        $("#content").hide();
        $("#loader").show();
      }).catch(function(err){
        console.error(err);
      })

    },





};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
