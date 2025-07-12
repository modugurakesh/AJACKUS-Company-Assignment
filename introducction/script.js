document.addEventListener('DOMContentLoaded', () => {

    // --- Hero Parallax Effect ---
    window.addEventListener('scroll', () => {
        const hero = document.getElementById('hero');
        let scrollPosition = window.pageYOffset;
        if (hero) { // Ensure hero exists before manipulating
            hero.style.backgroundPositionY = `-${scrollPosition * 0.4}px`;
        }
    });

    // --- About Section ---
    const aboutContentDiv = document.getElementById('about-content');
    const aboutData = {
        name: "Your Name",
        title: "Web Developer",
        description: "I'm a passionate web developer with a focus on creating...",
        image: "profile.jpg"
    };

    if (aboutContentDiv) { // Ensure the element exists
        aboutContentDiv.innerHTML = `
          <img src="${aboutData.image}" alt="Profile Picture">
          <h2>${aboutData.name}</h2>
          <h3>${aboutData.title}</h3>
          <p>${aboutData.description}</p>
      `;
    }

    // --- Skills Section (with icons) ---
    const skillsContainer = document.querySelector('.skills-container');
    const skillsData = [{
            name: "HTML",
            icon: "fab fa-html5"
        },
        {
            name: "CSS",
            icon: "fab fa-css3-alt"
        },
        {
            name: "Bootstrap",
            icon: "fa-brands fa-bootstrap"
        },
        {
            name: "JavaScript",
            icon: "fab fa-js-square"
        },
        {
            name: "Node JS",
            icon: "fab fa-node-js"
        },
        {
            name: "React JS",
            icon: "fab fa-react"
        },
        {
            name: "Python",
            icon: "fa-brands fa-python"
        }, {
            name: "SQL",
            icon: "fa-solid fa-database"
        },
        {
            name: "Git",
            icon: "fa-brands fa-git-alt"
        },

    ];

    if (skillsContainer) {
        skillsData.forEach(skill => {
            const skillDiv = document.createElement('div');
            skillDiv.classList.add('skill');
            skillDiv.innerHTML = `
              <i class="${skill.icon}"></i>
              <h4>${skill.name}</h4>
          `;
            skillsContainer.appendChild(skillDiv);
        });
    }

    // --- Timeline Section ---
    const timelineContainer = document.querySelector('.timeline-container');
    const timelineData = [{
            year: "2020",
            title: "Started Learning",
            description: "Began my web development journey..."
        },
        {
            year: "2021",
            title: "Built First Project",
            description: "Created a simple to-do list app..."
        },
        {
            year: "2022",
            title: "Internship",
            description: "Worked as a frontend intern..."
        },
        {
            year: "2023",
            title: "Freelance Work",
            description: "Started taking on freelance projects..."
        }
    ];

    if (timelineContainer) {
        timelineData.forEach((item, index) => {
            const timelineItem = document.createElement('div');
            timelineItem.classList.add('timeline-item');
            timelineItem.innerHTML = `
              <div class="timeline-content">
                  <h3>${item.title} (${item.year})</h3>
                  <p>${item.description}</p>
              </div>
          `;
            timelineContainer.appendChild(timelineItem);

            // Alternate content placement for even items
            if (index % 2 === 0) {
                timelineItem.classList.add('timeline-item-even');
            }
        });
    }

    // --- Project Carousel ---
    const carousel = document.querySelector('.carousel');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    const projectData = [{
            title: "Project 1",
            description: "Description of project 1",
            link: "#"
        },
        {
            title: "Project 2",
            description: "Description of project 2",
            link: "#"
        },
        {
            title: "Project 3",
            description: "Description of project 3",
            link: "#"
        }
    ];

    if (carousel && prevButton && nextButton) {
        projectData.forEach(project => {
            const projectDiv = document.createElement('div');
            projectDiv.classList.add('carousel-item');
            projectDiv.innerHTML = `
              <h3>${project.title}</h3>
              <p>${project.description}</p>
              <a href="${project.link}" target="_blank">View Project</a>
          `;
            carousel.appendChild(projectDiv);
        });

        let currentIndex = 0;

        function updateCarousel() {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % projectData.length;
            updateCarousel();
        });

        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + projectData.length) % projectData.length;
            updateCarousel();
        });
    }

    // --- Testimonials Section ---
    const testimonialsContainer = document.querySelector('.testimonials-container');
    const testimonialsData = [{
            quote: "Excellent work!",
            author: "Client A"
        },
        {
            quote: "Highly recommended!",
            author: "Client B"
        },
        {
            quote: "Great communication and skills!",
            author: "Client C"
        }
    ];

    if (testimonialsContainer) {
        testimonialsData.forEach(testimonial => {
            const testimonialDiv = document.createElement('div');
            testimonialDiv.classList.add('testimonial');
            testimonialDiv.innerHTML = `
                <p>"${testimonial.quote}"</p>
                <cite>- ${testimonial.author}</cite>
            `;
            testimonialsContainer.appendChild(testimonialDiv);
        });
    }

    // --- Contact Form Validation and Email Sending ---
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default form submission
            let isValid = true;
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');

            // Clear previous error messages
            document.querySelectorAll('.error-message').forEach(msg => msg.style.display = 'none');

            // Validate Name
            if (!nameInput.value.trim()) {
                document.querySelector('#name ~ .error-message').style.display = 'block';
                isValid = false;
            }

            // Validate Email
            if (!emailInput.value.trim()) {
                document.querySelector('#email ~ .error-message').textContent = 'Please enter your email address.';
                document.querySelector('#email ~ .error-message').style.display = 'block';
                isValid = false;
            } else if (!isValidEmail(emailInput.value.trim())) {
                document.querySelector('#email ~ .error-message').textContent = 'Please enter a valid email address.';
                document.querySelector('#email ~ .error-message').style.display = 'block';
                isValid = false;
            }

            // Validate Message
            if (!messageInput.value.trim()) {
                document.querySelector('#message ~ .error-message').style.display = 'block';
                isValid = false;
            }

            if (isValid) {
                // If the form is valid, send the email
                sendEmail(nameInput.value, emailInput.value, messageInput.value);
            }
        });
    }

    // Email validation helper function
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function sendEmail(name, email, message) {
        // Use a service like EmailJS, Formspree, or a server-side endpoint to send emails
        // Here's an example using EmailJS (you'll need an EmailJS account and template)

        // EmailJS: https://www.emailjs.com/
        // 1. Sign up for EmailJS
        // 2. Create an email template in EmailJS
        // 3. Get your User ID, Service ID, and Template ID
        // 4. Replace the placeholder values below

        const serviceID = "YOUR_SERVICE_ID"; // Replace with your EmailJS Service ID
        const templateID = "YOUR_TEMPLATE_ID"; // Replace with your EmailJS Template ID
        const userID = "YOUR_USER_ID"; // Replace with your EmailJS User ID

        emailjs.init(userID); // Initialize EmailJS with your User ID

        const templateParams = {
            from_name: name,
            from_email: email,
            message: message,
            to_email: 'rakeshmodugu@94gmail.com' // Your email address
        };

        emailjs.send(serviceID, templateID, templateParams)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                alert('Email sent successfully!');
                // Optionally, clear the form fields
                document.getElementById('name').value = '';
                document.getElementById('email').value = '';
                document.getElementById('message').value = '';
            }, function(error) {
                console.error('FAILED...', error);
                alert('Failed to send email. Please try again later.');
            });
    }




    // --- Theme Switching ---
    const themeToggle = document.getElementById('theme-toggle');

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
        });
    }

    // --- Scroll-to-Top Button ---
    const scrollToTopButton = document.getElementById('scroll-to-top');

    if (scrollToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollToTopButton.style.display = "block";
            } else {
                scrollToTopButton.style.display = "none";
            }
        });

        scrollToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- Mobile Menu Functionality ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
});

const projectCards = document.querySelectorAll('.project-card');
const projectModal = document.getElementById('project-modal');
const modalTitle = document.getElementById('modal-title');
const modalImage = document.getElementById('modal-image');
const modalDescription = document.getElementById('modal-description'); // Use correct ID
const modallDescription = document.getElementById('modall-description');

const modalLiveLink = document.getElementById('modal-live-link');
const modalGithubLink = document.getElementById('modal-github-link');
const closeModalButton = document.querySelector('.close-button');

projectCards.forEach(card => {
    card.addEventListener('click', (event) => {
        event.preventDefault();
        const projectId = card.dataset.projectId;

        // Replace with your actual project data retrieval logic (e.g., from an array or API)
        const projectData = getProjectData(projectId);

        if (projectData) {
            modalTitle.textContent = projectData.title;
            modalImage.src = projectData.image;
            modallDescription.textContent = projectData.para;

            modalDescription.textContent = projectData.description;

            modalLiveLink.href = projectData.liveLink;
            modalGithubLink.href = projectData.githubLink;

            projectModal.style.display = 'block';
        }
    });
});

closeModalButton.addEventListener('click', () => {
    projectModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target == projectModal) {
        projectModal.style.display = 'none';
    }
});

// Function to get project data (replace with your actual data source)
function getProjectData(projectId) {
    // This is just placeholder data.  Replace with your actual data.  Make SURE the project ID matches the data-project-id on the card
    const projects = [{
            id: '1', // MUST match data-project-id on project-card
            title: 'Jobby App',
            image: 'https://res.cloudinary.com/dlbya3dn4/image/upload/v1742029624/2025-03-15_5_g1jwzw.png',
            description: 'Password: rahul@2021',
            para: 'username: rahul',
            liveLink: 'https://rockyapp.ccbp.tech/',
            githubLink: 'https://github.com/modugurakesh/Jobby-App'
        },
        {
            id: '2', // MUST match data-project-id on project-card
            title: 'Insta Clone',
            image: 'https://res.cloudinary.com/dlbya3dn4/image/upload/v1742030343/2025-03-15_6_n6hdmb.png',
            description: 'Password: rahul@2021',
            para: 'username: rahul',
            liveLink: 'https://rockyinstgram.ccbp.tech/',
            githubLink: 'https://github.com/modugurakesh/Insta-clone'
        },

    ];

    return projects.find(project => project.id === projectId);
}
document.getElementById('current-year').textContent = "Linkedin";