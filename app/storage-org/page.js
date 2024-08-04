"use client";

import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { Box, Typography, Modal, TextField, Button, Stack, IconButton, Link } from "@mui/material";
import { query, collection, getDocs, getDoc, doc, deleteDoc, setDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import AddIcon from '@mui/icons-material/Add';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import DeleteIcon from '@mui/icons-material/Delete';

export const initializeStorage = async (userId) => {
  const storageRef = collection(firestore, `users/${userId}/storage`);
  const snapshot = await getDocs(storageRef);

  if (snapshot.empty) {
    const defaultItemRef = doc(storageRef, "Sample Item");
    await setDoc(defaultItemRef, { name: "Sample Item", count: 1 });
  }
};

export default function StorageOrgPage() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [user, setUser] = useState(null);

  const auth = getAuth();

  const updateInventory = async (userID) => {
    const inventoryRef = collection(firestore, `users/${userID}/storage`);
    const snapshot = await getDocs(inventoryRef);
    const inventoryList = snapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      count: doc.data().count,
    }));
    setInventory(inventoryList);
  };

  const addItem = async (userID, itemName) => {
    const itemRef = doc(firestore, `users/${userID}/storage`, itemName);
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
    <Box width="100vw" height="100vh" display="flex" flexDirection="column">
      <Box flexGrow={1} display="flex" flexDirection="column" p={4}>
        <Box width="80%" maxWidth="800px" alignSelf="center" display="flex" flexDirection="column">
          <Typography variant="h4" color="#333" mb={4}>Storage</Typography>
        
        <Box border="1px solid #ccc" borderRadius={1} overflow="hidden">
          {/* Column headers */}
          <Box display="flex" bgcolor="#f5f5f5" p={2}>
            <Typography variant="subtitle1" sx={{ width: '40%' }}>Name</Typography>
            <Typography variant="subtitle1" sx={{ width: '20%', textAlign: 'center' }}>Count</Typography>
            <Typography variant="subtitle1" sx={{ width: '40%', textAlign: 'center' }}>Actions</Typography>
          </Box>

          
          {inventory.map(({ name, count }) => (
            <Box key={name} display="flex" alignItems="center" p={2} borderTop="1px solid #eee">
              <Typography sx={{ width: '40%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography sx={{ width: '20%', textAlign: 'center' }}>{count}</Typography>
              <Box sx={{ width: '40%', display: 'flex', justifyContent: 'center' }}>
                <IconButton onClick={() => addItem(user.uid, name)} size="small" sx={{ mr: 2 }}>
                  <AddIcon />
                </IconButton>
                <IconButton onClick={() => removeItem(user.uid, name)} size="small">
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Box>

        <Box alignSelf="flex-end" mt={2}>
            <Button variant="contained" onClick={handleOpen}>Add New Item</Button>
          </Box>
        </Box>
      </Box>


          <Box 
        component="footer" 
        mt={4} 
        py={2} 
        display="flex" 
        flexDirection="column" 
        alignItems="center"
        borderTop="1px solid #ccc"
      >
        <Typography variant="body2" color="text.secondary" align="center">
          © 2024 Storage Organizer. All rights reserved. Made by Saad Inam.
        </Typography>
        <Box mt={1}>
          <Link href="https://github.com/saadmemon1" target="_blank" rel="noopener" color="inherit" sx={{ mr: 2 }}>
            <GitHubIcon />
          </Link>
          <Link href="https://linkedin.com/in/saadinamm" target="_blank" rel="noopener" color="inherit">
            <LinkedInIcon />
          </Link>
        </Box>
      </Box>

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
    </Box>
  );
}