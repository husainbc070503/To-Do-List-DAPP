import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Grid,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import { blue, orange } from "@mui/material/colors";
import abi from "./TodoContract.json";
import { ethers } from "ethers";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import DeleteIcon from "@mui/icons-material/Delete";
import styled from "@emotion/styled";

function App() {
  const theme = createTheme({
    palette: {
      primary: orange,
      secondary: blue,
    },

    typography: {
      fontFamily: "Ubuntu",
    },
  });

  const [acc, setAcc] = useState("");
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState([]);

  const addMyTask = async () => {
    const contractAddress = "0xAC0eefCeCcE57C84b966E25cc29F6A1CB6a46c5D";
    const contractAbi = abi.abi;

    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          contractAddress,
          contractAbi,
          signer
        );

        const newTask = await contract.addTask(input);
        await newTask.wait();
        alert("Task added!!");
        setInput("");
      } else {
        alert("Please install metamask");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const completeMyTask = async (taskId) => {
    console.log(taskId);
    const contractAddress = "0xAC0eefCeCcE57C84b966E25cc29F6A1CB6a46c5D";
    const contractAbi = abi.abi;

    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          contractAddress,
          contractAbi,
          signer
        );

        const editTask = await contract.completeTask(taskId);
        await editTask.wait();
        alert("Task Completed");
      } else {
        alert("Please install metamask");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteMyTask = async (taskId) => {
    const contractAddress = "0xAC0eefCeCcE57C84b966E25cc29F6A1CB6a46c5D";
    const contractAbi = abi.abi;

    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          contractAddress,
          contractAbi,
          signer
        );

        const editTask = await contract.deleteTask(taskId);
        await editTask.wait();
        alert("Task Deleted");
      } else {
        alert("Please install metamask");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const contractAddress = "0xAC0eefCeCcE57C84b966E25cc29F6A1CB6a46c5D";
    const contractAbi = abi.abi;

    const connectWallet = async () => {
      try {
        const { ethereum } = window;
        if (ethereum) {
          const accounts = await ethereum.request({
            method: "eth_requestAccounts",
          });
          setAcc(accounts[0]);

          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(
            contractAddress,
            contractAbi,
            signer
          );
          console.log(contract);
        } else {
          alert("Please install metamask");
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchTasks = async () => {
      try {
        const { ethereum } = window;
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(
            contractAddress,
            contractAbi,
            signer
          );

          const allTasks = await contract.getMyTodos();
          console.log(allTasks);
          setTasks(allTasks.filter((task) => !task.isDeleted));
        } else {
          alert("Please install metamask");
        }
      } catch (error) {
        console.log(error);
      }
    };

    connectWallet();
    fetchTasks();
  }, [acc, tasks]);

  return (
    <ThemeProvider theme={theme}>
      <Container fixed className="mt-4">
        <Typography className="text-center fs-1 text fw-bold" sx={{color: '#FF9B50'}}>
          Decentralized To-Do Application
        </Typography>
        <Button variant="contained" color="secondary" className="Button btn">
          {acc
            ? `Connected to ${acc.slice(0, 5)}...${acc.slice(38)}`
            : "Connect Wallet"}
        </Button>
        <Grid container spacing={2} mt={4} alignItems="center">
          <Grid item md={10} xs={12}>
            <TextField
              type="text"
              placeholder="Enter your todo..."
              fullWidth
              focused
              value={input}
              onChange={(e) => setInput(e.target.value)}
              sx={{ input: { color: "#FFF" } }}
            />
          </Grid>
          <Grid item md={2} xs={12}>
            <Button
              type="button"
              color="primary"
              variant="contained"
              fullWidth
              onClick={addMyTask}
            >
              ADD
            </Button>
          </Grid>
        </Grid>

        {tasks.length > 0 ? (
          <TableContainer className="mt-4">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className="fs-4 text-center text-info fw-bold">
                    Sr. No.
                  </TableCell>
                  <TableCell className="fs-4 text-center text-info fw-bold">
                    Task
                  </TableCell>
                  <TableCell className="fs-4 text-center text-info fw-bold">
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task, ind) => {
                  return (
                    <TableRow key={ind}>
                      <TableCell className="text-center text-light fs-5">
                        {ind + 1}
                      </TableCell>
                      <TableCell
                        className="text-center fs-5"
                        sx={{
                          textDecoration: task.isCompleted && "line-through",
                          color: task.isCompleted ? "#4B527E" : "#fff",
                        }}
                      >
                        {task.task}
                      </TableCell>
                      <TableCell className="text-center fs-5">
                        {!task.isCompleted ? (
                          <CheckBoxOutlineBlankIcon
                            className="text-warning"
                            sx={{ cursor: "pointer" }}
                            onClick={() => completeMyTask(ind)}
                          />
                        ) : (
                          <CheckBoxIcon
                            className="text-success"
                            sx={{ cursor: "pointer" }}
                          />
                        )}
                        <DeleteIcon
                          className="text-danger"
                          onClick={() => deleteMyTask(ind)}
                          sx={{ cursor: "pointer" }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography className="text-center fs-4 text-light fw-bold mt-3">
            No Tasks Today. Add Some
          </Typography>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
