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
      trackResult.textContent = order.customerName + " Your delivery has been " +  order.status   + " — Last updated: "   + new Date(order.lastUpdated).toLocaleString()
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
    

    const customerName = document.querySelector("#customer-name")
    const customers = customerName.value
    const status = document.querySelector("#order-status")
    const position = status.value
    const item = document.querySelector("#order-item")
    const orderItem = item.value
    const price = document.querySelector("#order-price")
    const orderPrice = price.value
    const address = document.querySelector("#order-address")
    const orderAddress = address.value
    const rider = document.querySelector("#dispatch-rider")
const dispatchRider = rider.value
  

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
      customerName: customers,
      status: position,
      item:orderItem,
      price:orderPrice,
      address: orderAddress,
      rider:dispatchRider,
      lastUpdated:Date.now()
    })
  orderResult.textContent = "Order created! Code: " + newCode + " Share your store  Link and the code generated to the customer"
  customerName.value = ""
status.value = ""
item.value=""
price.value=""
address.value=""
rider.value=""
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
const loginStoreName = document.querySelector("#login-store-name")

if (loginForm) {
loginForm.addEventListener("submit", async function (event) {
  event.preventDefault()

  const storeName = loginStoreName.value
  const  loginEmailInput =loginEmail.value
  const  loginpasswordInput =loginPassword.value

  const loginResult = await signInWithEmailAndPassword(auth, loginEmailInput, loginpasswordInput)
  
  console.log(loginResult)

  loginEmail.value = ""
  loginStoreName.value=""
  loginPassword.value = ""

window.location.href = "dashboard.html?store=" + storeName

})
}

const dashboardName = document.querySelector("#dashboard-store-name")
const dashboardAddOrder = document.querySelector("#add-order-link")

if(dashboardName) {
async function loadDashBoard() {
  const dashboardInfo = ref(database, "orders")
  const dashboardRef = await get(dashboardInfo)
  const parameters = getStoreFromUrl()
  const allOrders = dashboardRef.val()
  const orderListContainer = document.querySelector("#order-list")

  for (const code in allOrders) {
    if (allOrders[code].store === parameters) {
      const order = allOrders[code]

      const orderBlock = document.createElement("div")
      orderBlock.className = "order-block"

      const info = document.createElement("p")
      info.textContent = code + " — " + order.customerName + " — " + order.item

      const statusSelect = document.createElement("select")
      const statusOptions = ["confirmed", "packed", "out-for-delivery", "delivered"]

      for (const option of statusOptions) {
        const optionElement = document.createElement("option")
        optionElement.value = option
        optionElement.textContent = option
        if (order.status === option) {
          optionElement.selected = true
        }
        statusSelect.appendChild(optionElement)
      }

      statusSelect.addEventListener("change", async function () {
        const orderRef = ref(database, "orders/" + code)
        await set(orderRef, {
          store: order.store,
          customerName: order.customerName,
          item: order.item,
          price: order.price,
          address: order.address,
          rider: order.rider,
          status: statusSelect.value,
          lastUpdated: Date.now()
        })
      })

      orderBlock.appendChild(info)
      orderBlock.appendChild(statusSelect)
      orderListContainer.appendChild(orderBlock)
    }
  }

  dashboardName.textContent = parameters
  dashboardAddOrder.href = "add-order.html?store=" + parameters
}

 

loadDashBoard()

  



}

const googleLogIn = document.querySelector("#login-google")
const googleSignIn = document.querySelector("#signup-google")

if (googleSignIn) {
  googleSignIn.addEventListener("click", async function(){
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

if (googleLogIn) {
  googleLogIn.addEventListener("click", async function(){

const loginStoreName = document.querySelector("#login-store-name")

const storeName = loginStoreName.value

    const googleForm = await signInWithPopup(auth, provider)
    console.log(googleForm)
 
window.location.href = "dashboard.html?store=" + storeName

    loginStoreName.value=""
  })
}