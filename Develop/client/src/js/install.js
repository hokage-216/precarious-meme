const butInstall = document.getElementById('buttonInstall');

// Logic for installing the PWA

// Handles the beforeinstallprompt event which fires when the app meets criteria for installation
window.addEventListener('beforeinstallprompt', (event) => {
    // Prevent the mini-infobar from appearing on mobile
    event.preventDefault();

    // Stash the event so it can be triggered later.
    let deferredPrompt = event;

    // Update UI notify the user they can install the PWA
    butInstall.style.display = 'block';

    // Event handler for the install button
    butInstall.addEventListener('click', async () => {
        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;

        // Log analytics about how the user responded to the prompt
        console.log(`User response to the install prompt: ${outcome}`);

        // We've used the prompt, and can't use it again, discard it
        deferredPrompt = null;

        // Hide the install button after the prompt is shown
        butInstall.style.display = 'none';
    });
});

// Event handler for the 'appinstalled' event, which is fired after the app is installed
window.addEventListener('appinstalled', (event) => {
    // Clear the deferredPrompt so it can be garbage collected
    deferredPrompt = null;

    // Log or notify that the app was installed successfully
    console.log('PWA has been installed');
});

