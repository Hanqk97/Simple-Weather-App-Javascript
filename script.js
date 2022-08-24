const wrapper = document.querySelector(".wrapper"),
inputPart = wrapper.querySelector(".input-part"),
infoTxt = inputPart.querySelector(".info-txt"),
inputField = inputPart.querySelector("input");

locationBtn = inputPart.querySelector("button");

weatherIcon = document.querySelector(".weather-part img");

arrowBack = wrapper.querySelector("header i");

let api;

inputField.addEventListener("keyup", e =>{
    //if user pressed enter btn and input value is not empty.
    if(e.key == "Enter" && inputField.value != ""){
        // console.log("enter test");
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener("click",()=>{
    if(navigator.geolocation){//if browser support geolocation api
        navigator.geolocation.getCurrentPosition(onSuccess,onError);
    }else{
        alert("The browser not support geolocation api");
    }
})

function onSuccess(position){
    // console.log(position);
    //get user locations's lat and lon and send them back to openweather api
    const {latitude, longitude} = position.coords;
    //add "&units=metric" to change return data's temp degree
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=ad305704e53b2187892f4966af7c4f75`;
    fetchData();
}

function onError(error){
    // console.log(error);
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

function requestApi(city){
    // console.log(city); city is variable in following line, notice ` not '
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=ad305704e53b2187892f4966af7c4f75`;
    fetchData();
}

function fetchData(){
    //getting api response and returning it with parsing into js obj and in another
    //then function calling weatherDetails function with passing api result as an argument
    infoTxt.innerText = "Getting weather details...";
    infoTxt.classList.add("pending");
    fetch(api).then(response => response.json()).then(result => weatherDetails(result));
}

function weatherDetails(info){
    infoTxt.classList.replace("pending", "error");
    if(info.cod == "404"){
        infoTxt.innerText = `${inputField.value} isn't a valid city name`;
    }else{
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {feels_like, humidity, temp} = info.main;

        if(id == 800){
            weatherIcon.src = "Weather Icons/clear.svg";
        }else if(id >= 200 && id <= 232){
            weatherIcon.src = "Weather Icons/storm.svg";  
        }else if(id >= 600 && id <= 622){
            weatherIcon.src = "Weather Icons/snow.svg";
        }else if(id >= 701 && id <= 781){
            weatherIcon.src = "Weather Icons/haze.svg";
        }else if(id >= 801 && id <= 804){
            weatherIcon.src = "Weather Icons/cloud.svg";
        }else if((id >= 500 && id <= 531) || (id >= 300 && id <= 321)){
            weatherIcon.src = "Weather Icons/rain.svg";
        }

        //pass these values to html elements
        wrapper.querySelector(".temp .num").innerText = Math.floor(temp);
        wrapper.querySelector(".weather").innerText = description;
        wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
        wrapper.querySelector(".temp .num-2").innerText = Math.floor(feels_like); 
        wrapper.querySelector(".humidity span").innerText = `${humidity}%`; 

        infoTxt.classList.remove("pending", "error");
        wrapper.classList.add("active");
        console.log(info);
    }
}

arrowBack.addEventListener("click", ()=>{
    wrapper.classList.remove("active");
})
