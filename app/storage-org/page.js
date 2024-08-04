"use client";

import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { Box, Typography, Modal, TextField, Button, Stack, Card, CardContent } from "@mui/material";
import { query, collection, getDocs, getDoc, doc, deleteDoc, setDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';


export const initializeStorage = async (userId) => {
  const storageRef = collection(firestore, `users/${userId}/storage`);
  const snapshot = await getDocs(storageRef);

  // Check if the storage collection is empty
  if (snapshot.empty) {
      // Create a default item to initialize the collection
      const defaultItemRef = doc(storageRef, "Sample Item");
      await setDoc(defaultItemRef, { name: "Sample Item", count: 1 });
  }
};

export default function StorageOrgPage() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [user, setUser] = useState(null); // State to hold the user object

  const auth = getAuth(); // Get the auth object

// Function to initialize storage for a new user



  const updateInventory = async (userID) => {
    const inventoryRef = collection(firestore, `users/${userID}/storage`);
    // const q = query(inventoryRef);
    const snapshot = await getDocs(inventoryRef);
    const inventoryList = snapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      count: doc.data().count,
    }));
    setInventory(inventoryList);

    // const snapshot = query(collection(firestore, 'storage'));
    // const docs = await getDocs(snapshot);
    // const inventoryList = [];
    // docs.forEach((doc) => {
    //   inventoryList.push({
    //     name: doc.id,
    //     ...doc.data(),
    //   });
    // });
    // setInventory(inventoryList);
  };

  const addItem = async (userID, itemName) => {
    const itemRef = doc(firestore, `users/${userID}/storage`, itemName);
    // const docRef = doc(collection(firestore, 'storage'), item);
    const docSnap = await getDoc(itemRef);
    if (docSnap.exists()) {
      const count = docSnap.data().count || 0;
      await setDoc(itemRef, { count: count + 1 }, { merge: true });
    } else {
      await setDoc(itemRef, { name: itemName, count: 1 });
    }
    await updateInventory(userID);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const removeItem = async (userID, itemName) => {

    const itemRef = doc(firestore, `users/${userID}/storage`, itemName);
    const docSnap = await getDoc(itemRef);
    if (docSnap.exists() && docSnap.data().count > 1) {
      await setDoc(itemRef, { count: docSnap.data().count - 1 }, { merge: true });
    } else {
      await deleteDoc(itemRef);
    }
    await updateInventory(userID);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        if (currentUser) {
            updateInventory(currentUser.uid);
        }
    });
    return () => unsubscribe();
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
            <Button variant="contained" onClick={() => { addItem(user.uid, itemName); setItemName(''); handleClose(); }}>Add Item</Button>
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
                  <Button variant="contained" sx={{ width: '70px' }} onClick={() => addItem(user.uid, name)}>Add</Button>
                  <Button variant="contained" sx={{ width: '80px' }} onClick={() => removeItem(user.uid, name)}>Remove</Button>
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
