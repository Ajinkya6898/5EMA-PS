import { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Grid,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Container,
  Box,
  Typography,
  TableSortLabel,
  IconButton,
  Modal,
} from "@mui/material";
import { HiOutlineAdjustmentsHorizontal, HiMinusSmall } from "react-icons/hi2";

function View() {
  const [stocks, setStocks] = useState([]);
  const [stockName, setStockName] = useState("");
  const [entryPoint, setEntryPoint] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [funds, setFunds] = useState("300000"); // Default available funds
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const savedStocks = localStorage.getItem("stocks");
    if (savedStocks) {
      setStocks(JSON.parse(savedStocks));
    }
  }, []);

  const saveStocksToLocalStorage = (updatedStocks) => {
    localStorage.setItem("stocks", JSON.stringify(updatedStocks));
  };

  // Function to add a new stock
  const addStock = () => {
    if (stockName && entryPoint && stopLoss) {
      const newStock = {
        stockName,
        entryPoint,
        stopLoss,
        target: calculateTarget(entryPoint, stopLoss),
        modifySL: calculateModifySL(entryPoint, stopLoss),
        positionSize: calculatePositionSize(entryPoint, stopLoss),
      };
      const updatedStocks = [...stocks, newStock];
      setStocks(updatedStocks);
      saveStocksToLocalStorage(updatedStocks);
      setStockName("");
      setEntryPoint("");
      setStopLoss("");
    }
  };

  // Function to calculate target based on entry point and stop loss
  const calculateTarget = (entryPoint, stopLoss) => {
    const entry = parseFloat(entryPoint);
    const sl = parseFloat(stopLoss);

    if (!isNaN(entry) && !isNaN(sl)) {
      const risk = entry - sl;
      const target = entry + 2 * risk; // Set target as double the risk
      return target.toFixed(2);
    }
    return "";
  };

  const calculateModifySL = (entryPoint, stopLoss) => {
    const entry = parseFloat(entryPoint);
    const sl = parseFloat(stopLoss);

    if (!isNaN(entry) && !isNaN(sl)) {
      const risk = entry - sl;
      const trailSL = risk * 1.5;
      const modifySL = entry + trailSL;
      return modifySL.toFixed(2);
    }
    return "";
  };

  // Function to calculate position size based on entry point and stop loss
  const calculatePositionSize = (entryPoint, stopLoss) => {
    const entry = parseFloat(entryPoint);
    const sl = parseFloat(stopLoss);
    const fundsValue = parseFloat(funds); // Convert to float

    if (!isNaN(entry) && !isNaN(sl) && sl !== 0 && !isNaN(fundsValue)) {
      const risk = entry - sl;
      const positionSize = (fundsValue * 0.01) / risk;
      return positionSize.toFixed(2);
    }
    return "";
  };

  // Function to handle sorting
  const requestSort = (key) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Function to perform sorting
  const sortedStocks = () => {
    let sortedData = [...stocks];
    if (sortConfig !== null) {
      sortedData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortedData;
  };

  // Function to delete a stock from the list and local storage
  const deleteStock = (index) => {
    const updatedStocks = [...stocks];
    updatedStocks.splice(index, 1);
    setStocks(updatedStocks);
    saveStocksToLocalStorage(updatedStocks);
  };

  // Function to open edit modal
  const openEditModal = (index) => {
    setEditIndex(index);
    setIsEditing(true);
    const stockToEdit = stocks[index];
    setStockName(stockToEdit.stockName);
    setEntryPoint(stockToEdit.entryPoint);
    setStopLoss(stockToEdit.stopLoss);
  };

  // Function to save edited stock
  const saveEditedStock = () => {
    const updatedStocks = [...stocks];
    updatedStocks[editIndex] = {
      stockName,
      entryPoint,
      stopLoss,
      target: calculateTarget(entryPoint, stopLoss),
      modifySL: calculateModifySL(entryPoint, stopLoss),
      positionSize: calculatePositionSize(entryPoint, stopLoss),
    };
    setStocks(updatedStocks);
    saveStocksToLocalStorage(updatedStocks);
    setIsEditing(false);
    setEditIndex(null);
    setStockName("");
    setEntryPoint("");
    setStopLoss("");
  };

  return (
    <Container maxWidth="lg" sx={{ m: "50px auto" }}>
      <Box textAlign="center">
        <Typography variant="h4" sx={{ background: "#fff" }} p="20px" mb="20px">
          Position Size Calculator
        </Typography>
      </Box>
      <Paper style={{ padding: "20px", marginBottom: "20px" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <TextField
            label="Stock Name"
            value={stockName}
            onChange={(e) => setStockName(e.target.value)}
            size="small"
          />
          <TextField
            label="Entry Point"
            value={entryPoint}
            onChange={(e) => setEntryPoint(e.target.value)}
            size="small"
          />
          <TextField
            label="Stop Loss"
            value={stopLoss}
            onChange={(e) => setStopLoss(e.target.value)}
            size="small"
          />
          <TextField
            label="Funds"
            value={funds}
            onChange={(e) => setFunds(e.target.value)}
            size="small"
          />
          {isEditing ? (
            <Button
              sx={{ height: "40px" }}
              variant="contained"
              color="primary"
              onClick={saveEditedStock}
            >
              Save
            </Button>
          ) : (
            <Button
              sx={{ height: "40px" }}
              variant="contained"
              color="primary"
              onClick={addStock}
            >
              Add Stock
            </Button>
          )}
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}></Grid>
          <Grid item xs={12} sm={3}></Grid>
          <Grid item xs={12} sm={3}></Grid>
          <Grid item xs={12} sm={3}></Grid>
          <Grid item xs={12} sm={3}></Grid>
        </Grid>
      </Paper>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortConfig && sortConfig.key === "stockName"}
                  direction={
                    sortConfig && sortConfig.key === "stockName"
                      ? sortConfig.direction
                      : "asc"
                  }
                  onClick={() => requestSort("stockName")}
                >
                  Stock Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig && sortConfig.key === "entryPoint"}
                  direction={
                    sortConfig && sortConfig.key === "entryPoint"
                      ? sortConfig.direction
                      : "asc"
                  }
                  onClick={() => requestSort("entryPoint")}
                >
                  Entry Point
                </TableSortLabel>
              </TableCell>
              <TableCell>Position Size</TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig && sortConfig.key === "stopLoss"}
                  direction={
                    sortConfig && sortConfig.key === "stopLoss"
                      ? sortConfig.direction
                      : "asc"
                  }
                  onClick={() => requestSort("stopLoss")}
                >
                  Stop Loss
                </TableSortLabel>
              </TableCell>
              <TableCell>Target</TableCell>
              <TableCell>Modify SL</TableCell>
              <TableCell>Edit</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedStocks().map((stock, index) => (
              <TableRow key={index}>
                <TableCell>{stock.stockName}</TableCell>
                <TableCell>{stock.entryPoint}</TableCell>
                <TableCell>{stock.positionSize}</TableCell>
                <TableCell>{stock.stopLoss}</TableCell>
                <TableCell>{stock.target}</TableCell>
                <TableCell>{stock.modifySL}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => openEditModal(index)}
                  >
                    <HiOutlineAdjustmentsHorizontal />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton color="error" onClick={() => deleteStock(index)}>
                    <HiMinusSmall />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal
        open={isEditing}
        onClose={() => setIsEditing(false)}
        aria-labelledby="edit-modal"
        aria-describedby="edit-stock-details"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="edit-modal" variant="h6" component="h2">
            Edit Stock Details
          </Typography>
          <TextField
            label="Stock Name"
            value={stockName}
            onChange={(e) => setStockName(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            label="Entry Point"
            value={entryPoint}
            onChange={(e) => setEntryPoint(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            label="Stop Loss"
            value={stopLoss}
            onChange={(e) => setStopLoss(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          />
          <Button
            sx={{ mt: 2 }}
            variant="contained"
            color="primary"
            onClick={saveEditedStock}
          >
            Save Changes
          </Button>
        </Box>
      </Modal>
    </Container>
  );
}

export default View;
