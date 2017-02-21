for (let elm of document.querySelectorAll('p.help a')) {
  elm.addEventListener('click', (event) => {
    browser.tabs.create({url: event.target.href});
    event.preventDefault();
  });
}

let bg = browser.extension.getBackgroundPage();

for (let elm of document.querySelectorAll('p.toggle a')) {
  elm.addEventListener('click', (event) => {
    if (bg.toggle()) {
      event.target.innerText = 'Turn off';
    } else {
      event.target.innerText = 'Turn on';
    }
    event.preventDefault();
  });
}

if (bg.enabled) {
  document.querySelector('p.toggle a').innerText = 'Turn off';
}
