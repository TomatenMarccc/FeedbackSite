const BASE_URL = "https://boschgs.qualtrics.com/jfe/form/SV_4VAM7ROJh5Roguy";

const subjectButtons = document.querySelectorAll('.subject-button');
const expertForm = document.getElementById('expert-form');
const supportForm = document.getElementById('support-form');
const submitButton = document.getElementById('submit-button');

const technologySelect = document.getElementById('technology');
const projectNameInput = document.getElementById('project-name');
const ticketTypeSelect = document.getElementById('ticket-type');
const useCaseInput = document.getElementById('usecase-name');

const technologyError = document.getElementById('technology-error');
const projectError = document.getElementById('project-error');
const ticketError = document.getElementById('ticket-error');
const useCaseError = document.getElementById('usecase-error');

function clearErrors() {
  technologyError.textContent = '';
  projectError.textContent = '';
  ticketError.textContent = '';
  useCaseError.textContent = '';
}

function setActiveSubject(target) {
  subjectButtons.forEach((button) => {
    const isActive = button.dataset.target === target;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-selected', String(isActive));
  });

  if (target === 'expert') {
    expertForm.classList.remove('form--hidden');
    supportForm.classList.add('form--hidden');
  } else {
    supportForm.classList.remove('form--hidden');
    expertForm.classList.add('form--hidden');
  }

  clearErrors();
}

subjectButtons.forEach((button) => {
  button.addEventListener('click', () => {
    setActiveSubject(button.dataset.target);
  });
});

function validateExpertForm() {
  let isValid = true;
  const technology = technologySelect.value.trim();
  const projectName = projectNameInput.value.trim();

  if (!technology) {
    technologyError.textContent = 'Please choose a technology.';
    isValid = false;
  }

  if (projectName.length < 1 || projectName.length > 255) {
    projectError.textContent = 'Enter a project name between 1 and 255 characters.';
    isValid = false;
  }

  return { isValid, technology, projectName };
}

function validateSupportForm() {
  let isValid = true;
  const ticketType = ticketTypeSelect.value.trim();
  const useCaseName = useCaseInput.value.trim();

  if (!ticketType) {
    ticketError.textContent = 'Please choose a ticket type.';
    isValid = false;
  }

  if (useCaseName.length < 1 || useCaseName.length > 255) {
    useCaseError.textContent = 'Enter a use case name between 1 and 255 characters.';
    isValid = false;
  }

  return { isValid, ticketType, useCaseName };
}

function buildExpertUrl(technology, projectName) {
  const params = new URLSearchParams({
    Subject: 'ExpertDelivery',
    ProjectName: projectName,
    Technology: technology,
  });

  return `${BASE_URL}?${params.toString()}`;
}

function buildSupportUrl(ticketType, useCaseName) {
  const params = new URLSearchParams({
    Subject: 'Support',
    UseCaseName: useCaseName,
    TicketType: ticketType,
  });

  return `${BASE_URL}?${params.toString()}`;
}

submitButton.addEventListener('click', () => {
  clearErrors();
  const isExpert = !expertForm.classList.contains('form--hidden');

  if (isExpert) {
    const { isValid, technology, projectName } = validateExpertForm();
    if (!isValid) return;
    const url = buildExpertUrl(technology, projectName);
    window.location.href = url;
  } else {
    const { isValid, ticketType, useCaseName } = validateSupportForm();
    if (!isValid) return;
    const url = buildSupportUrl(ticketType, useCaseName);
    window.location.href = url;
  }
});
