import { db } from '../services/firebase';
import { collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';

const cropsRef = collection(db, 'crops');

export async function addCropToFirestore(formData, user, profile) {
  if (!user) throw new Error('Login required');
  const crop = {
    cropName: String(formData.cropName || '').trim(),
    quantity: Number(formData.quantity), price: Number(formData.price),
    location: String(formData.location || '').trim(),
    farmerPhone: String(formData.farmerPhone || '').trim(),
    harvestDate: formData.harvestDate || '',
    farmerId: user.uid, farmerName: profile?.name || user.displayName || '',
    createdAt: serverTimestamp(), updatedAt: serverTimestamp()
  };
  if (!crop.cropName || !crop.location || !Number.isFinite(crop.quantity) || crop.quantity <= 0 || !Number.isFinite(crop.price) || crop.price < 0) throw new Error('Please enter valid crop details.');
  const ref = await addDoc(cropsRef, crop);
  return ref.id;
}

export function listenToCrops(callback, onError) {
  const q = query(cropsRef, orderBy('createdAt', 'desc'));
  return onSnapshot(q, snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() }))), onError);
}

export async function updateCrop(id, changes, user) {
  if (!user) throw new Error('Login required');
  const allowed = { cropName: String(changes.cropName || '').trim(), quantity: Number(changes.quantity), price: Number(changes.price), location: String(changes.location || '').trim(), farmerPhone: String(changes.farmerPhone || '').trim(), harvestDate: changes.harvestDate || '', updatedAt: serverTimestamp() };
  if (!allowed.cropName || !allowed.location || !Number.isFinite(allowed.quantity) || allowed.quantity < 0 || !Number.isFinite(allowed.price) || allowed.price < 0) throw new Error('Invalid crop data.');
  return updateDoc(doc(db, 'crops', id), allowed);
}

export async function deleteCrop(id) { return deleteDoc(doc(db, 'crops', id)); }
