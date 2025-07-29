import { createOptimizedPicture } from '../../../../scripts/aem.js';
import { subscribe } from '../../rules/index.js';

function populateCards(cardsData, element) {
  // Create a container for the cards
  const cardsContainer = document.createElement('div');
  cardsContainer.className = 'card-choice-container';
  // Create a radio group name
  const radioName = `card-choice-group-${Math.random().toString(36).substr(2, 9)}`;

  cardsData.forEach((card, idx) => {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card-choice-card';
    // Radio input
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = radioName;
    radio.dataset.fieldType = 'radio-group';
    radio.dataset.index = idx;
    radio.className = 'card-choice-radio';
    if (idx === 0) radio.checked = true;

    // Creating the details of each card
    const featuresList = document.createElement('ul');
    featuresList.className = 'card-choice-features';
    Object.entries(card).forEach(([key, value]) => {
      const feature = document.createElement('li');
      feature.className = 'card-choice-feature';
      if(key === 'image-path') {
        const img = createOptimizedPicture(value);
        feature.appendChild(img);
      } else if(key === 'benefits') {
      // Split the value at commas, trim, and create bullets
      const benefits = value.split(',').map(b => b.trim()).filter(Boolean);
      const benefitsUl = document.createElement('ul');
      benefitsUl.className = 'card-choice-benefits-list';
      benefits.forEach(benefit => {
        const li = document.createElement('li');
        li.textContent = benefit;
        benefitsUl.appendChild(li);
      });
      feature.appendChild(benefitsUl);

      }else {
        feature.innerHTML = `</span> <span class='feature-value'>${value}</span>`;
      }
      featuresList.appendChild(feature);
    });
    cardDiv.appendChild(radio);
    cardDiv.appendChild(featuresList);

    cardsContainer.appendChild(cardDiv);
  });

  element.innerHTML = '';
  element.appendChild(cardsContainer);
}

export default function decorate(element, fieldJson, container, formId) {

  // subscribing to model changes to populate the cards
  subscribe(element, formId, (fieldDiv, fieldModel) => {
    fieldModel.subscribe((e) => {
      const { payload } = e;
      payload?.changes?.forEach((change) => {
        const { propertyName, currentValue } = change;
        if (propertyName === 'enum') {
          populateCards(currentValue, element);
          fieldModel.value = fieldModel.enum?.[0]; // set the first value as the default value
        }
      });
    });

    element.addEventListener('change', (e) => {
      e.stopPropagation();
      const value = fieldModel.enum?.[parseInt(e.target.dataset.index, 10)];
      fieldModel.value = value;
    });
  });

  return element;
}