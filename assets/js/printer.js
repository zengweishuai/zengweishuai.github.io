document.addEventListener("DOMContentLoaded", function() {
    const dynamicText = document.querySelector('.dynamic-text');
    const words = ["Humanoid Whole Body Control", "Humanoid Scene/Object Interaction", "Humanoid Cross Embodiement", "Humanoid Zero-shot Transfer from Simulator to Real World"]; // Add your nouns here
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
  
    function typeEffect() {
      const currentWord = words[wordIndex];
  
      if (!isDeleting) {
        // Print the word
        dynamicText.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
  
        if (charIndex === currentWord.length) {
          isDeleting = true;
          setTimeout(typeEffect, 1000); // Wait for 1 second before deleting
        } else {
          setTimeout(typeEffect, 100); // Typing speed
        }
      } else {
        // Delete the word
        dynamicText.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
  
        if (charIndex === 0) {
          isDeleting = false;
          wordIndex = (wordIndex + 1) % words.length; // Move to the next word
          setTimeout(typeEffect, 500); // Wait for 0.5 second before typing the next word
        } else {
          setTimeout(typeEffect, 50); // Deleting speed
        }
      }
    }
  
    // Start the effect
    typeEffect();
  });