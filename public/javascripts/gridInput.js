const srcButton = document.getElementById('setSource');
const destButton = document.getElementById('setDest');
const startButton = document.getElementById('start');
const wallButton =  document.getElementById('setWall');
const resetButton = document.getElementById('reset');

const mazeCheckbox = document.getElementById('mazeTick');

const sizeTextBox = document.getElementById('sizeBox');

const gridButtonContainer = document.getElementById('gridButtons');

srcButton.onclick = () => {
    if(state.get() === 'doneCalc')
        initGrid();
    state.set('setSource');
    deactivateButtons(gridButtonContainer);
    srcButton.setAttribute('class', 'active');
}
destButton.onclick = () => {
    if(state.get() === 'doneCalc')
        initGrid();
    state.set('setDest');
    deactivateButtons(gridButtonContainer);
    destButton.setAttribute('class', 'active');
}
wallButton.onclick = () => {
    if(state.get() === 'doneCalc')
        initGrid();
    state.set('setWall');
    deactivateButtons(gridButtonContainer);
    wallButton.setAttribute('class', 'active');
}
startButton.onclick = () => {
    state.set('start');
    onStart();
    deactivateButtons(gridButtonContainer);
}
resetButton.onclick = () => {
    state.set('none');
    initGrid();
    deactivateButtons(gridButtonContainer);
}
mazeCheckbox.onclick = () => {
    mazeCheckbox.checked.toggle;
}
function deactivateButtons(container) {
    for(let i = 0; i < container.children.length; i++)
    {
        container.children[i].setAttribute('class', 'button');
    }
}