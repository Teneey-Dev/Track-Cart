 import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getDatabase, ref, get, push, set} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-database.js";
import {getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

 const firebaseConfig = {
    apiKey: "AIzaSyBrtKlroOXPZU-M4maCB-x7vyxP2biCSIk",
    authDomain: "track-cart.firebaseapp.com",
    projectId: "track-cart",
    storageBucket: "track-cart.firebasestorage.app",
    messagingSenderId: "582809153869",
    appId: "1:582809153869:web:9b903d6fa039f59e4d0704"
  };

   const app = initializeApp(firebaseConfig);
    const database = getDatabase(app, "https://track-cart-default-rtdb.europe-west1.firebasedatabase.app/");
   const auth = getAuth(app)
   const provider = new GoogleAuthProvider()



 function getStoreFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const store = params.get("store");
  if (store === null) {
    console.log("NO STORE FOUND!");
  }

  return store;
}



const form = document.querySelector(".track-form")

if (form) {
  form.addEventListener("submit", async function(event) {
    event.preventDefault()

    const trackResult = document.querySelector("#track-result")
    const input = document.querySelector("#tracking-code")
    const code = input.value

    if (code.trim() === "") {
      trackResult.textContent = "INPUT A CODE"
      return
    }

    trackResult.textContent = "CHECKING..."

    const codeRef = ref(database, "orders/" + code)
    const results = await get(codeRef)

    if (results.exists()) {
      const order = results.val()
      trackResult.textContent = order.CustomerName + " Your delivery has been " + order.status
    } else {
      trackResult.textContent = "CHECK YOUR CODE WELL"
    }
  })
}


const addOrder = document.querySelector("#add-order-form")
const orderResult = document.querySelector("#add-order-result")

if (addOrder) {
  addOrder.addEventListener("submit", async function (event) {
    event.preventDefault()

const parameters = getStoreFromUrl()
if (parameters === null) {
  orderResult.textContent = "INPUT THE VENDOR LINK IN THE BROWSER"
  return
} 

orderResult.textContent = "SAVING ORDER .."
    

    const CustomerName = document.querySelector("#customer-name")
    const customers = CustomerName.value
    const status = document.querySelector("#order-status")
    const position = status.value
  

    const orders = ref(database, "orders") 
    const ordersRef = await get(orders)

    let count = 0 
    if (ordersRef.exists()) {
      count = Object.keys(ordersRef.val()).length
    } else{
      count = 0
    }

    const newCode = "TCK-" + (count + 1)


    const newRef = ref(database, "orders/" + newCode)
    const newOrder = await set(newRef, {
      store: parameters,
      CustomerName: customers,
      status: position
    })
  orderResult.textContent = "Order created! Code: " + newCode + "Share your store  Link and the code generated to the customer"
  CustomerName.value = ""
status.value = ""
  })
}



// async function testFirebaseRead() {
//   const orderRef = ref(database, "orders");
//   const newOrderRef = await push(orderRef, {
//   store : "teni",
//   CustomerName : "Leah",
//   status: "Processing"
//   })
//   console.log(newOrderRef.key);
// }

// testFirebaseRead();



// function getStoreFromUrl() {
//   const params = new URLSearchParams(window.location.search);
//   const store = params.get("store");
//   if (store === null) {
//     console.log("NO STORE FOUND!");
//   }

//   return store;
// }



const signUp = document.querySelector("#signup-section")
const logIn = document.querySelector("#login-section")
const toggleSignUp =document.querySelector("#toggle-signup")
const toggleLogIn =document.querySelector("#toggle-login")

if(toggleLogIn){
toggleLogIn.addEventListener("click", function() {
signUp.classList.add("hidden")
logIn.classList.remove("hidden")
toggleLogIn.classList.add("active")
toggleSignUp.classList.remove("active")
} )
}

if (toggleSignUp) {
toggleSignUp.addEventListener("click", function() {
signUp.classList.remove("hidden")
logIn.classList.add("hidden")
toggleLogIn.classList.remove("active")
toggleSignUp.classList.add("active")
} )
}


const signUpForm = document.querySelector("#signup-form")
const signUpEmail = document.querySelector("#signup-email")
const signUpStoreName = document.querySelector("#signup-store-name")
const signUpPassWord = document.querySelector("#signup-password")
const signUpResult = document.querySelector("#signup-result")

if(signUpForm) {
signUpForm.addEventListener("submit", async function(event){
event.preventDefault()

const emailInput = signUpEmail.value
const storeInput = signUpStoreName.value
const newStoreInput = ref(database, "stores/" + storeInput)
const newStoreRef = await get(newStoreInput)
if (newStoreRef.exists()) {
signUpResult.textContent = "STORE NAME ALREADY EXISTS"
signUpEmail.value =""
signUpPassWord.value =""
signUpStoreName.value =""
return
}

const passwordInput = signUpPassWord.value

const result = await createUserWithEmailAndPassword(auth, emailInput, passwordInput)
console.log(result)
const resultRef = await set(newStoreInput,{
 ownerId:result.user.uid
})

window.location.href = "dashboard.html?store=" + storeInput

signUpEmail.value =""
signUpPassWord.value =""
signUpStoreName.value =""
})
}

const loginForm = document.querySelector("#login-form")
const loginEmail = document.querySelector("#login-email")
const loginPassword = document.querySelector("#login-password")

if (loginForm) {
loginForm.addEventListener("submit", async function (event) {
  event.preventDefault()

  const  loginEmailInput =loginEmail.value
  const  loginpasswordInput =loginPassword.value

  const loginResult = await signInWithEmailAndPassword(auth, loginEmailInput, loginpasswordInput)
  
  console.log(loginResult)

  loginEmail.value = ""
  loginPassword.value = ""
})
}

const dashboardName = document.querySelector("#dashboard-store-name")
const dashboardAddOrder = document.querySelector("#add-order-link")

if(dashboardName) {


   const parameters = getStoreFromUrl()

  dashboardName.textContent = parameters


  dashboardAddOrder.href = "add-order.html?store="  + parameters

}

const googleLogIn = document.querySelector("#signup-google")
const googleSignIn = document.querySelector("#login-google")

if (googleLogIn) {
  googleLogIn.addEventListener("click", async function(){
    if (signUpStoreName.value.trim()==="") {
      signUpResult.textContent = "INPUT A STORE NAME"
      return
    }


    const googleForm = await signInWithPopup(auth, provider)
    console.log(googleForm)

const storeInput = signUpStoreName.value
const newStoreInput = ref(database, "stores/" + storeInput)
const newStoreRef = await get(newStoreInput)

  if(newStoreRef.exists()) {
signUpResult.textContent = "STORE NAME ALREADY EXISTS"
return
  }
const resultRef =  await set(newStoreInput,{
ownerId: googleForm.user.uid
})
window.location.href = "dashboard.html?store=" + storeInput
 signUpStoreName.value=""
  })
  }

if (googleSignIn) {
  googleSignIn.addEventListener("click", async function(){

    const googleForm = await signInWithPopup(auth, provider)
    console.log(googleForm)

     const stores = ref(database, "stores") 
    const storesRef = await get(stores)
    console.log(storesRef.val())
  })
}