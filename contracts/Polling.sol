// SPDX-License-Identifier: MIT
pragma solidity >0.5.0;

contract Polling {
 
 uint private optionA = 2022;
 uint private optionB = 2024;
 
address public pollOwner ;

uint private winningYear;
bool private winningYearDeclared;
 
 //datastructure for voter
 struct Voter{
     address voteAddress;
     uint chosenOption;
     uint stakeValue;
     bool voteAlready;
 } 
 
  event winnerAnnounced(uint indexed _winningYear);
  event votedYear(uint indexed _chosenYear);

 //hash to store all poll options.
 //mapping(uint => pollOption) public pollOptions;
 
 //keeping track of the voters, default bool is false
 mapping(address => bool) public votersA;
 mapping(address => bool) public votersB;
 
 Voter[] private allVoters;

 
 //in solidity there is no way to know the size of the mapping or iterate thru 
 //suppose we have 2 candidates in the mapping and we try to lookup 99, it will return a blank candidate something like null
 //uint public optionsCount
 uint public votersACount;
 uint public votersBCount;
 
 //constructor will run when we deploy our contract to the blockchain
   constructor() public {
       pollOwner = msg.sender;
       winningYear = 0;
       winningYearDeclared = false;
       
        //addOption(2022);
       // addOption(2024);
    }
    
 
    function vote(uint _chosenYear) public {
        

      //  address payable seller_payable_addr = address(uint160(seller));
      //  emit votingProcess(msg.sender);
        
        //check voter is not double voting
        require(votersA[msg.sender] == false &&  votersB[msg.sender]==false,"User trying to double vote");
        
        //poll option selected by user is valid
        require(_chosenYear==optionA || _chosenYear==optionB);
        
        //suppose some of the require FAILED, then the remaining gas will be refunded to the caller
        
        //record the voter, which will come in the metadata when this function is called, msg.sender
        
         Voter memory newVoter;
    newVoter.voteAddress = msg.sender;
    newVoter.chosenOption    = _chosenYear;
    newVoter.stakeValue    = 2;
    newVoter.voteAlready    = true;
    
     allVoters.push(newVoter)-1;
    
     
          
        if(_chosenYear==optionA){
         votersA[msg.sender] = true;
         votersACount++;
        }
        else if(_chosenYear==optionB){
         votersB[msg.sender] = true;
         votersBCount++;
        }
        
        //trigger the event
        emit votedYear(_chosenYear);
        
    }
    
    

    
     function votingEnds(uint _yr)  public  {
         
       require(pollOwner == msg.sender);
        
        winningYear = _yr;
        winningYearDeclared = true;
        
      uint totalWinningStake = 0;
      uint distributionAmount = 0;


      if(optionA == winningYear){
        
         totalWinningStake = getTotalStake(optionB);
         distributionAmount = totalWinningStake / votersACount;
         beginTransferOfWinnings(optionA,distributionAmount);
          
             //trigger the event
        emit winnerAnnounced(optionA);
        
      }
      else if(optionB == winningYear){
          totalWinningStake = getTotalStake(optionA);
           distributionAmount = totalWinningStake / votersBCount;
            beginTransferOfWinnings(optionB,distributionAmount);
            
     //trigger the event
        emit winnerAnnounced(optionB);
      }
      
     
      
     }
        
  
        
        
    function getTotalStake(uint _year) private returns (uint){
            
       if(_year==optionA){
        return (votersACount * 2) ;
        }
        else if(_year==optionB){
         return votersBCount * 2;
        }
            
        }
       
       
function beginTransferOfWinnings(uint _winningYear,uint _amount) private returns (uint) {
            
   
             uint arrayLength = allVoters.length;
            for (uint i=0; i<arrayLength; i++) {
               
 
               
               if(allVoters[i].chosenOption == _winningYear){
                   allVoters[i].stakeValue = allVoters[i].stakeValue + _amount;
               }
               else{
                   allVoters[i].stakeValue = 0;
               }
            }
         
      
        
            
        }
        
    
     function getVoterStake() public view returns(uint){
            
               uint arrayLength = allVoters.length;
            for (uint i=0; i<arrayLength; i++) {
               if(allVoters[i].voteAddress == msg.sender){
                    return  allVoters[i].stakeValue;
               }
            }
        }
        
          function getVoterChosenOption() public view returns(uint){
            
               uint arrayLength = allVoters.length;
            for (uint i=0; i<arrayLength; i++) {
               if(allVoters[i].voteAddress == msg.sender){
                    return  allVoters[i].chosenOption;
               }
            }
        }
        
        
    function getWinningYear() public view returns(uint){
            
             return winningYear;
        }
        
  
    
    
    
}