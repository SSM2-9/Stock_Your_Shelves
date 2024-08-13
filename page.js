'use client'

import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material'
import { firestore } from '@/firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'

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
}

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [openAdd, setOpenAdd] = useState(false)
  const [openUpdate, setOpenUpdate] = useState(false)
  const [itemName, setItemName] = useState('')
  const [itemQuantity, setItemQuantity] = useState(1)
  const [currentItem, setCurrentItem] = useState(null)

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
  }

  const suggestRecipe = async () => {
    const pantryItems = inventory.map(item => item.name).join(", ");
    
    try {
      const response = await fetch('/api/suggestRecipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pantryItems }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      const recipe = data.recipe;
      alert(`Recipe Suggestion: ${recipe}`);
    } catch (error) {
      console.error("Error fetching recipe:", error);
      alert("Failed to fetch a recipe. Please try again later.");
    }
  };

  const addItem = async (item, quantity) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity: currentQuantity } = docSnap.data()
      await setDoc(docRef, { quantity: currentQuantity + quantity })
    } else {
      await setDoc(docRef, { quantity: quantity })
    }
    await updateInventory()
  }

  const updateItemQuantity = async (item, quantity) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    await setDoc(docRef, { quantity: quantity })
    await updateInventory()
  }
  
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }

  const handleOpenAdd = () => setOpenAdd(true)
  const handleCloseAdd = () => setOpenAdd(false)
  const handleOpenUpdate = (itemName, itemQuantity) => {
    setCurrentItem(itemName)
    setItemQuantity(itemQuantity)
    setOpenUpdate(true)
  }
  const handleCloseUpdate = () => setOpenUpdate(false)
  
  useEffect(() => {
    updateInventory()
  }, [])

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
      {/* Container to align the inventory box and the button */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        flex={1}
        overflow="auto"
      >
        {/* Inventory Items Box */}
        <Box
          width="100%"
          maxWidth="1200px"
          margin-left="auto"
          margin-right="auto"
          padding={3}
          bgcolor="rgba(146, 106, 64, 0.7)"
          boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
          mt={4}
          mb={4} // Margin bottom to separate from the button
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
              My Pantry
            </Typography>
          </Box>
          <Stack
            width="100%"
            height="500px"
            spacing={2}
            overflow="auto"
            padding={2}
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
                  >
                    Update
                  </Button>
                  <Button variant="contained" onClick={() => removeItem(name)}>
                    Remove
                  </Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>

        {/* Add New Item Button - Positioned below the inventory box */}
        <Button variant="contained" onClick={handleOpenAdd} sx={{ marginTop: 0 }}>
          Add New Item
        </Button>

        <Button variant="contained" onClick={suggestRecipe} sx={{ marginTop: 2 }}>
          Suggest a Recipe
        </Button>
      </Box>

      {/* Modal for Adding New Item */}
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
          <Stack width="100%" direction={'row'} spacing={2}>
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
              onChange={(e) => setItemQuantity(parseInt(e.target.value) || 1)}
            />
          </Stack>
          <Button
            variant="outlined"
            onClick={() => {
              addItem(itemName, itemQuantity)
              handleCloseAdd()
            }}
          >
            Add
          </Button>
        </Box>
      </Modal>

      {/* Modal for Updating Item Quantity */}
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
            onChange={(e) => setItemQuantity(parseInt(e.target.value) || 1)}
          />
          <Button
            variant="outlined"
            onClick={() => {
              updateItemQuantity(currentItem, itemQuantity)
              handleCloseUpdate()
            }}
          >
            Update
          </Button>
        </Box>
      </Modal>
    </Box>
  )
}