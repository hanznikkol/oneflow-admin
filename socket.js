import { reactive, ref } from "vue";
import { io } from "socket.io-client";

export const state = reactive({
  connected: false,
  onlinePersonnels: [],
  adminInfo: {},
});

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === "production" ? undefined : "http://localhost:3000";

export let socket = io(URL, {autoConnect: false});

export const setAuth = (adminInfo) => {
  socket.auth = {adminID: adminInfo.adminID, adminType: adminInfo.adminType}
  socket.connect()
}

socket.on("connect", () => {
  state.connected = true;
});

socket.on("disconnect", () => {
  state.connected = false;
});

socket.on('onlineUsers', (onlineUsers) => {
  state.onlinePersonnels = onlineUsers
})

// Events
socket.on('newTicket', (ticket) => {
  state.queueTickets.push(ticket)
  console.log(ticket)
})

socket.on('callTicket', (calledTicket) => {
  const ticketIndex = state.queueTickets.findIndex(ticket => ticket.ticketID === calledTicket.ticketID)
  state.queueTickets[ticketIndex] = calledTicket
})

socket.on('holdTicket', (heldTicket) => {
  const ticketIndex = state.queueTickets.findIndex(ticket => ticket.ticketID === heldTicket.ticketID)
  state.queueTickets[ticketIndex] = heldTicket
})

socket.on('completeTicket', (completedTicket) => {
  const ticketIndex = state.queueTickets.findIndex(ticket => ticket.ticketID === completedTicket.ticketID)
  state.queueTickets[ticketIndex] = completedTicket
})

socket.on("error", (err) => {
  //handle error
  alert('An error occured: ', err)
})
