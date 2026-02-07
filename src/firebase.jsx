// firebase.ts
import { initializeApp } from "firebase/app"
import { getAuth, FacebookAuthProvider } from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyAlKneE9uLy4ueuhla9OkXmzuLGKQAAyYQ",
    authDomain: "sasi-delivery.firebaseapp.com",
    projectId: "sasi-delivery",
    appId: "1:919466081545:web:75a2f60f49fa865210e7d8",
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const facebookProvider = new FacebookAuthProvider()
