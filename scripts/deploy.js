const hre = require("hardhat");

async function main() {
  const coffee = await hre.ethers.getContractFactory("TodoContract");
  const contract = await coffee.deploy();

  await contract.waitForDeployment();
  console.log(`Address of contract: ${contract.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});