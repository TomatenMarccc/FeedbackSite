const BASE_URL = "https://boschgs.qualtrics.com/jfe/form/SV_4VAM7ROJh5Roguy";

const subjectButtons = document.querySelectorAll('.subject-button');
const expertForm = document.getElementById('expert-form');
const supportForm = document.getElementById('support-form');
const openButton = document.getElementById('submit-button');

const technologySelect = document.getElementById('technology');
const projectNameInput = document.getElementById('project-name');
const ticketTypeSelect = document.getElementById('ticket-type');
const useCaseInput = document.getElementById('usecase-name');
const linkInput = document.getElementById('generated-link');
const copyButton = document.getElementById('copy-button');

const technologyError = document.getElementById('technology-error');
const projectError = document.getElementById('project-error');
const ticketError = document.getElementById('ticket-error');
const useCaseError = document.getElementById('usecase-error');
const copyTextNode = document.querySelector('#copy-button .copy-button__text');
const copyDefaultText = 'Copy';
const copySuccessText = 'Copied';
let generateTimeout = null;
let lastGeneratedLink = '';

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
  linkInput.value = '';
  lastGeneratedLink = '';
  resetCopyStatus();
  if (generateTimeout) {
    clearTimeout(generateTimeout);
    generateTimeout = null;
  }
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

function setCopyStatusCopied() {
  if (copyTextNode) copyTextNode.textContent = copySuccessText;
}

function resetCopyStatus() {
  if (copyTextNode) copyTextNode.textContent = copyDefaultText;
}

function copyLink() {
  let link = linkInput.value.trim();
  if (!link) {
    link = generateLink({ open: false });
  }
  if (!link) return;

  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(link).then(setCopyStatusCopied).catch(() => {
      linkInput.select();
      const success = document.execCommand('copy');
      if (success) setCopyStatusCopied();
    });
  } else {
    linkInput.select();
    const success = document.execCommand('copy');
    if (success) setCopyStatusCopied();
  }
}

function generateLink({ open = false } = {}) {
  clearErrors();
  const isExpert = !expertForm.classList.contains('form--hidden');
  let url = '';

  if (isExpert) {
    const { isValid, technology, projectName } = validateExpertForm();
    if (!isValid) {
      linkInput.value = '';
      lastGeneratedLink = '';
      resetCopyStatus();
      return '';
    }
    url = buildExpertUrl(technology, projectName);
  } else {
    const { isValid, ticketType, useCaseName } = validateSupportForm();
    if (!isValid) {
      linkInput.value = '';
      lastGeneratedLink = '';
      resetCopyStatus();
      return '';
    }
    url = buildSupportUrl(ticketType, useCaseName);
  }

  if (url !== lastGeneratedLink) {
    resetCopyStatus();
  }
  linkInput.value = url;
  lastGeneratedLink = url;
  if (open) {
    window.open(url, '_blank', 'noopener');
  }

  return url;
}

copyButton.addEventListener('click', copyLink);
openButton.addEventListener('click', () => generateLink({ open: true }));

function scheduleGenerate() {
  if (generateTimeout) {
    clearTimeout(generateTimeout);
  }
  generateTimeout = setTimeout(() => {
    generateLink({ open: false });
    generateTimeout = null;
  }, 500);
}

technologySelect.addEventListener('change', scheduleGenerate);
projectNameInput.addEventListener('input', scheduleGenerate);
ticketTypeSelect.addEventListener('change', scheduleGenerate);
useCaseInput.addEventListener('input', scheduleGenerate);
