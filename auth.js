// auth.js - Simplified version with no authentication restrictions

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set up profile functionality (if elements exist)
    setupProfileModal();
    
    // Set up sign out buttons (if any exist)
    setupSignOut();
    
    // Initialize profile icon if user data exists
    initProfileIcon();
});

// Profile Functions
function setupProfileModal() {
    const profileIcon = document.querySelector('.profile');
    const profileModal = document.getElementById('profileModal');
    const closeProfileBtn = document.querySelector('.close-profile-btn');
    
    if (!profileIcon || !profileModal || !closeProfileBtn) return;
    
    // Open profile modal when profile icon is clicked
    profileIcon.addEventListener('click', function() {
        profileModal.style.display = 'block';
        loadProfileData();
    });
    
    // Close profile modal
    closeProfileBtn.addEventListener('click', function() {
        profileModal.style.display = 'none';
    });
    
    // Close when clicking outside the modal
    window.addEventListener('click', function(event) {
        if (event.target === profileModal) {
            profileModal.style.display = 'none';
        }
    });
}

function loadProfileData() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
    const certifications = JSON.parse(localStorage.getItem('certifications')) || [];
    const skills = JSON.parse(localStorage.getItem('userSkills')) || [];
    
    // Set basic info
    if (currentUser.name) {
        document.getElementById('profileName').textContent = currentUser.name;
    }
    
    if (currentUser.email) {
        document.getElementById('profileEmail').textContent = currentUser.email;
    }
    
    if (currentUser.college) {
        const collegeMap = {
            'computer': 'Computer Science and Information Technology',
            'engineering': 'Engineering',
            'business': 'Business Administration',
            'medicine': 'Medicine',
            'science': 'Science',
            'arts': 'Arts'
        };
        document.getElementById('profileCollege').textContent = collegeMap[currentUser.college] || currentUser.college;
    }
    
    // Set certifications
    const certsContainer = document.getElementById('profileCertifications');
    certsContainer.innerHTML = certifications.length > 0 ? '' : '<p>No certifications added yet</p>';
    
    certifications.forEach(cert => {
        const certElement = document.createElement('div');
        certElement.className = 'certification-badge';
        certElement.textContent = cert.name;
        certsContainer.appendChild(certElement);
    });
    
    // Set skills
    const skillsContainer = document.getElementById('profileSkills');
    skillsContainer.innerHTML = skills.length > 0 ? '' : '<p>No skills added yet</p>';
    
    skills.forEach(skill => {
        const skillElement = document.createElement('div');
        skillElement.className = 'skill-badge';
        skillElement.textContent = skill;
        skillsContainer.appendChild(skillElement);
    });
}

function initProfileIcon() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
    if (currentUser.name) {
        const names = currentUser.name.split(' ');
        const initials = names[0].charAt(0) + (names.length > 1 ? names[names.length - 1].charAt(0) : '');
        const profileIcons = document.querySelectorAll('.profile');
        profileIcons.forEach(icon => {
            icon.textContent = initials.toUpperCase();
        });
    }
}

function setupSignOut() {
    const signOutButtons = document.querySelectorAll('.sign-out');
    
    signOutButtons.forEach(button => {
        button.addEventListener('click', handleSignOut);
    });
}

function handleSignOut() {
    // Clear user session data
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('certifications');
    localStorage.removeItem('userSkills');
    
    // Refresh the page
    window.location.reload();
}



document.addEventListener('DOMContentLoaded', function() {
    setupProfileModal();
    setupSignOut();
    initProfileIcon();
    setupResumeGenerator();
});

function setupResumeGenerator() {
    const resumeButton = document.getElementById('generateResume');
    if (resumeButton) {
        resumeButton.addEventListener('click', generateResume);
    }
}

function generateResume() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Fetch profile data from the modal
    const name = document.getElementById('profileName')?.textContent || "Your Name";
    const email = document.getElementById('profileEmail')?.textContent || "your.email@example.com";
    const college = document.getElementById('profileCollege')?.textContent || "Not provided";
    const studentId = document.getElementById('profileId')?.textContent || "N/A";
    
    // Fetch certifications
    const certElements = document.querySelectorAll("#profileCertifications .certification-badge");
    const certifications = Array.from(certElements).map(cert => cert.textContent);

    // Fetch skills
    const skillElements = document.querySelectorAll("#profileSkills .skill-badge");
    const skills = Array.from(skillElements).map(skill => skill.textContent);
    
    // Fetch additional custom fields
    const customFields = [];
    document.querySelectorAll("#customFields .custom-field").forEach(field => {
        const label = field.querySelector(".field-label")?.textContent;
        const value = field.querySelector(".field-value")?.textContent;
        if (label && value) {
            customFields.push({ label, value });
        }
    });

    // Resume Styling - Header Section
    doc.setFillColor(33, 37, 41); // Dark header background
    doc.rect(0, 0, 210, 40, "F");
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text(name, 15, 20);

    doc.setFontSize(14);
    doc.setTextColor(200, 200, 200);
    doc.text(email, 15, 30);

    // Section Divider
    doc.setDrawColor(150, 150, 150);
    doc.line(10, 45, 200, 45);

    // Personal Info
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(" College", 10, 55);
    doc.setFontSize(12);
    doc.text(college, 15, 65);

    doc.text(" Student ID", 10, 75);
    doc.text(studentId, 15, 85);

    // Section Divider
    doc.line(10, 95, 200, 95);

    // Certifications Section
    let yPosition = 105;
    doc.setFontSize(16);
    doc.text(" Certifications", 10, yPosition);
    doc.setFontSize(12);
    yPosition += 10;

    if (certifications.length === 0) {
        doc.text("No certifications added.", 15, yPosition);
    } else {
        certifications.forEach(cert => {
            doc.text(`✔ ${cert}`, 15, yPosition);
            yPosition += 10;
        });
    }

    // Section Divider
    doc.line(10, yPosition + 5, 200, yPosition + 5);
    yPosition += 15;

    // Skills Section
    doc.setFontSize(16);
    doc.text(" Skills", 10, yPosition);
    doc.setFontSize(12);
    yPosition += 10;

    if (skills.length === 0) {
        doc.text("No skills added.", 15, yPosition);
    } else {
        skills.forEach(skill => {
            doc.text(`• ${skill}`, 15, yPosition);
            yPosition += 10;
        });
    }

    // Section Divider
    doc.line(10, yPosition + 5, 200, yPosition + 5);
    yPosition += 15;

    // Custom Fields Section
    if (customFields.length > 0) {
        doc.setFontSize(16);
        doc.text(" Additional Information", 10, yPosition);
        doc.setFontSize(12);
        yPosition += 10;

        customFields.forEach(field => {
            doc.text(`${field.label}: ${field.value}`, 15, yPosition);
            yPosition += 10;
        });

        doc.line(10, yPosition + 5, 200, yPosition + 5);
    }

    // Save the Resume
    doc.save(`${name}_Resume.pdf`);
}

// Attach event listener
document.getElementById("generateResume")?.addEventListener("click", generateResume);
