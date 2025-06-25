let provider;
let signer;
let contract;
let contractAddress;
let abi;
let userAddress;
async function connect(){
  if(window.ethereum){
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts",[]);
    signer = provider.getSigner();
    userAddress = await signer.getAddress();
    contractAddress = "0x468A022767926F84288283b15584d115baF8B060";
    abi = [
      "function stake() payable",
      "function myStake() view returns(uint256)",
      "function calculateMyReward() view returns(uint256)",
      "function unstake()",
      "function totalStakes() view returns(uint256)",
      "function APY() view returns(uint256)",
      "function balance(address) view returns(uint256)",
      "function startTime(address) view returns(uint256)",
      "function allWithdraw()",
      "function getBalance() view returns(uint256)"
    ];
    contract = new ethers.Contract(contractAddress,abi,signer);
    console.log(`Wallet Connected To : ${userAddress}`)
    alert("Wallet Connected To : "+userAddress);
    await poolbalance();
  }else{
    alert("Please Install Metamask");
  }
}
async function checkWalletIsConnected(){
  if(!contract){
    throw new Error("Please Connect Wallet First");
    return;
  }
}
async function unstake(){
  try{
    await checkWalletIsConnected();
    let poolbalance = await contract.getBalance();
    userAddress = await signer.getAddress();
    let userBalance = await contract.balance(userAddress);
    if(poolbalance.lt(userBalance)){
      alert("Pool Balance Is Not Enough To Unstake");
      return;
    }
    try{
      let tx = await contract.unstake();
      await tx.wait();
    alert("Unstaking Successful");
      poolbalance();
    }catch(err){
      alert(`Error Unstaking : ${err.message}`);
    }
  }catch(err){
    alert(`Error : ${err.message}`);
  }
}
async function stake(){
  try{
    let amount;
    let stakedBalance;
    let valueEth;
    let balanceUser;
    let tx;
    await checkWalletIsConnected();
    amount = document.getElementById("amount").value;
    if(!amount||isNaN(amount)||amount<0){
      alert("Please Enter Valid Amount");
      return;
    }
    console.log(`amount Entered : ${amount}`);
    stakedBalance = await contract.myStake();
    if(stakedBalance.gt(0)){
      alert(`Already Staked\nYour Staked Balance : ${ethers.utils.formatEther(stakedBalance)}ETH`);
      return;
    }
    try{
      valueEth = ethers.utils.parseEther(amount);
      console.log(`Ethers Parsed : ${valueEth}`);
      balanceUser = await signer.getBalance();
      console.log(`Use Balance : ${balanceUser}`);
    }catch(err){
      console.log(`Error getting values : ${err.message||err.reason}`);
    }
    if(balanceUser.lt(valueEth)){
      alert(`Not Enough Balance\nYour Balance : ${ethers.utils.formatEther(balanceUser)}ETH`);
      return;
    }
    try{
    tx = await contract.stake({value : valueEth});
    await tx.wait();
    alert("Staking Successful");
    console.log("Staking Successful");
    await poolbalance();
    }catch(err){
      alert("Error In Staking : "+(err.reason||err.message));
    }
  }catch(err){
    alert(`Error : ${err.message}`);
  }
}
async function myStake(){
  try{
    await checkWalletIsConnected();
    let stakedBalance = await contract.balance(userAddress);
    if(stakedBalance.lte(0)){
      alert("You Have Not Staked");
      return;
    }
    userAddress = await  signer.getAddress();
    const time = await contract.startTime(userAddress);
    const date = new Date(time*1000);
    alert(`Your Staked Balance : ${ethers.utils.formatEther(stakedBalance)}ETH\nStarted on : ${date.toString()}`);
  }catch(err){
    alert(`Error : ${err.message}`);
  }
}
async function poolbalance(){
  try{   
    let balance = await provider.getBalance(contractAddress);
    let stakes = await contract.totalStakes();
    userAddress = await signer.getAddress();
    document.getElementById("top-right").style.display = "block";
    document.getElementById("userAddress").textContent = `User Address : ${userAddress}`;
    document.getElementById("totalstakes").textContent = `Total User Stakes : ${stakes.toString()}`;
    document.getElementById("balance").textContent = `Pool Balance : ${ethers.utils.formatEther(balance)}ETH`;
  }catch(err){
    console.log("Error Displaying : ",err.message);
  }
}
async function calculateReward(){
  try{
    await checkWalletIsConnected();
    let stakedBalance = await contract.myStake();
    if(stakedBalance.lte(0)){
      alert("You Have Not Staked");
      return;
    }
    let reward = await contract.calculateMyReward();
    const staked = parseFloat(ethers.utils.formatEther(stakedBalance));
    let earnedReward = parseFloat(ethers.utils.formatEther(reward));
    let total = staked+earnedReward;
    alert(`Your Staked Balance : ${staked}ETH\nYour Reward : ${ethers.utils.formatEther(reward)}ETH\nTotal Balance : ${total}ETH`)
  }catch(err){
    alert(`Error : ${err.message}`);
  }
}
async function checkAPY(){
  try{
    await checkWalletIsConnected();
    let Apy = await contract.APY();
    alert(`Current APY : ${Apy}%`);
  }catch(err){
    alert(`Error : ${err.message}`);
  }
}
