import { db } from '../services/firebase';
import { collection, addDoc, onSnapshot, query, orderBy, doc, runTransaction, serverTimestamp } from 'firebase/firestore';

export function listenToRequests(callback, onError) {
  return onSnapshot(query(collection(db, 'requests'), orderBy('createdAt', 'desc')), snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() }))), onError);
}

// This transaction reserves/decreases stock when a farmer accepts a request.
export async function createPurchaseRequest(
  crop,
  quantity,
  buyer,
  buyerProfile) {

  if (!buyer) throw new Error('Login required');
  const qty = Number(quantity);
  if (!crop?.id || !crop?.farmerId || !Number.isInteger(qty) || qty <= 0) throw new Error('Crop or quantity is invalid.');
  if (buyer.uid === crop.farmerId) throw new Error('You cannot request your own crop.');
  if (qty > Number(crop.quantity)) throw new Error('Quantity exceeds available stock.');
  return addDoc(collection(db, 'requests'), {
    cropId: crop.id, cropName: crop.cropName, requestedQuantity: qty,
    price: Number(crop.price), location: crop.location || '',
    buyerId: buyer.uid, buyerName: buyerProfile?.name || buyer.displayName || '',
    farmerId: crop.farmerId, status: 'Pending', createdAt: serverTimestamp(), updatedAt: serverTimestamp()
  });
}

export async function respondToRequest(requestId, action, farmerUid) {
  if (!['Accepted', 'Rejected'].includes(action)) throw new Error('Invalid response.');
  const requestRef = doc(db, 'requests', requestId);
  await runTransaction(db, async tx => {
    const requestSnap = await tx.get(requestRef);
    if (!requestSnap.exists()) throw new Error('Request not found.');
    const req = requestSnap.data();
    if (req.farmerId !== farmerUid) throw new Error('Only the crop owner can respond.');
    if (req.status !== 'Pending') throw new Error('This request is no longer pending.');
    const cropRef = doc(db, 'crops', req.cropId);
    const cropSnap = await tx.get(cropRef);
    if (!cropSnap.exists()) throw new Error('Crop listing no longer exists.');
    const crop = cropSnap.data();
    if (action === 'Accepted') {
      if (Number(crop.quantity) < Number(req.requestedQuantity)) throw new Error('Insufficient stock.');
      tx.update(cropRef, { quantity: Number(crop.quantity) - Number(req.requestedQuantity), updatedAt: serverTimestamp() });
    }
    tx.update(requestRef, { status: action, updatedAt: serverTimestamp(), respondedBy: farmerUid });
  });
}
