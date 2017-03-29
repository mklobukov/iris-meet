import 'whatwg-fetch';
import Config from '../../config.json';

//const token = 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBfa2V5IjoieXAzbU9EdzBhSU5JUkxDcHJlY3dOUWQybWtORnVQeTUiLCJkb21haW4iOiJpcmlzLW1lZXQuY29tY2FzdC5jb20iLCJleHAiOjE0OTgwNTkyMzcsImlhdCI6MTQ5MDI4MzIzNywiaWQiOiJ5cDNtT0R3MGFJTklSTENwcmVjd05RZDJta05GdVB5NSIsImlzcyI6ImlyaXNhdXRoIiwic2NvcGVzIjoiY2xpZW50IHJlYWR3cml0ZTppZG0gcmVhZHdyaXRlOmVtIiwic3ViIjoieXAzbU9EdzBhSU5JUkxDcHJlY3dOUWQybWtORnVQeTUiLCJ0eXBlIjoiU2VydmVyIn0.UI6J-9XDnsZdngH8qDpWJ9ywQKJYjA035-F79--l4VU1QplZJhRGlfEmg8_KXG4d4KcWSbqwyAbKKju2ANOMag';
//const token = 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBfa2V5IjoiTW9pZHpJcW9mR2pCaUI2aTd0K0JGbEY5ejdzekJMbDYiLCJkb21haW4iOiJyb2JzZGV2LmNvbWNhc3QuY29tIiwiZXhwIjoxNDk4NTY0MDc5LCJpYXQiOjE0OTA3ODgwNzksImlkIjoiTW9pZHpJcW9mR2pCaUI2aTd0K0JGbEY5ejdzekJMbDYiLCJpc3MiOiJpcmlzYXV0aCIsInNjb3BlcyI6ImNsaWVudCByZWFkd3JpdGU6aWRtIHJlYWR3cml0ZTplbSIsInN1YiI6Ik1vaWR6SXFvZkdqQmlCNmk3dCtCRmxGOXo3c3pCTGw2IiwidHlwZSI6IlNlcnZlciJ9.64vrLR2hW-pnME1aOYZJib9p30gtOyGq3Lhro9qLbvDqVasCuULODVnFQ3cO6BBUlmQcdiFDqIzFDTFa-ganSw';

const checkStatus = (response) => {
  console.log('response status: ' + response.status);
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    let error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

const parseJSON = (response) => {
  return response.json();
}

export const getRoomId = (roomName, token) => {
  const DOCUMENT_STORE_API_ENDPOINT = `https://${Config.eventManagerUrl}/v1/createroom/room/${roomName}`

  return fetch(DOCUMENT_STORE_API_ENDPOINT, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(checkStatus)
    .then(parseJSON)
}
