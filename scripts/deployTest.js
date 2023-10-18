const hre = require("hardhat");

const main = async () => {
    const [owner] = await hre.ethers.getSigners();
    const todoContract = await hre.ethers.getContractFactory("TodoContract");
    const contract = await todoContract.deploy();

    await contract.waitForDeployment();
    console.log(`Contract running at ${contract.target}`);

    await contract.connect(owner).addTask("Todo Task 1");
    await contract.connect(owner).addTask("Todo Task 2");

    console.log("Tasks added");
    let tasks = await contract.getMyTodos();
    for (let i = 0; i < tasks.length; i++)
        console.log(`${i + 1} Task is: ${tasks[i].task}, IsCompleted: ${tasks[i].isCompleted}`);

    await contract.completeTask(0);
    tasks = await contract.getMyTodos();
    for (let i = 0; i < tasks.length; i++)
        console.log(`${i + 1} Task is: ${tasks[i].task}, IsCompleted: ${tasks[i].isCompleted}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
})