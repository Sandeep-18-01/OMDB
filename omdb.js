// Function to fetch movie data based on a search goal and display results
function findMovies() {
  searchMovies(val.value);
}

async function searchMovies(goal) {
  let response = await fetch(
    `https://www.omdbapi.com/?s=${goal}&apikey=40e2f22d`
  );
  let data = await response.json();

  // Check if the data object contains the "Search" property and if it's an array
  if (Array.isArray(data.Search)) {
    let searchResults = data.Search;
    const itemList = document.getElementById("itemList");
    itemList.innerHTML = ""; // Clear previous results

    const inputValue = document.getElementById("val").value;

    for (const item of searchResults) {
      if (inputValue.trim() !== "") {
        // Create a list item
        const listItem = document.createElement("li");

        // Create a button to add to the favorite list
        const addToFavoritesButton = document.createElement("button");
        addToFavoritesButton.textContent = "Add to Favorites";
        addToFavoritesButton.setAttribute("id", item.imdbID);
        addToFavoritesButton.setAttribute("movie", item.Title);
        addToFavoritesButton.addEventListener("click", function () {
          addToFavorites(item.imdbID, item.Title);
        });

        // Create a button to display movie details
        const viewDetailsButton = document.createElement("button");
        viewDetailsButton.textContent = "View Details";
        viewDetailsButton.setAttribute("id", item.imdbID);
        viewDetailsButton.addEventListener("click", function () {
          displayMovieData(item.imdbID);
        });

        // Create a span element to display the movie title
        const titleSpan = document.createElement("span");
        titleSpan.textContent = item.Title;

        // Append buttons and title to the list item
        listItem.appendChild(titleSpan);
        listItem.appendChild(addToFavoritesButton);
        listItem.appendChild(viewDetailsButton);

        for (let i = 0; i < 2; i++) {
          const lineBreak = document.createElement("br");
          itemList.appendChild(lineBreak);
        }

        // Append the list item to the unordered list
        itemList.appendChild(listItem);
      } else {
        itemList.innerHTML = "";
      }
    }
  } else {
    itemList.innerHTML = "";
  }
}

// Function to display movie details when a movie title button is clicked
async function displayMovieData(gone) {
  alert("Go down to show details");
  // Show the container for movie details and description
  showContainer();
  showDescription();

  // Fetch detailed movie data based on the IMDb ID from the clicked button
  let response = await fetch(
    `https://www.omdbapi.com/?i=${gone}&apikey=40e2f22d`
  );
  let data = await response.json();

  // Get the element to display movie details
  const movieDetailsElement = document.getElementById("movieDetails");
  movieDetailsElement.innerHTML = ""; // Clear previous details

  // Create a container for movie details
  const movieDiv = document.createElement("div");
  let count = 0;

  // Loop through the movie data properties and create spans for each
  for (const key in data) {
    const propertySpan = document.createElement("span");
    propertySpan.textContent = `${key}: ${data[key]}`;

    // Handle the movie poster separately
    if (key === "Poster") {
      const imageElement = document.querySelector(".image");
      imageElement.innerHTML = ""; // Clear previous image
      const img = document.createElement("img");

      if (data[key] != "N/A") {
        img.src = data[key];
      } else {
        // If data[key] is empty or not a valid image URL, It goes to this URL
        img.src =
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPple0XLVI1C5Qk6WZRtHEvgc8Ns7_CW09qeC3IlzUIw&s";
      }
      imageElement.appendChild(img);
      continue;
    }

    const lineBreak = document.createElement("br");

    // Add line breaks for formatting
    if (count % 4 === 0) {
      for (let i = 0; i < 2; i++) {
        const lineBreak = document.createElement("br");
        movieDiv.appendChild(lineBreak);
      }
    }
    count++;

    // Append the property and line break to the movie details container
    movieDiv.appendChild(propertySpan);
    movieDiv.appendChild(lineBreak);
  }

  // Append the movie details container to the movieDetailsElement
  movieDetailsElement.appendChild(movieDiv);
}

// Function to show the movie details container
function showContainer() {
  const container = document.querySelector(".container");
  container.style.display = "flex"; // Show the container by changing the display property to 'flex'
}

function hideContainer() {
  const container = document.querySelector(".container");
  container.style.display = "none"; // Hide the container by changing the display property to 'none'
}

// Function to show the movie description container
function showDescription() {
  const container = document.querySelector(".description");
  container.style.visibility = "visible"; // Show the container by changing the visibility property
}

// Function to initiate the movie search when the user types in the search input

// Load the wishlist from localStorage
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

// Function to save the wishlist to localStorage
function saveWishlist() {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

// Function to add a movie to the wishlist
function addToFavorites(movieId, movieName) {
  wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  hideContainer();
  const movie = wishlist.find((item) => item.id === movieId);
  if (!movie) {
    wishlist.push({ movie_name: movieName, id: movieId });
    saveWishlist(); // Save the updated wishlist after adding the movie
    alert("Movie added to your list");
  } else {
    alert("Movie is already in your list");
  }
}

// Function to remove a movie from the wishlist
function removeFromFavorites(movieId) {
  const index = wishlist.findIndex((item) => item.id === movieId);
  if (index !== -1) {
    wishlist.splice(index, 1);
    saveWishlist(); // Save the updated wishlist
    alert("Movie removed from your list");
  }
  showWishlist();
}

// Function to display the wishlist
function showWishlist() {
  hideContainer();
  const wishlistData = localStorage.getItem("wishlist");

  // Parse the JSON or use an empty array if it's null
  const wishlist = JSON.parse(wishlistData || "[]");

  if (wishlist.length === 0) {
    alert("Wishlist is empty");
  }

  const itemList = document.getElementById("itemList");
  itemList.innerHTML = "";
  if (wishlist.length !== 0) {
    itemList.innerHTML = `<button onclick="clearLocalStorage()">Delete all</button>`;
  }

  for (let i = 0; i < wishlist.length; ++i) {
    itemList.innerHTML += `<div class="wishlist-item">
        <button onclick="show('${wishlist[i].id}')">${wishlist[i].movie_name}</button>
        <button class="delete-button" onclick="removeFromFavorites('${wishlist[i].id}')">Delete</button>
      </div>`;
    itemList.innerHTML += "<br>";
  }
}

async function show(movieId) {
  hideContainer();
  const movie = wishlist.find((item) => item.id === movieId);
  if (movie) {
    displayMovieData(movieId);
  }
}

function clearLocalStorage() {
  localStorage.clear();
  showWishlist();
}
