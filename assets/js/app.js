require('dotenv').config();
import inputHandler from "./components/InputHandler.js";

window.addEventListener('DOMContentLoaded', function(){
    new inputHandler();
})