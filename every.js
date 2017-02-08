for (let elm of document.getElementsByTagName('a')) {
  elm.addEventListener('click', (event) => {
    browser.tabs.create({url: event.target.href});
    event.preventDefault();
  });
}
