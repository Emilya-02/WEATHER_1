const link =
  "http://api.weatherstack.com/current?access_key=49e9d7cdd7f21b52f89cf6290ac2be22";

// Возвращает ссылку на элемент по его идентификатору
const root1 = document.getElementById("root1");
const root2 = document.getElementById("root2");
const choose = document.getElementById("choose");
const form = document.getElementById("form");

let store = {
  city: "Kazan",
  temperature: 0,
  localtime: "00:00 AM",
  description: "",
  windSpeed: 0,
  humidity: 0,
  visibility: 0,
  pressure: 0,
};

async function fetchData() {
    let result = await fetch(`${link}&query=${store.city}`); // Интерфейс Fetch API позволяет веб-браузеру выполнять HTTP-запросы к веб-серверам
    let data = await result.json();   // читаем ответ в формате json

    console.log(data);  // выведем получаемые данные

    let {
      current: {
        temperature,
        humidity,
        pressure,
        visibility,
        weather_descriptions: description,
        wind_speed: windSpeed,
      },
      location: {
        localtime,
        name: city,
      }
    } = data; //data конкретно разбита на переменные(берем элементы из data)

    // при получении данных кладем их в store
    store = {
      city: city,
      pressure: pressure,
      temperature: temperature,
      humidity: humidity,
      localtime: localtime,
      visibility: visibility,
      windSpeed: windSpeed,
      description: description[0], // берем первый элемент у массива
    };

    renderComponent();
};

function get_image(description) {
   let value = description.toLowerCase();

   switch (value) {
     case "partly cloudy":
       return "cloud_sun.png";
     case "light snow":
       return "cloud_snow.png";
     case "overcast":
       return "cloud_sun.png";
     case "sunny":
       return "sun.png";
     case "cloud":
       return "cloud.png";
     case "snow":
         return "snow.png";
     case "light snow, snow":
           return "snow.png";
     case "fog":
           return "fog.png";
     case "rainny":
           return "rain.png";
     case "thunderstorm":
           return "cloud_storm.png";
     case "clear":
           return "sun.png";
     default:
       return "cloud_sun.png";
   }
 };

 function get_details() {
   const { windSpeed, humidity, visibility, pressure, } = store;

       return `<div class="details">
     <div class="details_row">
         <div class="details_item">
             <div class="details_name">Wind status</div>
             <div class="details_value"><b>${windSpeed}</b> mph</div>
         </div>

         <div class="details_item">
             <div class="details_name">Humidity</div>
             <div class="details_value"><b>${humidity}</b> %</div>
         </div>
     </div>


     <div class="details_row">
         <div class="details_item">
             <div class="details_name">Visibility</div>
             <div class="details_value"><b>${visibility}</b> miles</div>
         </div>

         <div class="details_item">
             <div class="details_name">Air Pressure</div>
             <div class="details_value"><b>${pressure}</b> mb</div>
         </div>
     </div>
 </div>`;
 };

 function left_show() {
   const { description, temperature, localtime, city,  } = store;

   return `<div class="left">
       <div class="header_1" id="city" >Search for places</div>
       <img class="left_icon" src="./img/${get_image(description)}" alt="/" />
       <div class="left_temp"><b>${temperature}</b></div>
       <div class="left_sostoyanie">${description}</div>
       <div class="left_today">${localtime}</div>
       <div class="left_city">${city}</div>
           </div>`;
 };

function renderComponent() {
  root1.innerHTML = left_show();           // в root1 добавляем ф-ию left_show
  root2.innerHTML = get_details();   // в root2 добавляем ф-ию get_details

  // ищем по индексу после markup, тк в нем находится id city
  const city = document.getElementById("city");  // Возвращает ссылку на элемент по его идентификатору
  city.addEventListener('click', Click);    // кликаем на search в шапке
};

function Click() {                     // отображаем блок choosing_city
  choose.classList.toggle('active');   // метод .toggle() позволяет отобразить или скрыть выбранные элементы
};

function write_city(e) {
  store = {
    ... store,
    city: e.target.value,
  };
};

function click_submit(e) {
  // click на кнопке с type="submit" или нажатие Enter внутри поля формы вызывает событие submit и отправляет форму на сервер
  // чтобы отменить стандартные действия браузера используем метод preventDefault или return false
  // способ (return false) не будет работать, если обработчик назначен через метод addEventListener()
  e.preventDefault();
  console.log(store.city);
  fetchData();
  Click();    // скрываем блок choosing_city c помощью toggle()
}

text_input.addEventListener("input", write_city);
form.addEventListener("submit", click_submit);

fetchData();
