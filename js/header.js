$(document).ready(function() {

'use strict';

const headernav = document.querySelector('header');

fetch('component-header.html')
    .then(res=>res.text())
    .then(data=>{
        headernav.innerHTML=data;
    });   
});