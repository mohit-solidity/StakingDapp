let provider;
let signer;
let contract;
let contractAddress;
let abi;
async function connect(){
  if(window.ethereum){
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts",[]);
    signer = provider.getSigner();
    let address = await signer.getAddress();
    contractAddress = "0xcAA2B906A0bDcE40b7f7B3928f7E4c7B432FB4f2";
    abi = [
      "function stake() payable",
      "function myStake() view returns(uint256)",
      "function calculateMyReward() view returns(uint256)",
      "function unstake()"
    ];
    contract = new ethers.Contract(contractAddress,abi,signer);
    console.log(`Wallet Connected To : ${address}`)
    alert("Wallet Connected To : "+address);
    poolbalance();
  }else{
    alert("Please Install Metamask");
  }
}
function parseRevertMessage(error) {
    if (error?.error?.message) return error.error.message;
    if (error?.data?.message) return error.data.message;
    if (error?.message) return error.message;
    return "Transaction failed.";
}
async function unstake(){
  if(!contract){
    alert("Please Connect Wallet First");
    return;
  }
  await contract.callStatic.unstake();
  try{
    let tx = await contract.unstake();
    await tx.wait();
  alert("Unstaking Successful");
  }catch(err){
    let errmsg = parseRevertMessage(err.message);
    alert(`Error Unstakig : ${errmsg}`);
  }
}
async function stake(){
  let amount;
  let stakedBalance;
  let ParsedBalance;
  let valueEth;
  let balanceUser;
  let tx;
  if(!contract){
    alert("Please Connect Wallet First");
    return;
  }
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
  poolbalance();
  }catch(err){
    alert("Error In Staking : "+(err.reason||err.message));
  }
}
async function myStake(){
  if(!contract){
    alert("Please Connect Wallet First");
    return;
  }
  let stakedBalance = await contract.myStake();
  if(stakedBalance.lte(0)){
    alert("You Have Not Staked");
    return;
  }
  alert(`Your Staked Balance : ${ethers.utils.formatEther(stakedBalance)}ETH`);
}
async function poolbalance(){
  let balance = await provider.getBalance(contractAddress);
  document.getElementById("balance").textContent = `Pool Balance : ${ethers.utils.formatEther(balance)}ETH`;
}
async function calculateReward(){
  if(!contract){
    alert("Please Connect Wallet First");
    return;
  }
  let stakedBalance = await contract.myStake();
  if(stakedBalance.lte(0)){
    alert("You Have Not Staked");
    return;
  }
  let reward = await contract.calculateMyReward();
  alert(`Your Staked Balance : ${ethers.utils.formatEther(stakedBalance)}ETH\nYour Reward : ${ethers.utils.formatEther(reward)}ETH`)
}
