let bg = browser.extension.getBackgroundPage();

function toggle(target) {
  if (bg.toggle()) {
    target.innerText = 'Turn off';
    target.className = 'btn btn-danger';
  } else {
    target.innerText = 'Turn on';
    target.className = 'btn btn-success';
  }
}

for (let elm of document.querySelectorAll('p.toggle a')) {
  elm.addEventListener('click', (event) => {
    toggle(event.target);
    event.preventDefault();
  });
}

if (bg.enabled) {
  document.querySelector('p.toggle a').innerText = 'Turn off';
}

let root = document.getElementsByClassName('apis')[0];

for (let key of Object.keys(bg.apis_grouped).sort()) {
  let api = bg.apis_grouped[key];
  let row = document.createElement('div');
  let input = document.createElement('input');
  input.type = 'checkbox';
  input.checked = api.enabled;
  input.value = key;
  let text = document.createTextNode(` ${key}: ${api.methods.length} event(s) | `);
  let url = document.createElement('a');
  url.href = api.url;
  url.innerText = 'docs';
  url.className = 'external';
  row.appendChild(input);
  row.appendChild(text);
  row.appendChild(url);
  root.appendChild(row);
}

for (let elm of document.getElementsByClassName('external')) {
  elm.addEventListener('click', (event) => {
    browser.tabs.create({url: event.target.href});
    event.preventDefault();
  });
}

for (let elm of document.getElementsByClassName('alarm')) {
  elm.addEventListener('click', (event) => {
    bg.triggerAlarm();
    event.preventDefault();
  });
}

for (let elm of document.getElementsByClassName('storage')) {
  elm.addEventListener('click', (event) => {
    browser.storage.local.set({timestamp: Date.now()});
    event.preventDefault();
  });
}

for (let elm of document.getElementsByClassName('theme')) {
  elm.addEventListener('click', (event) => {
    browser.theme.update({
      images: {
        headerURL: 'transparent.png'
      },
      colors: {
        accentcolor: '#000',
        textcolor: '#fff',
      }
    });
  });
}

for (let elm of document.getElementsByClassName('label')) {
  elm.addEventListener('click', (event) => {
    let state = event.target.dataset.action == "on" ? true : false;
    for (let input of document.querySelectorAll('input[type=checkbox]')) {
      input.checked = state;
      bg.apis_grouped[input.value].enabled = state;
    }
    event.preventDefault();
  });
}

for (let elm of document.querySelectorAll('input[type=checkbox]')) {
  elm.addEventListener('change', (event) => {
    bg.apis_grouped[event.target.value].enabled = event.target.checked;
    console.log(`changed ${event.target.value}`);
    event.preventDefault();
  });
}
