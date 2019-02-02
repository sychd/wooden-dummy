window.onload = main;
const el = (selector, host = document) => host.querySelector(selector) || {};
const els = (selector, host = document) => host.querySelectorAll(selector);
const draggable = ".ball";
const droppable = ".basket";

function main() {
    const ball = el(draggable);
    const baskets = els(droppable);

    ball.addEventListener('dragstart', e => {
        // e.dataTransfer.effectAllowed = 'none'; // no drop :)
        // e.dataTransfer.dropEffect = 'move'; // useless?
        e.dataTransfer.setData('text/html', "☺");
        e.target.classList.add('transparent');
        console.log('dragstart', e, e.dataTransfer);
    });
    ball.addEventListener('dragend', e => {
        e.target.classList.remove('transparent');
        console.log('dragend', e);
    });

    baskets.forEach(b => {
        b.addEventListener('dragover', e => {
            e.preventDefault();
            e.stopImmediatePropagation();
            e.target.classList.add('grow');
            // console.log('dragover', e);
        });
        b.addEventListener('dragleave', e => {
            e.target.classList.remove('grow');
            console.log('dragleave', e);
        });

         b.addEventListener('drop', e => { 
            console.log('b drop', e,  e.dataTransfer);
            e.target.classList.remove('grow');
            e.target.textContent = e.dataTransfer.getData('text/html');
            e.target.appendChild(ball);
        });
    });
}
