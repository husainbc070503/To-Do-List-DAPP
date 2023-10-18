// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract TodoContract {
    struct TodoItem {
        string task;
        bool isCompleted;
        bool isDeleted;
    }

    mapping(uint256 => TodoItem) public list;
    uint256 public count = 0;
    address public owner;
    event TaskCompleted(uint256 indexed id);
    event TaskDeleted(uint256 indexed id);

    constructor() {
        owner = msg.sender;
    }

    function addTask(string calldata task) public onlyOwner {
        TodoItem memory item = TodoItem({
            task: task,
            isCompleted: false,
            isDeleted: false
        });
        list[count] = item;
        count++;
    }

    function completeTask(uint256 id) public onlyOwner {
        if (!list[id].isCompleted) {
            list[id].isCompleted = true;
            emit TaskCompleted(id);
        }
    }

    function deleteTask(uint256 id) public onlyOwner {
        if (!list[id].isDeleted) {
            list[id].isDeleted = true;
            emit TaskDeleted(id);
        }
    }

    function getMyTodos() public view returns (TodoItem[] memory) {
        TodoItem[] memory temp = new TodoItem[](count);
        for (uint256 i = 0; i < count; i++) temp[i] = list[i];
        return temp;
    }

    modifier onlyOwner() {
        require(owner == msg.sender, "Only owner can call this");
        _;
    }
}
