// DOM Elements
const metric_radio_button = document.getElementById("metric");
const imperial_radio_button = document.getElementById("imperial");
const height_input = document.getElementById("height");
const weight_input = document.getElementById("weight");

const metric_input_container = document.querySelector(
  ".bmi-form__input-container"
);
const imperial_input_container = document.querySelector(
  ".imperial-input-container"
);

const metric_input_elements = Array.from(
  document.querySelectorAll(".bmi-form__input-container input")
);
const imperial_input_elements = Array.from(
  document.querySelectorAll(".imperial-input-container input")
);

const unitRadios = document.querySelectorAll('input[name="unit-system"]');

// Regex patterns for input validation
const metricHeightRegex = /^(?:1[3-9]\d|2[0-4]\d|250)$/; // 130-250 cm
const metricWeightRegex = /^(?:[1-9]\d|[1-4]\d\d|500)$/; // 10-500 kg
const imperialHeightFeetRegex = /^[3-8]$/; // 3-8 feet
const imperialHeightInchesRegex = /^(?:\d|1[01])$/; // 0-11 inches
const imperialWeightStoneRegex = /^(?:[5-9]|[1-3]\d|40)$/; // 5-40 stone
const imperialWeightPoundsRegex = /^(?:\d|1[0-3])$/; // 0-13 pounds

// Event Listeners
unitRadios.forEach((radio) => {
  radio.addEventListener("change", toggleUnitSystem);
});

metric_input_elements.forEach((input) =>
  input.addEventListener("input", handleInputChange)
);
imperial_input_elements.forEach((input) =>
  input.addEventListener("input", handleInputChange)
);

// Functions
function toggleUnitSystem() {
  if (metric_radio_button.checked) {
    metric_input_container.classList.remove("hide");
    imperial_input_container.classList.add("hide");
  } else {
    imperial_input_container.classList.remove("hide");
    metric_input_container.classList.add("hide");
  }
  resetForm();
}

function resetForm() {
  const allInputs = [...metric_input_elements, ...imperial_input_elements];
  allInputs.forEach((input) => {
    input.value = "";
    show_or_hide_error(input);
  });
  hideResult();
}

function show_or_hide_error(element, message) {
  const parent = element.closest(".form__group") || element.parentElement;
  const errorSpan = parent.querySelector("span[id='measurement-error']");

  if (message) {
    errorSpan.textContent = message;
    errorSpan.classList.add("error-message");
    element.setAttribute("aria-invalid", "true");
  } else {
    errorSpan.textContent = "";
    errorSpan.classList.remove("error-message");
    element.setAttribute("aria-invalid", "false");
  }
}
// xx
function hideResult() {
  const resultContainer = document.querySelector(".bmi-form__result");
  const welcomeContainer = document.querySelector(
    ".bmi-form__result:not(.hide)"
  );
  resultContainer.classList.add("hide");
  welcomeContainer.classList.remove("hide");
}

function validate_metric_inputs() {
  let isValid = true;
  metric_input_elements.forEach((input_el) => {
    switch (input_el.id) {
      case "height":
        if (!metricHeightRegex.test(input_el.value.trim())) {
          show_or_hide_error(
            input_el,
            "Please provide a valid height in cm (130-250)"
          );
          isValid = false;
        } else {
          show_or_hide_error(input_el);
        }
        break;
      case "weight":
        if (!metricWeightRegex.test(input_el.value.trim())) {
          show_or_hide_error(
            input_el,
            "Please provide a valid weight in kg (10-500)"
          );
          isValid = false;
        } else {
          show_or_hide_error(input_el);
        }
        break;
    }
  });
  return isValid;
}

function validate_imperial_inputs() {
  let isValid = true;
  imperial_input_elements.forEach((input_el) => {
    switch (input_el.id) {
      case "height-ft":
        if (!imperialHeightFeetRegex.test(input_el.value.trim())) {
          show_or_hide_error(
            input_el,
            "Please provide a valid height in feet (3-8)"
          );
          isValid = false;
        } else {
          show_or_hide_error(input_el);
        }
        break;
      case "height-in":
        if (!imperialHeightInchesRegex.test(input_el.value.trim())) {
          show_or_hide_error(
            input_el,
            "Please provide a valid height in inches (0-11)"
          );
          isValid = false;
        } else {
          show_or_hide_error(input_el);
        }
        break;
      case "weight-st":
        if (!imperialWeightStoneRegex.test(input_el.value.trim())) {
          show_or_hide_error(
            input_el,
            "Please provide a valid weight in stones (5-40)"
          );
          isValid = false;
        } else {
          show_or_hide_error(input_el);
        }
        break;
      case "weight-lbs":
        if (!imperialWeightPoundsRegex.test(input_el.value.trim())) {
          show_or_hide_error(
            input_el,
            "Please provide a valid weight in pounds (0-13)"
          );
          isValid = false;
        } else {
          show_or_hide_error(input_el);
        }
        break;
    }
  });
  return isValid;
}

function calculateMetricBMI(height, weight) {
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
}

function calculateImperialBMI(feet, inches, stones, pounds) {
  const heightInInches = feet * 12 + inches;
  const weightInPounds = stones * 14 + pounds;
  return (703 * weightInPounds) / (heightInInches * heightInInches);
}

function getBMICategory(bmi) {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Healthy weight";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

function calculateIdealWeightRange(height, unit) {
  let minWeight, maxWeight;
  if (unit === "metric") {
    const heightInMeters = height / 100;
    minWeight = 18.5 * heightInMeters * heightInMeters;
    maxWeight = 24.9 * heightInMeters * heightInMeters;
    return `${minWeight.toFixed(1)}kg - ${maxWeight.toFixed(1)}kg`;
  } else {
    const heightInInches = height;
    minWeight = (18.5 * (heightInInches * heightInInches)) / 703;
    maxWeight = (24.9 * (heightInInches * heightInInches)) / 703;
    return `${minWeight.toFixed(1)}lbs - ${maxWeight.toFixed(1)}lbs`;
  }
}

function handleInputChange() {
  let isValid, bmi, idealWeightRange;

  if (metric_radio_button.checked) {
    isValid = validate_metric_inputs();
    if (isValid && height_input.value && weight_input.value) {
      bmi = calculateMetricBMI(
        parseFloat(height_input.value),
        parseFloat(weight_input.value)
      );
      idealWeightRange = calculateIdealWeightRange(
        parseFloat(height_input.value),
        "metric"
      );
      displayResult(bmi, idealWeightRange);
    }
  } else {
    isValid = validate_imperial_inputs();
    const heightFt = document.getElementById("height-ft");
    const heightIn = document.getElementById("height-in");
    const weightSt = document.getElementById("weight-st");
    const weightLb = document.getElementById("weight-lbs");

    if (
      isValid &&
      heightFt.value &&
      heightIn.value &&
      weightSt.value &&
      weightLb.value
    ) {
      bmi = calculateImperialBMI(
        parseFloat(heightFt.value),
        parseFloat(heightIn.value),
        parseFloat(weightSt.value),
        parseFloat(weightLb.value)
      );
      const totalHeightInInches =
        parseFloat(heightFt.value) * 12 + parseFloat(heightIn.value);
      idealWeightRange = calculateIdealWeightRange(
        totalHeightInInches,
        "imperial"
      );
      displayResult(bmi, idealWeightRange);
    }
  }

  if (!isValid) {
    hideResult();
  }
}

function displayResult(bmi, idealWeightRange) {
  const resultContainer = document.querySelector(".bmi-form__result");
  const welcomeContainer = document.querySelector(
    ".bmi-form__result:not(.hide)"
  );
  const bmiValue = document.getElementById("bmi-count");
  const bmiCategory = getBMICategory(bmi);

  bmiValue.textContent = bmi.toFixed(1);
  resultContainer.querySelector(
    ".bmi-form__result-interpretation"
  ).textContent =
    `Your BMI suggests you're ${bmiCategory.toLowerCase()}. ` +
    `Your ideal weight range is ${idealWeightRange}.`;

  welcomeContainer.classList.add("hide");
  resultContainer.classList.remove("hide");
}

// Initial setup
toggleUnitSystem();
