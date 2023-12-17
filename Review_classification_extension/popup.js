document.addEventListener("DOMContentLoaded", () => {
  const h1 = document.querySelector('.text')
  const toggleSwitch = document.getElementById('toggle-switch')
  const enabledText = 'Turn on extension'
  const disabledText = 'Turn off extension'

  chrome.storage.sync.get('extensionEnabled', (data) => {
    const extensionEnabled = data.extensionEnabled !== false
    toggleSwitch.checked = extensionEnabled
    h1.textContent = extensionEnabled ? enabledText : disabledText
  

    // Update extension state when the switch changes
    toggleSwitch.addEventListener('change', () => {
      const isChecked = toggleSwitch.checked
      chrome.storage.sync.set({ extensionEnabled : isChecked }, () => {
        console.log('Extension is ' + (isChecked ? 'enabled' : 'disabled'));
        h1.textContent = isChecked ? enabledText : disabledText
      })
    })
  })
})