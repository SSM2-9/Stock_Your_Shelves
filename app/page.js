"use client";

import { useState, useEffect } from 'react';
import { Box, Stack, Typography, Button, Modal, TextField, Tooltip, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { firestore } from '@/firebase';
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState(1);
  const [currentItem, setCurrentItem] = useState(null);

  // Fetch and update inventory
  const updateInventory = async () => {
    try {
      const snapshot = query(collection(firestore, 'inventory'));
      const docs = await getDocs(snapshot);
      const inventoryList = docs.docs.map(doc => ({ name: doc.id, ...doc.data() }));
      setInventory(inventoryList);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  // Add item to inventory
  const addItem = async (item, quantity) => {
    if (!item) return; // Validate item name
    try {
      const docRef = doc(collection(firestore, 'inventory'), item);
      const docSnap = await getDoc(docRef);
      const currentQuantity = docSnap.exists() ? docSnap.data().quantity : 0;
      await setDoc(docRef, { quantity: currentQuantity + quantity });
      await updateInventory();
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  // Update item quantity
  const updateItemQuantity = async (item, quantity) => {
    if (!item || quantity < 0) return; // Validate item name and quantity
    try {
      const docRef = doc(collection(firestore, 'inventory'), item);
      await setDoc(docRef, { quantity });
      await updateInventory();
    } catch (error) {
      console.error("Error updating item quantity:", error);
    }
  };

  // Remove item from inventory
  const removeItem = async (item) => {
    if (!item) return; // Validate item name
    try {
      const docRef = doc(collection(firestore, 'inventory'), item);
      await deleteDoc(docRef);
      await updateInventory();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  // Modal handlers
  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);
  const handleOpenUpdate = (itemName, itemQuantity) => {
    setCurrentItem(itemName);
    setItemQuantity(itemQuantity);
    setOpenUpdate(true);
  };
  const handleCloseUpdate = () => setOpenUpdate(false);

  useEffect(() => {
    updateInventory();
  }, []);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      padding={4}
      sx={{
        backgroundImage: 'url(/backgroundimg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backgroundBlendMode: 'overlay',
      }}
    >
      {/* GIFs at the top left and right corners */}
      <Box
        position="fixed"
        width="50px"
        height="50px"
        display="flex"
        alignItems="center"
        style={{
          left: 0,
          top: '10px',
          paddingLeft: '15px',
          paddingTop: '50px',
          zIndex: 10,
        }}
      >
        <img 
          src="/1.gif"
          alt="Left Corner GIF"
          style={{ width: '100px', height: '100px', objectFit: 'contain' }}
        />
      </Box>

      <Box
        position="fixed"
        width="50px"
        height="50px"
        display="flex"
        alignItems="center"
        style={{
          right: 0,
          top: '10px',
          paddingRight: '128px',
          paddingTop: '50px',
          zIndex: 10,
        }}
      >
        <img 
          src="/2.gif"
          alt="Right Corner GIF"
          style={{ width: '120px', height: '120px', objectFit: 'contain' }}
        />
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        flex={1}
        overflow="auto"
      >
        <Box
          width="100%"
          maxWidth="1200px"
          margin="auto"
          padding={3}
          bgcolor="rgba(146, 106, 64, 0.7)"
          boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
          mt={4}
          mb={4}
          position="relative"
        >
          <Box
            width="100%"
            height="75px"
            bgcolor="rgba(205, 161, 114, 0.9)"
            display="flex"
            justifyContent="center"
            alignItems="center"
            borderRadius="4px 4px 0 0"
          >
            <Typography variant="h3" color="rgb(49, 31, 23)" textAlign="center" className="dancing-script">
              Stock Your Shelves
            </Typography>
            <Tooltip title="Welcome to your pantry hub! Here, you can effortlessly add new items to keep your kitchen well-stocked and organized. Whether you're replenishing your essentials or adding something new, this is your go-to spot for managing your pantry inventory. Keep your shelves full and your cooking adventures deliciously prepared!" arrow>
              <IconButton
                style={{ position: 'fixed', right: '10px', top: '50%', transform: 'translateY(-50%)' }}
              >
                <InfoIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <Stack
            width="100%"
            height="500px"
            spacing={2}
            overflow="auto"
            padding
            bgcolor="rgba(240, 240, 240, 0.8)"
          >
            {inventory.map(({ name, quantity }) => (
              <Box
                key={name}
                width="100%"
                minHeight="100px"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                padding={2}
                border="1px solid #ccc"
                borderRadius="4px"
              >
                <Typography variant="h5" color="#333" className="playfair-display">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="h5" color="#333" className="playfair-display-regular">
                  Quantity: {quantity}
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Button
                    variant="contained"
                    onClick={() => handleOpenUpdate(name, quantity)}
                    sx={{ bgcolor: "rgba(146, 106, 64, 0.7)" }}
                  >
                    Update
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => removeItem(name)}
                    sx={{ bgcolor: "rgba(146, 106, 64, 0.7)" }}
                  >
                    Remove
                  </Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>

        <Button
          variant="contained"
          onClick={handleOpenAdd}
          sx={{ marginTop: 2, bgcolor: "rgba(146, 106, 64, 0.7)" }}
          className="Add_bt"
        >
          Add New Item
        </Button>
      </Box>

      <Modal
        open={openAdd}
        onClose={handleCloseAdd}
        aria-labelledby="modal-add-title"
        aria-describedby="modal-add-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-add-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              id="item-name"
              label="Item Name"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <TextField
              id="item-quantity"
              label="Quantity"
              type="number"
              variant="outlined"
              fullWidth
              value={itemQuantity}
              onChange={(e) => setItemQuantity(parseInt(e.target.value, 10) || 1)}
            />
          </Stack>
          <Button
            variant="outlined"
            onClick={() => {
              addItem(itemName, itemQuantity);
              handleCloseAdd();
            }}
          >
            Add
          </Button>
        </Box>
      </Modal>

      <Modal
        open={openUpdate}
        onClose={handleCloseUpdate}
        aria-labelledby="modal-update-title"
        aria-describedby="modal-update-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-update-title" variant="h6" component="h2">
            Update Item Quantity
          </Typography>
          <TextField
            id="update-item-quantity"
            label="Quantity"
            type="number"
            variant="outlined"
            fullWidth
            value={itemQuantity}
            onChange={(e) => setItemQuantity(parseInt(e.target.value, 10) || 1)}
          />
          <Button
            variant="outlined"
            onClick={() => {
              updateItemQuantity(currentItem, itemQuantity);
              handleCloseUpdate();
            }}
          >
            Update
          </Button>
        </Box>
      </Modal>
      
    </Box>
  );
}
