browser.devtools.panels.create(
  "Every event Panel",
  "alarm.svg",
  "panel.html"
).then((newPanel) => {
  newPanel.onShown.addListener(initialisePanel);
  newPanel.onHidden.addListener(unInitialisePanel);
});
