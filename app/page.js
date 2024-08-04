"use client";

import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { Box, Typography, Modal, TextField, Button, Stack, Card, CardContent } from "@mui/material";
import { query, collection, getDocs, getDoc, doc, deleteDoc, setDoc } from 'firebase/firestore';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'storage'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'storage'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { count } = docSnap.data();
      await setDoc(docRef, { count: count + 1 });
    } else {
      await setDoc(docRef, { count: 1 });
    }
    await updateInventory();
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'storage'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { count } = docSnap.data();
      if (count === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { count: count - 1 });
      }
    }
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  return (
    <Box width="100vw" height="100vh" display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={2}>
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width="400px"
          bgcolor="white"
          borderRadius="10px"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{ transform: "translate(-50%, -50%)" }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" spacing={2} direction="row">
            <TextField variant='outlined' fullWidth value={itemName} onChange={(e) => setItemName(e.target.value)} />
            <Button variant="contained" onClick={() => { addItem(itemName); setItemName(''); handleClose(); }}>Add Item</Button>
          </Stack>
        </Box>
      </Modal>

      <Button variant="contained" onClick={handleOpen}>Add New Item</Button>
      <Box border="1px solid #333" width="80%" maxWidth="800px" p={2}>
        <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
          <Typography variant="h2" color="#333">Storage</Typography>
        </Box>
        <Stack direction="column" spacing={2} overflow="auto">
          {inventory.map(({ name, count }) => (
            <Card key={name} variant="outlined">
            <CardContent>
              <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" sx={{ gap: 22 }}>
                <Typography variant="h5" color="#333" sx={{ flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="h6" color="#333" sx={{ width: '40px', textAlign: 'center' }}>
                  {count}
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Button variant="contained" sx={{ width: '70px' }} onClick={() => addItem(name)}>Add</Button>
                  <Button variant="contained" sx={{ width: '80px' }} onClick={() => removeItem(name)}>Remove</Button>
                </Stack>
              </Box>
            </CardContent>
          </Card>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
