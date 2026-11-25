
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

async function testFirestore() {
  try {
    const docRef = await addDoc(collection(db, "test"), {
      message: "FasalMitra Firestore Connected!",
      createdAt: new Date()
    });

    console.log("Firestore connected! Document ID:", docRef.id);
  } catch (error) {
    console.error("Firestore error:", error);
  }
}

testFirestore();
