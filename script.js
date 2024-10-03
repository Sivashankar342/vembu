document.getElementById("loginButton").addEventListener("click", function () {
  login();
});

document.getElementById("getWeather").addEventListener("click", function () {
  getWeather();
});

document.getElementById("startVoice").addEventListener("click", function () {
  startVoiceRecognition();
});

function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // For simplicity, using hardcoded credentials.
  if (username === "nithish kumar" && password === "siva") {
    document.getElementById("loginContainer").style.display = "none";
    document.getElementById("weatherContainer").style.display = "block";
  } else {
    document.getElementById("loginMessage").innerText =
      "Invalid username or password.";
  }
}

function getWeather(city) {
  if (!city) {
    city = document.getElementById("city").value;
  }

  const apiKey = "a877487b99a067943e262f7fac8cdf2c"; // Replace with your OpenWeatherMap API key
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  // Log the city and API URL for debugging
  console.log(`Fetching weather data for: ${city}`);
  console.log(`API URL: ${url}`);

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      let weatherHtml;
      if (data.cod === 200) {
        const weatherDescription = data.weather[0].description;
        const temperature = data.main.temp;
        const humidity = data.main.humidity;
        let additionalInfo = "";

        // Check if the city is Chennai
        if (city.toLowerCase() === "chennai") {
          additionalInfo = `
            <h3>Guidelines During Floods in Chennai</h3>
            <ul>
              <li><strong>Evacuation Orders:</strong> Residents in low-lying or flood-prone areas are often advised to evacuate to safer places.</li>
              <li><strong>Emergency Contacts:</strong> Keep emergency contact numbers handy.</li>
              <li><strong>Relief Camps:</strong> The government sets up relief camps in safe zones.</li>
              <li><strong>Safety Precautions:</strong> Avoid wading through floodwaters.</li>
              <li><strong>Health Precautions:</strong> Watch for signs of waterborne diseases.</li>
              <li><strong>Communication:</strong> Keep mobile phones charged.</li>
              <li><strong>Transportation:</strong> Avoid unnecessary travel.</li>
              <li><strong>After the Flood:</strong> Do not return to your home until authorities declare it safe.</li>
            </ul>
            <h3>Unaffected Areas During Heavy Rain in Chennai</h3>
            <p>The following areas are generally less affected during heavy rain in Chennai:</p>
            <ul>
              <li>Ekkattuthangal</li>
              <li>Guindy</li>
              <li>Arumbakkam</li>
              <li>Anna Main Road in KK Nagar</li>
              <li>Ramapuram</li>
              <li>Manapakkam</li>
              <li>Madipakkam</li>
              <li>Puzhuthivakkam</li>
            </ul>
          `;
        }

        weatherHtml = `
          <h2>Weather in ${city}</h2>
          <p>Description: ${weatherDescription}</p>
          <p>Temperature: ${temperature}°C</p>
          <p>Humidity: ${humidity}%</p>
          ${additionalInfo}
        `;
        speak(
          `The weather in ${city} is ${weatherDescription} with a temperature of ${temperature} degrees Celsius and humidity of ${humidity} percent.`
        );
      } else {
        weatherHtml = `<p>City not found. Please try again.</p>`;
        speak("City not found. Please try again.");
      }
      document.getElementById("weatherResult").innerHTML = weatherHtml;
    })
    .catch((error) => {
      console.error("Error:", error);
      document.getElementById(
        "weatherResult"
      ).innerHTML = `<p>There was an error fetching the weather data: ${error.message}</p>`;
      speak(`There was an error fetching the weather data: ${error.message}`);
    });
}

function startVoiceRecognition() {
  const recognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition)();

  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  recognition.onresult = (event) => {
    let city = event.results[0][0].transcript;

    // Trim leading/trailing spaces and remove any trailing period (dot)
    city = city.trim().replace(/\.$/, "");

    document.getElementById("city").value = city;
    getWeather(city);
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    speak("Sorry, I didn't catch that. Please try again.");
  };

  recognition.onend = () => {
    console.log("Speech recognition service has ended.");
    speak("Speech recognition has ended. You can try again.");
  };
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
}
