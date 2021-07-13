document.getElementById("Click me").onclick = function () {
    alert("You clicked the button");
}

document.getElementById("toSecondPage").onclick = function () {
    window.location.href = 'secondpage';
}
document.getElementById("toMap").onclick = function () {
    window.location.href = 'map';
}