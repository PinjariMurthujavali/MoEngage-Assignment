// Store user data and saved lists in localStorage
let users = JSON.parse(localStorage.getItem('users')) || [];
let savedLists = JSON.parse(localStorage.getItem('savedLists')) || [];
let currentUser = null;

// Handle Signup Form
document.getElementById('signup-form')?.addEventListener('submit', function(event) {
  event.preventDefault();

  const name = document.getElementById('signup-name').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;

  if (name && email && password) {
    const user = { name, email, password };
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    alert('Sign-up successful! Now log in.');
    window.location.href = 'login.html'; // Redirect to login page
  } else {
    alert('Please fill all fields!');
  }
});

// Handle Login Form
document.getElementById('login-form')?.addEventListener('submit', function(event) {
  event.preventDefault();

  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    window.location.href = 'search.html'; // Redirect to search page
  } else {
    alert('Invalid email or password!');
  }
});

// Handle Search Functionality
document.getElementById('search-btn')?.addEventListener('click', function() {
  const responseCode = document.getElementById('response-code').value;

  if (responseCode) {
    const imageSrc = `https://http.dog/${responseCode}.jpg`; // Dynamic image URL
    document.getElementById('results').innerHTML = `
      <p>Displaying images for response code: ${responseCode}</p>
      <img src="${imageSrc}" alt="Response Code Image" id="searched-image"/>
    `;
    document.getElementById('save-btn').style.display = 'block';
  } else {
    alert('Please enter a valid response code!');
  }
});

// Save List
document.getElementById('save-btn')?.addEventListener('click', function() {
  const responseCode = document.getElementById('response-code').value;
  const imageSrc = document.getElementById('searched-image').src; // Get image source URL

  const newList = {
    name: `List for ${responseCode}`,
    responseCodes: [responseCode],
    creationDate: new Date().toLocaleString(),
    imageSrc: imageSrc
  };

  savedLists.push(newList);
  localStorage.setItem('savedLists', JSON.stringify(savedLists));
  alert('List saved successfully!');
  window.location.href = 'lists.html'; // Redirect to lists page
});

// Display Saved Lists in the "My Lists" page
if (document.getElementById('saved-lists')) {
  document.getElementById('saved-lists').innerHTML = savedLists
    .map(list => `
      <li>
        ${list.name} - ${list.creationDate}
        <br>
        <img src="${list.imageSrc}" alt="${list.name}" style="width: 100px; height: 100px; object-fit: cover;" />
        <br>
        <button class="view-btn" data-list="${list.imageSrc}">View</button>
        <button class="delete-btn" data-list="${list.name}">Delete</button>
      </li>
    `)
    .join('');

  // Add event listeners for the view and delete buttons
  document.querySelectorAll('.view-btn').forEach(button => {
    button.addEventListener('click', function() {
      const imageSrc = this.getAttribute('data-list');
      window.open(imageSrc, '_blank'); // Open the image in a new browser tab
    });
  });

  document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', function() {
      const listName = this.getAttribute('data-list');
      deleteList(listName);
    });
  });
}

// Delete List Function
function deleteList(listName) {
  savedLists = savedLists.filter(list => list.name !== listName);
  localStorage.setItem('savedLists', JSON.stringify(savedLists));
  alert(`List "${listName}" deleted`);
  window.location.reload(); // Reload the page to reflect changes
}

// Clear All Lists
document.getElementById('clear-lists')?.addEventListener('click', function() {
  localStorage.removeItem('savedLists');
  savedLists = [];
  alert('All lists cleared!');
  window.location.reload();
});
