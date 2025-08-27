// clear localStorage on page load
window.addEventListener("load", () => {
  localStorage.clear();
});

// Internet Moguls Landing Page JavaScript

$(document).ready(function () {
  // Initialize page
  initializePage();

  // Challenge card selection
  initializeChallengeCards();

  // Reflection questions
  initializeReflectionQuestions();

  // Form handling
  initializeFormHandling();

  // Smooth scrolling
  initializeSmoothScrolling();

  // Scroll animations
  initializeScrollAnimations();
});

// Initialize page functionality
function initializePage() {
  // Add loading class removal after page load
  setTimeout(function () {
    $("body").removeClass("loading");
  }, 500);
}

// Challenge card selection functionality
function initializeChallengeCards() {
  let selectedChallenges = [];

  $(".challenge-card").on("click", function () {
    const challengeId = $(this).data("challenge");

    if ($(this).hasClass("selected")) {
      // Deselect
      $(this).removeClass("selected");
      selectedChallenges = selectedChallenges.filter(
        (id) => id !== challengeId
      );
    } else {
      // Select
      $(this).addClass("selected");
      selectedChallenges.push(challengeId);
    }

    // Update button state
    updateChallengesButton(selectedChallenges.length);
  });
}

function updateChallengesButton(count) {
  const button = $("#challengesCTA");
  const countSpan = $("#selectedCount");

  countSpan.text(count);

  if (count > 0) {
    button.prop("disabled", false);
    button.removeClass("btn-secondary").addClass("btn-primary");
  } else {
    button.prop("disabled", true);
    button.removeClass("btn-primary").addClass("btn-secondary");
  }
}

// Reflection questions functionality
function initializeReflectionQuestions() {
  const questions = [
    "Are you satisfied with your current booking volume?",
    "Is your occupancy rate meeting your targets?",
    "Are you too dependent on OTAs for bookings?",
    "Does your website convert visitors to bookings?",
    "Are your online reviews helping or hurting?",
    "Is social media driving actual revenue?",
    "Are you capturing wedding/event inquiries?",
    "Do guests return to your hotel?",
    "Is your marketing strategy clearly defined?",
    "Are you tracking marketing ROI?",
    "Do you know your customer acquisition cost?",
    "Are you maximizing revenue per room?",
    "Is your team aligned on marketing goals?",
    "Are you ahead of local competitors?",
    "Is your brand positioning clear?",
    "Are you using data to make decisions?",
    "Do you have a guest retention strategy?",
    "Are you optimizing for direct bookings?",
    "Is your pricing strategy competitive?",
    "Are you prepared for market changes?",
    "Do you have a clear growth plan for next year?",
  ];

  const questionsContainer = $("#reflectionQuestions");
  let checkedCount = 0;

  questions.forEach((question, index) => {
    const questionHtml = `
            <div class="reflection-question" data-question="${index + 1}">
                <div class="reflection-check">
                    <i class="far fa-circle"></i>
                </div>
                <span class="reflection-text">${index + 1}. ${question}</span>
            </div>
        `;
    questionsContainer.append(questionHtml);
  });

  // Handle question clicks
  $(document).on("click", ".reflection-question", function () {
    const questionElement = $(this);
    const questionText = $(this).find(".reflection-text").text().trim();

    let checkedQuestions =
      JSON.parse(localStorage.getItem("checkedQuestions")) || [];
    if (checkedQuestions.includes(questionText)) {
      checkedQuestions = checkedQuestions.filter((q) => q !== questionText);
    } else {
      checkedQuestions.push(questionText);
    }

    // Save updated array
    localStorage.setItem("checkedQuestions", JSON.stringify(checkedQuestions));
    const checkIcon = questionElement.find(".reflection-check i");

    if (questionElement.hasClass("checked")) {
      // Uncheck
      questionElement.removeClass("checked");
      checkIcon.removeClass("fas fa-check-circle").addClass("far fa-circle");
      checkedCount--;
    } else {
      // Check
      questionElement.addClass("checked");
      checkIcon.removeClass("far fa-circle").addClass("fas fa-check-circle");
      checkedCount++;
    }

    // Update counter
    $("#reflectionCount").text(checkedCount);
  });
}

// Form handling
function initializeFormHandling() {
  $("#velocityForm").on("submit", function (e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    localStorage.setItem("velocityFormData", JSON.stringify(data));

    // Simulate form submission
    handleFormSubmission(data);

    // export data into google sheet
    exportChallengesSolutions();
    exportIntakeQuestionnaire();
    exportVelocityFormData();
  });

  $("#audit-form").on("submit", function (e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    localStorage.setItem("auditFormData", JSON.stringify(data));

    // Simulate form submission
    handleAuditFormSubmission(data);
  });
}

// export data in google storage
function exportChallengesSolutions() {
  let challenge =
    JSON.parse(localStorage.getItem("selectedChallengeNames")) || [];
  let solution = JSON.parse(localStorage.getItem("solutions")) || [];

  let fd = new FormData();
  fd.append("Challenges", challenge);
  fd.append("Solutions", solution);

  fetch(
    "https://script.google.com/macros/s/AKfycbw_ePo1K2RSxBYzFroznq1Am8o9BG83p6j_EmdaRfvveCkuY8vAvqtKH5YnOctx-V5Z-A/exec",
    {
      method: "POST",
      body: fd,
    }
  )
    .then((res) => res.json())
    .then((response) => {
      console.log("Data saved:", response);
    })
    .catch((err) => console.error("Error:", err));
}

function exportIntakeQuestionnaire() {
  let auditFormData = JSON.parse(localStorage.getItem("auditFormData")) || {};

  let fd = new FormData();

  fd.append("Challange1", auditFormData.challenge_1 || "");
  fd.append("Challange2", auditFormData.challenge_2 || "");
  fd.append("Challange3", auditFormData.challenge_3 || "");

  fd.append(
    "Platforms",
    [auditFormData.channel_1, auditFormData.channel_2, auditFormData.channel_3]
      .filter(Boolean)
      .join(", ")
  );

  fd.append(
    "Changes_in_guest_behavior",
    [auditFormData.insight_1, auditFormData.insight_2, auditFormData.insight_3]
      .filter(Boolean)
      .join(", ")
  );

  fd.append(
    "Outcomes",
    [
      auditFormData.ninety_outcome_1,
      auditFormData.ninety_outcome_2,
      auditFormData.ninety_outcome_3,
    ]
      .filter(Boolean)
      .join(", ")
  );

  fd.append(
    "Primary Growth",
    [auditFormData.goal_1, auditFormData.goal_2, auditFormData.goal_3]
      .filter(Boolean)
      .join(", ")
  );

  fd.append(
    "Marketing Channels",
    [
      auditFormData.expectation_1,
      auditFormData.expectation_2,
      auditFormData.expectation_3,
    ]
      .filter(Boolean)
      .join(", ")
  );

  fd.append(
    "Areas",
    [
      auditFormData.underperforming_area_1,
      auditFormData.underperforming_area_2,
      auditFormData.underperforming_area_3,
    ]
      .filter(Boolean)
      .join(", ")
  );

  fd.append(
    "Improvements",
    [auditFormData.value_1, auditFormData.value_2, auditFormData.value_3]
      .filter(Boolean)
      .join(", ")
  );

  fd.append("Qualities", [
    [auditFormData.value_1, auditFormData.value_2, auditFormData.value_3]
      .filter(Boolean)
      .join(", "),
  ]);

  fd.append("Average Monthly Occupancy", auditFormData.occupancy || "");
  fd.append("Average Daily Rate", auditFormData.adr || "");
  fd.append("Monthly Digital Marketing Budget", auditFormData.budget || "");
  fd.append("Booking Engine Used", auditFormData.booking_engine || "");
  fd.append("Website CMS", auditFormData.cms || "");
  fd.append("Active OTA Platforms", auditFormData.otas || "");

  fd.append(
    "Top Competitors",
    [auditFormData.comp_1, auditFormData.comp_2, auditFormData.comp_3]
      .filter(Boolean)
      .join(", ")
  );

  fetch(
    "https://script.google.com/macros/s/AKfycbyDv7D567WJabfEBc4FJwN-3qwYdySppC0-rwFPTVPMYJvvxyUmn-GmvWNfDNyf6q7Mag/exec",
    {
      method: "POST",
      body: fd,
    }
  )
    .then((res) => res.json())
    .then((response) => {
      console.log("Data saved:", response);
    })
    .catch((err) => console.error("Error:", err));
}

// velocityFormData
function exportVelocityFormData() {
  let velocityFormData =
    JSON.parse(localStorage.getItem("velocityFormData")) || {};
  let fd = new FormData();
  fd.append("Name", velocityFormData.name || "");
  fd.append("Email", velocityFormData.email || "");
  fd.append("Phone", velocityFormData.phone || "");
  fd.append("Hotel Name", velocityFormData.hotelName || "");
  fd.append("Location", velocityFormData.location || "");
  fd.append("Monthly Revenue Range", velocityFormData.monthlyRevenue || "");
  fd.append(
    "Current Marketing Challenges",
    velocityFormData.currentChallenges || ""
  );
  fd.append(
    "Primary Goals for Next 12 Months",
    velocityFormData.primaryGoals || ""
  );

  fetch(
    "https://script.google.com/macros/s/AKfycbwN-2E6vEjZQHxH0UUJTe9N-QcFVW_Ys4Qf5jPxzDAXwVmbqTDw6B4s3WaLTBXGJePbhg/exec",
    {
      method: "POST",
      body: fd,
    }
  )
    .then((res) => res.json())
    .then((response) => {
      console.log("Data saved:", response);
    })
    .catch((err) => console.error("Error:", err));
}

// audit form submission
function handleAuditFormSubmission(data) {
  const submitButton = $('#auditForm button[type="submit"]');
  const originalText = submitButton.html();

  submitButton
    .html('<i class="fas fa-spinner fa-spin"></i> Submitting...')
    .prop("disabled", true);

  // Simulate API call
  setTimeout(function () {
    // Success state
    submitButton
      .html('<i class="fas fa-check"></i> Submitted Successfully!')
      .removeClass("btn-primary")
      .addClass("btn-success");

    document.getElementById("audit-form").reset();
    // Show success message
    showSuccessMessage("auditForm");

    // Scroll to reflection section
    setTimeout(function () {
      scrollToSection("solutions");
    }, 2000);
  }, 2000);
}

function handleFormSubmission(data) {
  // Show loading state
  const submitButton = $('#velocityForm button[type="submit"]');
  const originalText = submitButton.html();

  submitButton
    .html('<i class="fas fa-spinner fa-spin"></i> Submitting...')
    .prop("disabled", true);

  // Simulate API call
  setTimeout(function () {
    // Success state
    submitButton
      .html('<i class="fas fa-check"></i> Submitted Successfully!')
      .removeClass("btn-primary")
      .addClass("btn-success");

    document.getElementById("velocityForm").reset();
    // Show success message
    showSuccessMessage("velocityForm");

    // Scroll to reflection section
    setTimeout(function () {
      scrollToSection("socialProofSection");
    }, 2000);
  }, 2000);
}

function showSuccessMessage(id) {
  if (id == "velocityForm") {
    const successHtml = `
          <div class="alert alert-success mt-4" role="alert">
              <h4 class="alert-heading"><i class="fas fa-check-circle"></i> Thank You!</h4>
              <p>Your questionnaire has been submitted successfully. We'll prepare your customized hotel growth plan and contact you within 24 hours.</p>
              <hr>
              <p class="mb-0">Please complete the reflection questions below to help us prepare even better recommendations for your call.</p>
          </div>
      `;

    $("#velocityForm").after(successHtml);
  }

  if (id == "auditForm") {
    const successHtml = `
          <div class="alert alert-success mt-4" role="alert">
              <h4 class="alert-heading"><i class="fas fa-check-circle"></i> Thank You!</h4>
              <p>Your Audit Intake Questionnaire has been submitted successfully. We'll prepare your customized hotel growth plan and contact you within 24 hours.</p>
              <hr>
              <p class="mb-0">Please select the solutions to help us prepare even better recommendations for your call.</p>
          </div>
      `;

    $("#audit-form").after(successHtml);
  }
}

// Smooth scrolling functionality
function initializeSmoothScrolling() {
  // Add smooth scrolling to all navigation links
  $('a[href^="#"]').on("click", function (e) {
    e.preventDefault();
    const target = $(this.getAttribute("href"));
    if (target.length) {
      $("html, body").animate(
        {
          scrollTop: target.offset().top - 80,
        },
        1000
      );
    }
  });
}

// Global scroll to section function
function scrollToSection(sectionId) {
  const target = $("#" + sectionId);
  target.css("display", "block");
  if (target.length) {
    $("html, body").animate(
      {
        scrollTop: target.offset().top - 80,
      },
      1000
    );
  }
}

// Scroll animations
function initializeScrollAnimations() {
  // Intersection Observer for animations
  if ("IntersectionObserver" in window) {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fadeInUp");
        }
      });
    }, observerOptions);

    // Observe elements for animation
    $(".challenge-card, .solution-card, .stat-card, .testimonial-card").each(
      function () {
        observer.observe(this);
      }
    );
  }
}

// Utility functions
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePhone(phone) {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ""));
}

// Analytics tracking (placeholder)
function trackEvent(eventName, eventData = {}) {
  // Google Analytics integration would go here
  if (typeof gtag !== "undefined") {
    gtag("event", eventName, eventData);
  }

  // Facebook Pixel integration would go here
  if (typeof fbq !== "undefined") {
    fbq("track", eventName, eventData);
  }
}

// Track form interactions
$(document).on("focus", "input, textarea, select", function () {
  const fieldName = $(this).attr("name") || $(this).attr("id");
  trackEvent("form_field_focus", { field_name: fieldName });
});

// Track button clicks
$(document).on("click", ".btn-primary", function () {
  const buttonText = $(this).text().trim();
  trackEvent("button_click", { button_text: buttonText });
});

// Track challenge selections
$(document).on("click", ".challenge-card", function () {
  const challengeText = $(this).find(".challenge-text").text();
  const isSelected = $(this).hasClass("selected");

  trackEvent("challenge_selection", {
    challenge: challengeText,
    action: isSelected ? "deselect" : "select",
  });
});

// select solution cards on click
const solutionCards = document.querySelectorAll(".solution-card");
const solutionCTA = document.getElementById("solutionCTA");
const selectedCount = document.getElementById("solutionSelectedCount");
console.log("Solution Cards:", selectedCount);
solutionCards.forEach((card) => {
  card.addEventListener("click", () => {
    const solutionName = card
      .querySelector(".solution-title")
      ?.textContent.replace(/\s+/g, " ")
      .trim();
    if (!solutionName) return;

    card.classList.toggle("selected");

    let savedSolutions = JSON.parse(localStorage.getItem("solutions")) || [];

    if (card.classList.contains("selected")) {
      if (!savedSolutions.includes(solutionName)) {
        savedSolutions.push(solutionName);
      }
    } else {
      savedSolutions = savedSolutions.filter((name) => name !== solutionName);
    }

    // Update localStorage
    localStorage.setItem("solutions", JSON.stringify(savedSolutions));

    const count = savedSolutions.length;
    selectedCount.textContent = count;
    solutionCTA.disabled = count === 0;
  });
});

// Performance optimization
$(window).on("load", function () {
  // Lazy load images
  $("img[data-src]").each(function () {
    $(this).attr("src", $(this).attr("data-src"));
  });
});

// Error handling
window.addEventListener("error", function (e) {
  console.error("JavaScript Error:", e.error);
  trackEvent("javascript_error", {
    message: e.message,
    filename: e.filename,
    lineno: e.lineno,
  });
});

// Resize handler for responsive adjustments
$(window).on("resize", function () {
  // Handle responsive adjustments if needed
  const windowWidth = $(window).width();

  if (windowWidth < 768) {
    // Mobile adjustments
    $(".hero-title").css("font-size", "2.5rem");
  } else {
    // Desktop adjustments
    $(".hero-title").css("font-size", "4rem");
  }
});

// This script handles the challenge card selection and displays related solutions

const challengeCards = document.querySelectorAll(".challenge-card");
const challengesCTA = document.getElementById("challengesCTA");
const selectedCountSpan = document.getElementById("selectedCount");
const solutionsSection = document.getElementById("solutions");
const allSolutionColumns = document.querySelectorAll(
  "#solutionCardsWrapper > div"
);

// Challenge-to-solution mapping
const challengeToSolutionMap = {
  1: [1, 2],
  2: [2],
  3: [1, 2],
  4: [4],
  5: [5],
  6: [3, 7],
  7: [6],
  8: [8],
  9: [1, 3, 9],
  10: [9, 10],
};

const selectedChallenges = new Set();

// Challenge card click toggle logic
challengeCards.forEach((card) => {
  card.addEventListener("click", () => {
    const id = card.dataset.challenge;

    card.classList.toggle("active");
    const paraText = card
      .querySelector("p")
      ?.textContent.replace(/\s+/g, " ")
      .trim();
    let names =
      JSON.parse(localStorage.getItem("selectedChallengeNames")) || [];

    if (selectedChallenges.has(id)) {
      selectedChallenges.delete(id);
      names = names.filter((name) => name !== paraText);
    } else {
      selectedChallenges.add(id);
      names.push(paraText);
    }

    localStorage.setItem("selectedChallengeNames", JSON.stringify(names));
    // Update button text and enable/disable
    selectedCountSpan.textContent = selectedChallenges.size;
    challengesCTA.disabled = selectedChallenges.size === 0;

    if (selectedChallenges.size === 0) {
      solutionsSection.style.display = "none";
      allSolutionColumns.forEach((col) => {
        col.style.display = "none";
      });
    }
  });
});

// Handle "See My Solutions" button click
challengesCTA.addEventListener("click", () => {
  // Hide all solution cards initially
  allSolutionColumns.forEach((col) => {
    col.style.display = "none";
  });

  // Collect relevant solution IDs based on selected challenges
  const solutionsToShow = new Set();
  selectedChallenges.forEach((challengeId) => {
    const matchingSolutions = challengeToSolutionMap[challengeId] || [];
    matchingSolutions.forEach((solId) => solutionsToShow.add(solId));
  });

  // Show only the matched solutions
  allSolutionColumns.forEach((col) => {
    const solutionId = parseInt(col.dataset.solution);
    if (solutionsToShow.has(solutionId)) {
      col.style.display = "block";
    }
  });

  // Display the solutions section & scroll to it
  solutionsSection.style.display = "none";
  scrollToSection("hotelAudit");
});
