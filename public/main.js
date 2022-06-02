const update = document.querySelector('#update-button');

update.addEventListener('click', (e) => {
  //send PUT request
  fetch('/quotes', {
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Darth Vadar',
      quote: 'I find your lack of faith disturbing',
    }),
  })
    .then((res) => {
      if (res.ok) return res.json();
    })
    .then((response) => {
      // response will be "Success" from the put router on server.js
      console.log(response);
      window.location.reload(true);
    });
});

const deleteBtn = document.querySelector('#delete-button');
const messageEl = document.querySelector('#message');
deleteBtn.addEventListener('click', (e) => {
  fetch('/quotes', {
    method: 'delete',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Darth Vadar',
    }),
  })
    .then((res) => {
      if (res.ok) return res.json();
    })
    .then((response) => {
      if (response === 'No quote to Delete') {
        messageEl.textContent = 'No Darth Vadar quote to delete';
      } else {
        // response will be "Successful Delete" from the put router on server.js
        console.log(response);
        window.location.reload(true);
      }
    });
});
