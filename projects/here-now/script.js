window.onload = function() {
    // Function to generate a random RGB color
    function getRandomColor() {
    return {
        r: Math.floor(Math.random() * 256),
        g: Math.floor(Math.random() * 256),
        b: Math.floor(Math.random() * 256)
    };
    }

    // Function to calculate brightness of a color
    function calculateBrightness(color) {
        return (color.r * 299 + color.g * 587 + color.b * 114) / 1000;
    }
    // Function to set text color based on brightness
    let docInput = document.getElementById('name');
    let docMail = document.getElementById('email');
    let sbm = document.getElementById('btn-submit');
    function updateTextColor(color1, color2) {
    const contentElement = document.querySelector('body');
      if (!contentElement) return; // Safeguard against null element

    const brightness1 = calculateBrightness(color1);
    const brightness2 = calculateBrightness(color2);
    const averageBrightness = (brightness1 + brightness2) / 2;

      // Adjust text color based on brightness
    contentElement.style.color = averageBrightness > 128 ? 'black' : 'white';
    docInput.style.borderColor = averageBrightness > 128 ? 'black' : 'white';
    docMail.style.borderColor = averageBrightness > 128 ? 'black' : 'white';
    sbm.style.background = averageBrightness > 128 ? 'black' : 'white';
    sbm.style.color = averageBrightness > 128 ? 'white' : 'black';
    }

    // Selecting layers
    const layer1 = document.querySelector('.layer1');
    const layer2 = document.querySelector('.layer2');
    let isLayer1Visible = true;

    // Function to set a random gradient background
    function setRandomBackground() {
    const color1 = getRandomColor();
    const color2 = getRandomColor();
    const gradient = `linear-gradient(135deg, rgb(${color1.r}, ${color1.g}, ${color1.b}), rgb(${color2.r}, ${color2.g}, ${color2.b}))`;

      // Set gradient and toggle visibility
    if (isLayer1Visible) {
        layer2.style.background = gradient;
        layer2.style.opacity = 1;
        layer1.style.opacity = 0;
    } else {
        layer1.style.background = gradient;
        layer1.style.opacity = 1;
        layer2.style.opacity = 0;
    }
    isLayer1Visible = !isLayer1Visible;

      // Update text color based on new gradient colors
    updateTextColor(color1, color2);
    }

    // Set interval for background change
    setInterval(setRandomBackground, 10000);

    // Initial background setup
    setRandomBackground();
};