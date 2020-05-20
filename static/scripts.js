function hello() {
    const txt = document.querySelector('h1').innerHTML;

    if (txt === 'This is my home page!') {
        document.querySelector('h1').innerHTML = 'Welcome to my website!';
    } else {
        document.querySelector('h1').innerHTML = 'This is my home page!';
    }
}