$(document).ready(function() {

    'use strict';

const footernav = document.querySelector('footer');

fetch('component-footer.html')
    .then(res=>res.text())
    .then(data=>{
        footernav.innerHTML=data;
    });
});