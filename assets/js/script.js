// Internet Moguls Landing Page JavaScript

$(document).ready(function() {
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
    console.log('Internet Moguls Landing Page Loaded');
    
    // Add loading class removal after page load
    setTimeout(function() {
        $('body').removeClass('loading');
    }, 500);
}

// Challenge card selection functionality
function initializeChallengeCards() {
    let selectedChallenges = [];
    
    $('.challenge-card').on('click', function() {
        const challengeId = $(this).data('challenge');
        
        if ($(this).hasClass('selected')) {
            // Deselect
            $(this).removeClass('selected');
            selectedChallenges = selectedChallenges.filter(id => id !== challengeId);
        } else {
            // Select
            $(this).addClass('selected');
            selectedChallenges.push(challengeId);
        }
        
        // Update button state
        updateChallengesButton(selectedChallenges.length);
    });
}

function updateChallengesButton(count) {
    const button = $('#challengesCTA');
    const countSpan = $('#selectedCount');
    
    countSpan.text(count);
    
    if (count > 0) {
        button.prop('disabled', false);
        button.removeClass('btn-secondary').addClass('btn-primary');
    } else {
        button.prop('disabled', true);
        button.removeClass('btn-primary').addClass('btn-secondary');
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
        "Do you have a clear growth plan for next year?"
    ];
    
    const questionsContainer = $('#reflectionQuestions');
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
    $(document).on('click', '.reflection-question', function() {
        const questionElement = $(this);
        const checkIcon = questionElement.find('.reflection-check i');
        
        if (questionElement.hasClass('checked')) {
            // Uncheck
            questionElement.removeClass('checked');
            checkIcon.removeClass('fas fa-check-circle').addClass('far fa-circle');
            checkedCount--;
        } else {
            // Check
            questionElement.addClass('checked');
            checkIcon.removeClass('far fa-circle').addClass('fas fa-check-circle');
            checkedCount++;
        }
        
        // Update counter
        $('#reflectionCount').text(checkedCount);
    });
}

// Form handling
function initializeFormHandling() {
    $('#velocityForm').on('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Simulate form submission
        handleFormSubmission(data);
    });
}

function handleFormSubmission(data) {
    // Show loading state
    const submitButton = $('#velocityForm button[type="submit"]');
    const originalText = submitButton.html();
    
    submitButton.html('<i class="fas fa-spinner fa-spin"></i> Submitting...').prop('disabled', true);
    
    // Simulate API call
    setTimeout(function() {
        // Success state
        submitButton.html('<i class="fas fa-check"></i> Submitted Successfully!').removeClass('btn-primary').addClass('btn-success');
        
        // Show success message
        showSuccessMessage();
        
        // Scroll to reflection section
        setTimeout(function() {
            scrollToSection('reflection');
        }, 2000);
        
    }, 2000);
}

function showSuccessMessage() {
    const successHtml = `
        <div class="alert alert-success mt-4" role="alert">
            <h4 class="alert-heading"><i class="fas fa-check-circle"></i> Thank You!</h4>
            <p>Your questionnaire has been submitted successfully. We'll prepare your customized hotel growth plan and contact you within 24 hours.</p>
            <hr>
            <p class="mb-0">Please complete the reflection questions below to help us prepare even better recommendations for your call.</p>
        </div>
    `;
    
    $('#velocityForm').after(successHtml);
}

// Smooth scrolling functionality
function initializeSmoothScrolling() {
    // Add smooth scrolling to all navigation links
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        const target = $(this.getAttribute('href'));
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 80
            }, 1000);
        }
    });
}

// Global scroll to section function
function scrollToSection(sectionId) {
    const target = $('#' + sectionId);
    if (target.length) {
        $('html, body').animate({
            scrollTop: target.offset().top - 80
        }, 1000);
    }
}

// Scroll animations
function initializeScrollAnimations() {
    // Intersection Observer for animations
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fadeInUp');
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        $('.challenge-card, .solution-card, .stat-card, .testimonial-card').each(function() {
            observer.observe(this);
        });
    }
}

// Utility functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
}

// Analytics tracking (placeholder)
function trackEvent(eventName, eventData = {}) {
    console.log('Event tracked:', eventName, eventData);
    
    // Google Analytics integration would go here
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }
    
    // Facebook Pixel integration would go here
    if (typeof fbq !== 'undefined') {
        fbq('track', eventName, eventData);
    }
}

// Track form interactions
$(document).on('focus', 'input, textarea, select', function() {
    const fieldName = $(this).attr('name') || $(this).attr('id');
    trackEvent('form_field_focus', { field_name: fieldName });
});

// Track button clicks
$(document).on('click', '.btn-primary', function() {
    const buttonText = $(this).text().trim();
    trackEvent('button_click', { button_text: buttonText });
});

// Track challenge selections
$(document).on('click', '.challenge-card', function() {
    const challengeText = $(this).find('.challenge-text').text();
    const isSelected = $(this).hasClass('selected');
    
    trackEvent('challenge_selection', { 
        challenge: challengeText,
        action: isSelected ? 'deselect' : 'select'
    });
});

// Performance optimization
$(window).on('load', function() {
    // Lazy load images
    $('img[data-src]').each(function() {
        $(this).attr('src', $(this).attr('data-src'));
    });
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    trackEvent('javascript_error', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno
    });
});

// Resize handler for responsive adjustments
$(window).on('resize', function() {
    // Handle responsive adjustments if needed
    const windowWidth = $(window).width();
    
    if (windowWidth < 768) {
        // Mobile adjustments
        $('.hero-title').css('font-size', '2.5rem');
    } else {
        // Desktop adjustments
        $('.hero-title').css('font-size', '4rem');
    }
});