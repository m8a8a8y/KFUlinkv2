// auth.js - Simplified version with no authentication restrictions

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set up profile functionality (if elements exist)
    setupProfileModal();
    
    setupSignOut();
    
    initProfileIcon();
    setupResumeGenerator();
});

function setupProfileModal() {
    const profileIcon = document.querySelector('.profile');
    const profileModal = document.getElementById('profileModal');
    const closeProfileBtn = document.querySelector('.close-profile-btn');
    
    if (!profileIcon || !profileModal || !closeProfileBtn) return;
    
    profileIcon.addEventListener('click', function() {
        profileModal.style.display = 'block';
        loadProfileData();
    });
    
    closeProfileBtn.addEventListener('click', function() {
        profileModal.style.display = 'none';
    });
    
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
    const hackathons = JSON.parse(localStorage.getItem('hackathons')) || [];
    const projects = JSON.parse(localStorage.getItem('projects')) || [];
    
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
    
    // Certifications
    const certsContainer = document.getElementById('profileCertifications');
    certsContainer.innerHTML = certifications.length > 0 ? '' : '<p>No certifications added yet</p>';
    
    certifications.forEach(cert => {
        const certElement = document.createElement('div');
        certElement.className = 'certification-badge';
        certElement.textContent = cert.name;
        certsContainer.appendChild(certElement);
    });
    
    // Skills
    const skillsContainer = document.getElementById('profileSkills');
    skillsContainer.innerHTML = skills.length > 0 ? '' : '<p>No skills added yet</p>';
    
    skills.forEach(skill => {
        const skillElement = document.createElement('div');
        skillElement.className = 'skill-badge';
        skillElement.textContent = skill;
        skillsContainer.appendChild(skillElement);
    });
    
    // Hackathons
    const hackathonsContainer = document.getElementById('profileHackathons') || createProfileSection('Hackathons', 'profileHackathons');
    hackathonsContainer.innerHTML = hackathons.length > 0 ? '' : '<p>No hackathons added yet</p>';
    
    hackathons.forEach(hackathon => {
        const hackathonElement = document.createElement('div');
        hackathonElement.className = 'profile-item';
        hackathonElement.innerHTML = `
            <strong>${hackathon.name}</strong> - ${hackathon.date}<br>
            <small>Role: ${hackathon.role || 'Not specified'}</small><br>
            <small>Outcome: ${hackathon.outcome || 'Participated'}</small>
        `;
        hackathonsContainer.appendChild(hackathonElement);
    });
    
    // Projects
    const projectsContainer = document.getElementById('profileProjects') || createProfileSection('Projects', 'profileProjects');
    projectsContainer.innerHTML = projects.length > 0 ? '' : '<p>No projects added yet</p>';
    
    projects.forEach(project => {
        const projectElement = document.createElement('div');
        projectElement.className = 'profile-item';
        projectElement.innerHTML = `
            <strong>${project.name}</strong>${project.date ? ' - ' + project.date : ''}<br>
            ${project.link ? `<small><a href="${project.link}" target="_blank">View Project</a></small><br>` : ''}
            <small>Technologies: ${project.technologies.join(', ')}</small>
        `;
        projectsContainer.appendChild(projectElement);
    });
}

// Helper function to create profile sections
function createProfileSection(title, id) {
    const profileContent = document.querySelector('.profile-content');
    const section = document.createElement('div');
    section.className = 'profile-section';
    section.innerHTML = `
        <h3>${title}</h3>
        <div id="${id}" class="profile-list"></div>
    `;
    profileContent.insertBefore(section, document.getElementById('generateResume').parentNode);
    return document.getElementById(id);
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
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('certifications');
    localStorage.removeItem('userSkills');
    localStorage.removeItem('hackathons');
    localStorage.removeItem('projects');
    
    window.location.reload();
}

function setupResumeGenerator() {
    const resumeButton = document.getElementById('generateResume');
    if (resumeButton) {
        resumeButton.addEventListener('click', generateResume);
    }
}

function generateResume() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const name = document.getElementById('profileName')?.textContent || "Your Name";
    const email = document.getElementById('profileEmail')?.textContent || "your.email@example.com";
    const college = document.getElementById('profileCollege')?.textContent || "Not provided";
    const studentId = document.getElementById('profileId')?.textContent || "N/A";
    
    const certElements = document.querySelectorAll("#profileCertifications .certification-badge");
    const certifications = Array.from(certElements).map(cert => cert.textContent);

    const skillElements = document.querySelectorAll("#profileSkills .skill-badge");
    const skills = Array.from(skillElements).map(skill => skill.textContent);
    
    const hackathonElements = document.querySelectorAll("#profileHackathons .profile-item");
    const hackathons = Array.from(hackathonElements).map(el => el.textContent.trim());
    
    const projectElements = document.querySelectorAll("#profileProjects .profile-item");
    const projects = Array.from(projectElements).map(el => el.textContent.trim());
    
    const customFields = [];
    document.querySelectorAll("#customFields .custom-field").forEach(field => {
        const label = field.querySelector(".field-label")?.textContent;
        const value = field.querySelector(".field-value")?.textContent;
        if (label && value) {
            customFields.push({ label, value });
        }
    });

    doc.setFillColor(33, 37, 41);
    doc.rect(0, 0, 210, 40, "F");
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text(name, 15, 20);

    doc.setFontSize(14);
    doc.setTextColor(200, 200, 200);
    doc.text(email, 15, 30);

    doc.setDrawColor(150, 150, 150);
    doc.line(10, 45, 200, 45);

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(" College", 10, 55);
    doc.setFontSize(12);
    doc.text(college, 15, 65);

    doc.text(" Student ID", 10, 75);
    doc.text(studentId, 15, 85);

    doc.line(10, 95, 200, 95);

    let yPosition = 105;
    doc.setFontSize(16);
    doc.text(" Certifications", 10, yPosition);
    doc.setFontSize(12);
    yPosition += 10;

    if (certifications.length === 0) {
        doc.text("No certifications added.", 15, yPosition);
    } else {
        certifications.forEach(cert => {
            doc.text(` ${cert}`, 15, yPosition);
            yPosition += 10;
        });
    }

    doc.line(10, yPosition + 5, 200, yPosition + 5);
    yPosition += 15;

    doc.setFontSize(16);
    doc.text(" Skills", 10, yPosition);
    doc.setFontSize(12);
    yPosition += 10;

    if (skills.length === 0) {
        doc.text("No skills added.", 15, yPosition);
    } else {
        skills.forEach(skill => {
            doc.text(` ${skill}`, 15, yPosition);
            yPosition += 10;
        });
    }

    doc.line(10, yPosition + 5, 200, yPosition + 5);
    yPosition += 15;

    doc.setFontSize(16);
    doc.text(" Hackathons", 10, yPosition);
    doc.setFontSize(12);
    yPosition += 10;

    if (hackathons.length === 0) {
        doc.text("No hackathons added.", 15, yPosition);
    } else {
        hackathons.forEach(hackathon => {
            doc.text(` ${hackathon}`, 15, yPosition);
            yPosition += 10;
        });
    }

    doc.line(10, yPosition + 5, 200, yPosition + 5);
    yPosition += 15;

    doc.setFontSize(16);
    doc.text(" Projects", 10, yPosition);
    doc.setFontSize(12);
    yPosition += 10;

    if (projects.length === 0) {
        doc.text("No projects added.", 15, yPosition);
    } else {
        projects.forEach(project => {
            doc.text(` ${project}`, 15, yPosition);
            yPosition += 10;
        });
    }

    doc.line(10, yPosition + 5, 200, yPosition + 5);
    yPosition += 15;

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

    doc.save(`${name}_Resume.pdf`);
}
