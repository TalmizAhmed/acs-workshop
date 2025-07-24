/**
 * Custom number-rating component
 * Based on: Radio Group
 */

/**
 * Decorates a custom form field component
 * @param {HTMLElement} fieldDiv - The DOM element containing the field wrapper.
 * Refer to the documentation for its structure for each component.
 * @param {Object} fieldJson - The form json object for the component.
 */
export default async function decorate(fieldDiv) {
  // Find all radio wrappers
  const radioWrappers = fieldDiv.querySelectorAll('.radio-wrapper');

  if (radioWrappers.length === 0) {
    // console.warn('No radio wrappers found in number-rating component');
    return fieldDiv;
  }

  // Create a container for the rating buttons
  const ratingContainer = document.createElement('div');
  ratingContainer.className = 'rating-container';

  // Move all radio wrappers into the rating container
  radioWrappers.forEach((wrapper) => {
    ratingContainer.appendChild(wrapper);
  });

  // Create labels container
  const labelsContainer = document.createElement('div');
  labelsContainer.className = 'rating-labels';

  // Add descriptive labels
  const leftLabel = document.createElement('span');
  leftLabel.className = 'label-text';
  leftLabel.textContent = 'Not likely';

  const middleLabel = document.createElement('span');
  middleLabel.className = 'label-text';
  middleLabel.textContent = 'May be';

  const rightLabel = document.createElement('span');
  rightLabel.className = 'label-text';
  rightLabel.textContent = 'Very likely';

  labelsContainer.appendChild(leftLabel);
  labelsContainer.appendChild(middleLabel);
  labelsContainer.appendChild(rightLabel);

  // Find the legend (question text) and insert containers after it
  const legend = fieldDiv.querySelector('legend');
  if (legend) {
    // Insert rating container after legend
    legend.insertAdjacentElement('afterend', ratingContainer);
    // Insert labels container after rating container
    ratingContainer.insertAdjacentElement('afterend', labelsContainer);
  } else {
    // Fallback: append to fieldDiv
    fieldDiv.appendChild(ratingContainer);
    fieldDiv.appendChild(labelsContainer);
  }

  // Add event listeners for better UX
  radioWrappers.forEach((wrapper) => {
    const input = wrapper.querySelector('input[type="radio"]');
    const label = wrapper.querySelector('label');

    if (input && label) {
      // Add hover effects and accessibility
      label.addEventListener('mouseenter', () => {
        label.style.transform = 'scale(1.02)';
      });

      label.addEventListener('mouseleave', () => {
        if (!input.checked) {
          label.style.transform = 'scale(1)';
        }
      });

      // Add keyboard navigation
      input.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          e.preventDefault();
          const currentIndex = Array.from(radioWrappers).indexOf(wrapper);
          let nextIndex;

          if (e.key === 'ArrowLeft') {
            nextIndex = currentIndex > 0 ? currentIndex - 1 : radioWrappers.length - 1;
          } else {
            nextIndex = currentIndex < radioWrappers.length - 1 ? currentIndex + 1 : 0;
          }

          const nextInput = radioWrappers[nextIndex].querySelector('input[type="radio"]');
          if (nextInput) {
            nextInput.focus();
            nextInput.checked = true;
            nextInput.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }
      });
    }
  });

  return fieldDiv;
}
