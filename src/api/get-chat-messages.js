//Code to grab chat messages from the EVM
//when the user just joined the room

import 'whatwg-fetch';
import Config from '../../config.json';

const checkStatus = (response) => {
  console.log("Response status: ", response.status);
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    console.log("Response statusText: ", response.statusText)
    let error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

const parseJSON = (response) => {
  return response.json();
}

export const getChatMessages = (roomname, token, count) => {
  //Gets all event history for a given roomname within a domain.
  const EVM_API_ENDPOINT = `https://${Config.eventManagerUrl}/v1/view/events/room/${roomname}/records/${count}`
  return fetch(EVM_API_ENDPOINT, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  .then(checkStatus)
  .then(parseJSON)
}


export const getChatMessagesByRoutingAndRoomId = (routingId, roomId, token, count) => {
  //Sends 500 Internal Server error
  const EVM_API_ENDPOINT = `https://${Config.eventManagerUrl}/v1/view/routingid/${routingId}/room/${roomId}/records/${count}`;
  return fetch(EVM_API_ENDPOINT, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  .then(checkStatus)
  .then(parseJSON)
}

export const getChatMessagesByRoutingId = (routingId, token, count) => {
  //Sends 500 Internal Server error.
  const EVM_API_ENDPOINT = `https://${Config.eventManagerUrl}/v1/view/routingid/${routingId}/event/chat/records/${count}`;
  return fetch(EVM_API_ENDPOINT, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  .then(checkStatus)
  .then(parseJSON)
}
