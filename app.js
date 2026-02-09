// ==================== INITIALIZATION ====================

const root = document.querySelector(":root");
let isMobileView = window.innerWidth <= 768;

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    initializeMobileDetection();
    setupLivePreview();
    updatePreview();
    loadTheme();
    updateMobileUI();
});

// Detect mobile/desktop on resize
window.addEventListener('resize', () => {
    const wasMobile = isMobileView;
    isMobileView = window.innerWidth <= 768;
    if (wasMobile !== isMobileView) {
        updateMobileUI();
    }
});

// ==================== MOBILE DETECTION & UI ==================== 

function initializeMobileDetection() {
    if (isMobileView) {
        document.body.classList.add('mobile-view');
    } else {
        document.body.classList.remove('mobile-view');
    }
}

function updateMobileUI() {
    const mobileHeader = document.querySelector('.mobile-header');
    
    if (isMobileView) {
        if (mobileHeader) mobileHeader.classList.add('show');
        document.body.classList.add('mobile-view');
    } else {
        if (mobileHeader) mobileHeader.classList.remove('show');
        document.body.classList.remove('mobile-view');
    }
}

function toggleMobileNav() {
    const nav = document.getElementById('mobileNav');
    nav.classList.toggle('open');
}

function closeNav() {
    const nav = document.getElementById('mobileNav');
    nav.classList.remove('open');
}

// ==================== DARK/LIGHT MODE ====================

function toggleMode() {
    const mode = document.getElementById("modeToggle");
    const body = document.body;
    
    if (mode.classList.contains("dark")) {
        mode.innerHTML = '<ion-icon name="moon-outline"></ion-icon>';
        mode.classList.remove("dark");
        body.classList.add('light-mode');
        root.style.setProperty("--bg", "#fff");
        root.style.setProperty("--clr-primary", "#000");
        root.style.setProperty("--clr-border", "#ddd");
        root.style.setProperty("--clr-secondary", "#333");
        localStorage.setItem('theme-mode', 'light');
    } else {
        mode.innerHTML = '<ion-icon name="sunny-outline"></ion-icon>';
        mode.classList.add("dark");
        body.classList.remove('light-mode');
        root.style.setProperty("--bg", "#234");
        root.style.setProperty("--clr-primary", "#fff");
        root.style.setProperty("--clr-border", "#345");
        root.style.setProperty("--clr-secondary", "#789");
        localStorage.setItem('theme-mode', 'dark');
    }
}

function changeTheme(color) {
    root.style.setProperty("--clr-theme", color);
    localStorage.setItem('selectedTheme', color);
}

function loadTheme() {
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
        changeTheme(savedTheme);
    }
    
    const savedMode = localStorage.getItem('theme-mode');
    if (savedMode === 'light') {
        toggleMode();
    }
}

// ==================== DYNAMIC FORM FIELDS ====================

function addEducation() {
    const container = document.getElementById('educationFields');
    const newEducation = document.createElement('div');
    newEducation.className = 'education-item';
    newEducation.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label>School/University *</label>
                <input type="text" class="edu-school" placeholder="University Name" required />
            </div>
            <div class="form-group">
                <label>Degree *</label>
                <input type="text" class="edu-degree" placeholder="Bachelor of Science" required />
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Field of Study *</label>
                <input type="text" class="edu-field" placeholder="Computer Science" required />
            </div>
            <div class="form-group">
                <label>Grade</label>
                <input type="text" class="edu-grade" placeholder="3.8/4.0" />
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Start Date</label>
                <input type="date" class="edu-start" />
            </div>
            <div class="form-group">
                <label>End Date</label>
                <input type="date" class="edu-end" />
            </div>
        </div>
        <button type="button" class="btn-remove" onclick="removeEducation(this)">Remove</button>
        <hr>
    `;
    container.appendChild(newEducation);
    setupLivePreview();
}

function removeEducation(btn) {
    btn.parentElement.remove();
    updatePreview();
}

function addExperience() {
    const container = document.getElementById('experienceFields');
    const newExperience = document.createElement('div');
    newExperience.className = 'experience-item';
    newExperience.innerHTML = `
        <div class="form-group">
            <label>Job Title *</label>
            <input type="text" class="exp-title" placeholder="Software Developer" required />
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Company *</label>
                <input type="text" class="exp-company" placeholder="Company Name" required />
            </div>
            <div class="form-group">
                <label>Location</label>
                <input type="text" class="exp-location" placeholder="City, Country" />
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Start Date</label>
                <input type="date" class="exp-start" />
            </div>
            <div class="form-group">
                <label>End Date</label>
                <input type="date" class="exp-end" />
            </div>
        </div>
        <div class="form-group">
            <label>
                <input type="checkbox" class="exp-current" />
                Currently Working
            </label>
        </div>
        <div class="form-group">
            <label>Description</label>
            <textarea class="exp-description" placeholder="Describe your responsibilities..." rows="3"></textarea>
        </div>
        <button type="button" class="btn-remove" onclick="removeExperience(this)">Remove</button>
        <hr>
    `;
    container.appendChild(newExperience);
    setupLivePreview();
}

function removeExperience(btn) {
    btn.parentElement.remove();
    updatePreview();
}

function addSkill() {
    const container = document.getElementById('skillsFields');
    const newSkill = document.createElement('div');
    newSkill.className = 'skill-item';
    newSkill.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label>Skill Name *</label>
                <input type="text" class="skill-name" placeholder="JavaScript" required />
            </div>
            <div class="form-group">
                <label>Proficiency</label>
                <select class="skill-level">
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate" selected>Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                </select>
            </div>
        </div>
        <button type="button" class="btn-remove" onclick="removeSkill(this)">Remove</button>
        <hr>
    `;
    container.appendChild(newSkill);
    setupLivePreview();
}

function removeSkill(btn) {
    btn.parentElement.remove();
    updatePreview();
}

function addCertification() {
    const container = document.getElementById('certificationsFields');
    const newCert = document.createElement('div');
    newCert.className = 'cert-item';
    newCert.innerHTML = `
        <div class="form-group">
            <label>Certification Name *</label>
            <input type="text" class="cert-name" placeholder="AWS Certified Solutions Architect" required />
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Issuing Organization</label>
                <input type="text" class="cert-organization" placeholder="Amazon Web Services" />
            </div>
            <div class="form-group">
                <label>Issue Date</label>
                <input type="date" class="cert-date" />
            </div>
        </div>
        <button type="button" class="btn-remove" onclick="removeCertification(this)">Remove</button>
        <hr>
    `;
    container.appendChild(newCert);
    setupLivePreview();
}

function removeCertification(btn) {
    btn.parentElement.remove();
    updatePreview();
}

// ==================== LIVE PREVIEW ====================

function setupLivePreview() {
    const form = document.getElementById('resumeForm');
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        input.addEventListener('input', updatePreview);
        input.addEventListener('change', updatePreview);
    });

    form.addEventListener('submit', handleFormSubmit);
}

function updatePreview() {
    updatePersonalInfo();
    updateSummaryPreview();
    updateEducationPreview();
    updateExperiencePreview();
    updateSkillsPreview();
    updateCertificationsPreview();
}

function updatePersonalInfo() {
    const firstName = document.getElementById('firstName').value || 'Your';
    const lastName = document.getElementById('lastName').value || 'Name';
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const location = document.getElementById('location').value;

    document.getElementById('previewName').textContent = `${firstName} ${lastName}`;
    
    let contactInfo = [];
    if (email) contactInfo.push(email);
    if (phone) contactInfo.push(phone);
    if (location) contactInfo.push(location);
    
    document.getElementById('previewContact').textContent = contactInfo.join(' • ');
}

function updateSummaryPreview() {
    const summary = document.getElementById('summary').value;
    const summarySection = document.getElementById('previewSummary');
    
    if (summary) {
        document.getElementById('summaryContent').textContent = summary;
        summarySection.style.display = 'block';
    } else {
        summarySection.style.display = 'none';
    }
}

function updateEducationPreview() {
    const items = document.querySelectorAll('.education-item');
    const preview = document.getElementById('educationPreview');
    const section = document.getElementById('previewEducation');
    preview.innerHTML = '';
    
    items.forEach(item => {
        const school = item.querySelector('.edu-school').value;
        const degree = item.querySelector('.edu-degree').value;
        const field = item.querySelector('.edu-field').value;
        const grade = item.querySelector('.edu-grade').value;
        const startDate = item.querySelector('.edu-start').value;
        const endDate = item.querySelector('.edu-end').value;

        if (school || degree) {
            const html = `
                <div class="preview-item">
                    <div class="preview-item-header">
                        <div class="preview-item-title">${degree} in ${field}</div>
                        <span class="preview-item-subtitle">${startDate} - ${endDate}</span>
                    </div>
                    <div class="preview-item-subtitle">${school}</div>
                    ${grade ? `<div class="preview-item-description">Grade: ${grade}</div>` : ''}
                </div>
            `;
            preview.innerHTML += html;
        }
    });

    section.style.display = preview.innerHTML ? 'block' : 'none';
}

function updateExperiencePreview() {
    const items = document.querySelectorAll('.experience-item');
    const preview = document.getElementById('experiencePreview');
    const section = document.getElementById('previewExperience');
    preview.innerHTML = '';
    
    items.forEach(item => {
        const title = item.querySelector('.exp-title').value;
        const company = item.querySelector('.exp-company').value;
        const location = item.querySelector('.exp-location').value;
        const startDate = item.querySelector('.exp-start').value;
        const endDate = item.querySelector('.exp-end').value;
        const current = item.querySelector('.exp-current').checked;
        const description = item.querySelector('.exp-description').value;

        if (title || company) {
            const dateRange = current ? `${startDate} - Present` : `${startDate} - ${endDate}`;
            const html = `
                <div class="preview-item">
                    <div class="preview-item-header">
                        <div class="preview-item-title">${title}</div>
                        <span class="preview-item-subtitle">${dateRange}</span>
                    </div>
                    <div class="preview-item-subtitle">${company}${location ? ` • ${location}` : ''}</div>
                    ${description ? `<div class="preview-item-description">${description}</div>` : ''}
                </div>
            `;
            preview.innerHTML += html;
        }
    });

    section.style.display = preview.innerHTML ? 'block' : 'none';
}

function updateSkillsPreview() {
    const items = document.querySelectorAll('.skill-item');
    const preview = document.getElementById('skillsPreview');
    const section = document.getElementById('previewSkills');
    preview.innerHTML = '';
    
    let skillsHtml = '<div class="preview-skills-list">';
    let hasSkills = false;
    
    items.forEach(item => {
        const name = item.querySelector('.skill-name').value;
        const level = item.querySelector('.skill-level').value;

        if (name) {
            skillsHtml += `<div class="skill-badge">${name} - ${level}</div>`;
            hasSkills = true;
        }
    });
    
    skillsHtml += '</div>';
    preview.innerHTML = skillsHtml;
    section.style.display = hasSkills ? 'block' : 'none';
}

function updateCertificationsPreview() {
    const items = document.querySelectorAll('.cert-item');
    const preview = document.getElementById('certificationsPreview');
    const section = document.getElementById('previewCertifications');
    preview.innerHTML = '';
    
    items.forEach(item => {
        const name = item.querySelector('.cert-name').value;
        const organization = item.querySelector('.cert-organization').value;
        const date = item.querySelector('.cert-date').value;

        if (name) {
            const html = `
                <div class="preview-item">
                    <div class="preview-item-header">
                        <div class="preview-item-title">${name}</div>
                        <span class="preview-item-subtitle">${date}</span>
                    </div>
                    ${organization ? `<div class="preview-item-subtitle">${organization}</div>` : ''}
                </div>
            `;
            preview.innerHTML += html;
        }
    });

    section.style.display = preview.innerHTML ? 'block' : 'none';
}

// ==================== FORM SUBMISSION & BACKEND ====================

async function handleFormSubmit(event) {
    event.preventDefault();
    
    showLoading(true);
    
    const resumeData = collectResumeData();

    try {
        // Try to send to backend
        const response = await fetch('/api/resume/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(resumeData)
        });

        const result = await response.json();

        if (response.ok) {
            saveResumeLocally(resumeData);
            showSuccess('Resume saved successfully!');
        } else {
            saveResumeLocally(resumeData);
            showSuccess('Resume saved locally!');
        }
    } catch (error) {
        // Fallback to local storage
        saveResumeLocally(resumeData);
        showSuccess('Resume saved locally!');
    }
    
    showLoading(false);
}

function collectResumeData() {
    const education = [];
    document.querySelectorAll('.education-item').forEach(item => {
        education.push({
            school: item.querySelector('.edu-school').value,
            degree: item.querySelector('.edu-degree').value,
            field: item.querySelector('.edu-field').value,
            grade: item.querySelector('.edu-grade').value,
            startDate: item.querySelector('.edu-start').value,
            endDate: item.querySelector('.edu-end').value
        });
    });

    const experience = [];
    document.querySelectorAll('.experience-item').forEach(item => {
        experience.push({
            title: item.querySelector('.exp-title').value,
            company: item.querySelector('.exp-company').value,
            location: item.querySelector('.exp-location').value,
            startDate: item.querySelector('.exp-start').value,
            endDate: item.querySelector('.exp-end').value,
            current: item.querySelector('.exp-current').checked,
            description: item.querySelector('.exp-description').value
        });
    });

    const skills = [];
    document.querySelectorAll('.skill-item').forEach(item => {
        skills.push({
            name: item.querySelector('.skill-name').value,
            level: item.querySelector('.skill-level').value
        });
    });

    const certifications = [];
    document.querySelectorAll('.cert-item').forEach(item => {
        certifications.push({
            name: item.querySelector('.cert-name').value,
            organization: item.querySelector('.cert-organization').value,
            date: item.querySelector('.cert-date').value
        });
    });

    return {
        personal: {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            location: document.getElementById('location').value,
            summary: document.getElementById('summary').value
        },
        education,
        experience,
        skills,
        certifications,
        createdAt: new Date().toISOString()
    };
}

function saveResumeLocally(data) {
    let resumes = JSON.parse(localStorage.getItem('resumes')) || [];
    data.id = Date.now().toString();
    resumes.push(data);
    localStorage.setItem('resumes', JSON.stringify(resumes));
}

// ==================== PREVIEW & EXPORT ====================

function previewResume() {
    if (isMobileView) {
        const preview = document.querySelector('.preview-section');
        preview.classList.add('mobile-preview-open');
        document.body.style.overflow = 'hidden';
    } else {
        const preview = document.getElementById('resumePreview');
        preview.scrollIntoView({ behavior: 'smooth' });
    }
}

function closePreview() {
    const preview = document.querySelector('.preview-section');
    preview.classList.remove('mobile-preview-open');
    document.body.style.overflow = 'auto';
}

function printResume() {
    window.print();
}

async function downloadPDF() {
    alert('PDF download requires html2pdf library. Use Print and Save as PDF instead.');
}

function shareResume() {
    const resumeData = collectResumeData();
    const text = `${resumeData.personal.firstName} ${resumeData.personal.lastName} - ${resumeData.personal.email}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Resume',
            text: text,
            url: window.location.href
        });
    } else {
        alert('Share not supported on this device. Copy the link to share manually.');
    }
}

// ==================== MODAL & LOADING ====================

function showSuccess(message) {
    document.getElementById('modalMessage').textContent = message;
    document.getElementById('successModal').classList.remove('hide');
}

function closeModal() {
    document.getElementById('successModal').classList.add('hide');
}

function showLoading(show) {
    const loader = document.getElementById('loadingIndicator');
    if (show) {
        loader.classList.remove('hide');
    } else {
        loader.classList.add('hide');
    }
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('successModal');
    if (event.target === modal) {
        closeModal();
    }
});

// ==================== UTILITY FUNCTIONS ====================

function showMobileInfo() {
    alert('Resume Builder\n\nCreate professional resumes on mobile and desktop.\n\nVersion 1.0');
}
